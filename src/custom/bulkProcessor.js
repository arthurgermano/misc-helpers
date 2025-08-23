// =================================================================================================
// ARQUIVO:      BulkProcessor.js
// OBJETIVO:     Fornecer uma classe genérica e de alta performance para processamento de dados
//               em lote (bulk). Abstrai a complexidade de acumular itens, enviá-los em
//               batches, e gerenciar concorrência e finalização segura.
// =================================================================================================
const defaultNumeric = require("../helpers/defaultNumeric.js");

/**
 * @typedef {object} Logger
 * @description Define a interface para um logger compatível.
 * @property {(message: string, context?: object) => void} info - Função para logar mensagens informativas.
 * @property {(message: string, context?: object) => void} error - Função para logar mensagens de erro.
 */

/**
 * @typedef {object} BulkProcessorOptions
 * @property {number} [limit=1000] - O número de itens a acumular antes de disparar o processamento do lote. Será forçado para no mínimo 1.
 * @property {Logger} [logger] - Uma instância de logger estruturado. Se não for fornecido, um logger silencioso será usado.
 * @property {any} [payload={}] - Um objeto de dados estático que será passado para todos os callbacks.
 * @property {any} [serviceContext=null] - Um contexto de serviço ou de dados que será passado para os callbacks.
 * @property {(params: { batch: any[], payload: any, serviceContext: any, logger: Logger }) => Promise<void>} [onFlush] - Callback assíncrono chamado para processar um lote.
 * @property {(params: { buffer: any[], payload: any, item: any, serviceContext: any, logger: Logger }) => Promise<void>} [onAdd] - Callback assíncrono chamado a cada item adicionado.
 * @property {(params: { payload: any, serviceContext: any, logger: Logger }) => Promise<void>} [onEnd] - Callback assíncrono chamado quando o método `end()` é invocado, antes do flush final.
 */

/**
 * @class BulkProcessor
 * @description Gerencia o processamento de itens em lote (bulk).
 * A classe acumula itens em um buffer interno e invoca um callback de processamento
 * assíncrono quando o tamanho do lote atinge um limite definido. É ideal para otimizar
 * operações de I/O, como inserções em banco de dados ou chamadas para APIs.
 *
 * @example
 * // Uso padrão com a nova API de opções
 * const processor = new BulkProcessor({
 * limit: 100,
 * onFlush: async ({ batch }) => {
 * console.log(`Processing ${batch.length} items.`);
 * // ...lógica de inserção no banco de dados...
 * }
 * });
 *
 * for (let i = 0; i < 1000; i++) {
 * processor.add({ id: i, data: `item-${i}` });
 * }
 * await processor.end();
 */
class BulkProcessor {
  /** @private @type {any[]} */
  #buffer = [];
  /** @private @type {number} */
  #limit;
  /** @private @type {number} */
  #maxBufferSize;
  /** @private @type {number} */
  #maxConcurrentFlushes;
  /** @private @type {number} */
  #activeFlushes = 0;
  /** @private @type {boolean} */
  #isEnding = false;
  /** @private @type {Logger} */
  #logger;
  /** @private @type {any} */
  #payload;
  /** @private @type {any} */
  #serviceContext;
  /** @private @type {number} */
  #retries;
  /** @private @type {number} */
  #retryDelayMs;
  /** @private @type {number} */
  #flushTimeoutMs;
  /** @private @type {{onAdd?: Function, onFlush?: Function, onEnd?: Function, onBackpressure?: Function, onFlushFailure?: Function}} */
  #callbacks;

  /**
   * Constrói e configura uma nova instância do BulkProcessor.
   * Este método é projetado para ser flexível, suportando tanto uma assinatura
   * moderna baseada em um único objeto de opções quanto uma assinatura legada
   * para garantir a retrocompatibilidade.
   *
   * @param {BulkProcessorOptions | object} [arg1={}] - O objeto de opções ou o `payload` (legado).
   * @param {object} [arg2={}] - O objeto `callbackFunctions` (legado).
   * @param {object} [arg3={}] - O objeto `options` (legado).
   */
  constructor(arg1 = {}, arg2 = {}, arg3 = {}) {
    let options;

    // Bloco de compatibilidade para a assinatura legada (payload, callbacks, options).
    // Se os argumentos 2 ou 3 forem fornecidos, o construtor assume que a assinatura
    // antiga está em uso e remapeia os parâmetros para o novo formato de 'options'.
    if (Object.keys(arg2).length > 0 || Object.keys(arg3).length > 0) {
      const payload = arg1;
      const callbackFunctions = arg2;
      const otherOptions = arg3;
      options = {
        ...otherOptions,
        payload: otherOptions.payload || payload,
        onAdd: otherOptions.onAdd || callbackFunctions.onAddCallback,
        onFlush: otherOptions.onFlush || callbackFunctions.onFlushCallback,
        onEnd: otherOptions.onEnd || callbackFunctions.onEndCallback,
      };
    } else {
      options = arg1;
    }

    // Define os padrões para todas as configurações e extrai os valores fornecidos pelo usuário.
    const {
      limit: userLimit = 1000,
      maxBufferSize,
      maxConcurrentFlushes = 3,
      flushTimeoutMs = 30000,
      retries = 0,
      retryDelayMs = 1000,
      logger = {
        info: () => {},
        error: () => {},
        warn: () => {},
        debug: () => {},
      },
      payload = {},
      serviceContext = null,
      onFlush,
      onAdd,
      onEnd,
      onBackpressure,
      onFlushFailure,
    } = options;

    // --- Sanitização e Validação dos Parâmetros ---
    // Esta seção "blinda" o processador contra configurações inválidas ou inseguras,
    // garantindo que os valores numéricos sejam válidos e estejam dentro de limites razoáveis.
    this.#limit = Math.max(defaultNumeric(userLimit, 1), 1);
    // O buffer deve ter espaço para pelo menos dois lotes completos para evitar backpressure prematuro.
    this.#maxBufferSize = Math.max(
      this.#limit * 2,
      defaultNumeric(maxBufferSize, 0)
    );
    // Deve haver pelo menos 1 slot de processamento concorrente (comportamento sequencial).
    this.#maxConcurrentFlushes = Math.max(
      1,
      defaultNumeric(maxConcurrentFlushes, 3)
    );
    // O número de retries não pode ser negativo.
    this.#retries = Math.max(0, defaultNumeric(retries, 0));
    // Garante um delay mínimo para evitar loops de retry muito agressivos.
    this.#retryDelayMs = Math.max(100, defaultNumeric(retryDelayMs, 1000));
    // Garante um timeout mínimo para o flush.
    this.#flushTimeoutMs = Math.max(500, defaultNumeric(flushTimeoutMs, 30000));

    // Atribuição das propriedades da instância.
    this.#logger = logger;
    this.#payload = payload;
    this.#serviceContext = serviceContext;
    this.#callbacks = { onFlush, onAdd, onEnd, onBackpressure, onFlushFailure };

    // Log de inicialização para observabilidade, registrando a configuração final aplicada.
    this.#logger.info(`BulkProcessor inicializado.`, {
      limit: this.#limit,
      maxBufferSize: this.#maxBufferSize,
      maxConcurrentFlushes: this.#maxConcurrentFlushes,
      retries: this.#retries,
      retryDelayMs: this.#retryDelayMs,
      flushTimeoutMs: this.#flushTimeoutMs,
    });
  }

  /**
   * Adiciona um item à fila de processamento de forma assíncrona.
   *
   * Este é o principal método para popular o processador. Ele gerencia a lógica de backpressure:
   * se o buffer interno atingir sua capacidade máxima (`maxBufferSize`), a execução
   * deste método será pausada até que haja espaço disponível. Isso previne o consumo
   * excessivo de memória sob alta carga.
   *
   * A chamada ao callback `onAdd` é realizada de forma "fire-and-forget" e não bloqueia a adição do item.
   *
   * @param {*} item - O item a ser adicionado ao lote.
   * @returns {Promise<void>} Uma promessa que resolve quando o item foi adicionado com sucesso ao buffer.
   */
  async add(item) {
    // Trava de segurança para impedir a adição de itens durante o processo de finalização.
    if (this.#isEnding) {
      this.#logger.info(
        "Processador em estado de finalização. Novos itens estão sendo ignorados.",
        { item }
      );
      return;
    }

    // --- Lógica de Backpressure ---
    // Se o buffer atingiu a capacidade máxima, o processador entra em estado de espera.
    if (this.#buffer.length >= this.#maxBufferSize) {
      // Notifica o sistema de que o backpressure foi ativado. A chamada é feita
      // de forma não-bloqueante para não travar o processo principal.
      if (this.#callbacks.onBackpressure) {
        Promise.resolve(
          this.#callbacks.onBackpressure({
            bufferSize: this.#buffer.length,
            maxBufferSize: this.#maxBufferSize,
            item, // Informa qual item está aguardando para ser adicionado.
          })
        ).catch((error) => {
          this.#logger.error("Erro no callback onBackpressure.", {
            errorMessage: error.message,
          });
        });
      }

      // Aguarda em um laço até que o buffer tenha espaço novamente.
      while (this.#buffer.length >= this.#maxBufferSize) {
        // Pausa a execução por um curto período para evitar consumo de CPU (busy-waiting)
        // e permite que a event loop processe os flushes em andamento.
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }

    // O item é adicionado ao buffer somente após a liberação do backpressure.
    this.#buffer.push(item);

    // O callback onAdd é invocado de forma não-bloqueante para não impactar a performance de adição.
    if (this.#callbacks.onAdd) {
      try {
        // `Promise.resolve()` garante que mesmo um onAdd síncrono seja tratado como uma promessa.
        Promise.resolve(
          this.#callbacks.onAdd({
            buffer: this.#buffer,
            payload: this.#payload,
            item,
            serviceContext: this.#serviceContext,
            logger: this.#logger,
          })
        ).catch((error) => {
          this.#logger.error(`Erro não tratado no callback onAdd.`, {
            errorMessage: error.message,
          });
        });
      } catch (syncError) {
        // Este catch é uma segurança extra para callbacks síncronos que podem lançar exceções.
        this.#logger.error(`Erro síncrono no callback onAdd.`, {
          errorMessage: syncError.message,
        });
      }
    }

    // Verifica se o buffer atingiu o limite para um lote e dispara o processamento.
    if (this.#buffer.length >= this.#limit) {
      this.flush();
    }
  }

  /**
   * Dispara o processamento de lotes de forma síncrona e não-bloqueante.
   *
   * Atua como um "despachante": ele verifica o estado atual do buffer e os slots
   * de concorrência disponíveis e inicia quantas operações de processamento (`#executeFlush`)
   * forem possíveis, até o limite de `maxConcurrentFlushes`.
   *
   * Este método é chamado automaticamente pelo `add()` e `end()`, mas também pode ser
   * invocado manualmente para forçar o processamento de um lote parcial.
   */
  flush() {
    // Este laço é o coração da concorrência. Enquanto houver itens e "trabalhadores" (slots)
    // disponíveis, ele continuará despachando novos trabalhos.
    while (
      this.#buffer.length > 0 &&
      this.#activeFlushes < this.#maxConcurrentFlushes
    ) {
      const batch = this.#buffer.splice(0, this.#limit);
      // Dispara a execução sem esperar (fire-and-forget) para permitir que múltiplos
      // flushes ocorram em paralelo. O gerenciamento do estado assíncrono é feito em #executeFlush.
      this.#executeFlush(batch);
    }
  }

  /**
   * O motor de processamento assíncrono para um único lote.
   *
   * Este método privado encapsula toda a lógica complexa de uma operação de flush,
   * incluindo:
   * 1. Gerenciamento do timeout da operação (`flushTimeoutMs`).
   * 2. Implementação da política de retries (`retries` e `retryDelayMs`).
   * 3. Invocação do callback `onFlushFailure` para lotes que falham permanentemente.
   * 4. Gerenciamento do contador de flushes ativos.
   * 5. Disparo reativo do próximo ciclo de `flush` para manter o pipeline de processamento ativo.
   *
   * @private
   * @param {any[]} batch - O lote de itens que esta execução irá processar.
   * @returns {Promise<void>}
   */
  async #executeFlush(batch) {
    // Incrementa o contador de operações ativas. Este é o início do ciclo de vida de um flush.
    this.#activeFlushes++;
    this.#logger.info(
      `Iniciando processamento de lote com ${batch.length} itens. Ativos: ${
        this.#activeFlushes
      }`
    );

    let lastError = null;

    // Laço de tentativas: executa a tentativa inicial (attempt 0) + o número de retries configurado.
    for (let attempt = 0; attempt <= this.#retries; attempt++) {
      try {
        // Caso de borda: se nenhum onFlush for fornecido, descarta o lote intencionalmente.
        if (!this.#callbacks.onFlush) {
          this.#logger.info(
            `Nenhum callback onFlush definido. Lote de ${batch.length} itens descartado.`
          );
          lastError = null; // Garante que não será tratado como uma falha.
          break;
        }

        if (attempt > 0) {
          this.#logger.info(
            `Tentativa ${attempt}/${this.#retries} para o lote.`
          );
        }

        // Executa o onFlush em uma "corrida" contra um timer de timeout.
        let timeoutId;
        const timeoutPromise = new Promise((_, reject) => {
          timeoutId = setTimeout(
            () =>
              reject(
                new Error(`Flush timed out after ${this.#flushTimeoutMs}ms`)
              ),
            this.#flushTimeoutMs
          );
        });

        try {
          await Promise.race([
            this.#callbacks.onFlush({
              batch,
              payload: this.#payload,
              serviceContext: this.#serviceContext,
              logger: this.#logger,
            }),
            timeoutPromise,
          ]);
        } finally {
          // CRÍTICO: Limpa o timeout para evitar que ele dispare mais tarde
          // e cause um unhandled rejection, caso o flush termine antes do tempo.
          clearTimeout(timeoutId);
        }

        // Se a execução chegou aqui, o lote foi processado com sucesso.
        this.#logger.info(
          `Lote de ${batch.length} itens processado com sucesso.`
        );
        lastError = null;
        break; // Sai do laço de retries.
      } catch (error) {
        // Ocorreu uma falha (seja do onFlush ou do timeout).
        lastError = error;

        if (attempt >= this.#retries) {
          // Se esta foi a última tentativa, registra um erro definitivo.
          this.#logger.error(
            `Falha definitiva ao processar o lote após ${attempt} tentativa(s).`,
            {
              errorMessage: error.message,
              batchSize: batch.length,
            }
          );
        } else {
          // Se ainda há tentativas, avisa e aguarda o delay para tentar novamente.
          this.#logger.warn(
            `Falha na tentativa ${attempt} de processar o lote. Tentando novamente em ${
              this.#retryDelayMs
            }ms...`,
            {
              errorMessage: error.message,
            }
          );
          await new Promise((resolve) =>
            setTimeout(resolve, this.#retryDelayMs)
          );
        }
      }
    }

    // --- Pós-processamento do Lote ---

    // Se um erro persistiu após todas as retries, aciona o callback de falha definitiva.
    // Este é o gancho para o usuário implementar uma "dead-letter queue".
    if (lastError && this.#callbacks.onFlushFailure) {
      try {
        await this.#callbacks.onFlushFailure({
          batch,
          error: lastError,
          payload: this.#payload,
          serviceContext: this.#serviceContext,
          logger: this.#logger,
        });
        this.#logger.info(
          `Callback onFlushFailure executado para o lote com falha.`
        );
      } catch (failureCallbackError) {
        // Segurança: captura erros no próprio callback de falha para não quebrar o processador.
        this.#logger.error(`Erro CRÍTICO no próprio callback onFlushFailure.`, {
          errorMessage: failureCallbackError.message,
        });
      }
    }

    // --- Finalização e Reativação ---

    // Decrementa o contador de operações ativas, liberando um slot de concorrência.
    this.#activeFlushes--;
    this.#logger.info(
      `Processamento de lote finalizado. Ativos: ${this.#activeFlushes}`
    );
    // Dispara um novo ciclo de flush. Esta chamada reativa é a chave para manter
    // o processador funcionando em capacidade máxima, preenchendo o slot que acabou de ser liberado.
    this.flush();
  }

  /**
   * Finaliza o processador, garantindo que todos os itens pendentes sejam processados.
   * Este método é idempotente (seguro para ser chamado múltiplas vezes) e DEVE ser
   * invocado ao final do ciclo de vida da aplicação para evitar perda de dados.
   *
   * @param {number} [forceTimeoutMs=30000] - Tempo máximo em milissegundos para aguardar a
   * finalização dos lotes em processamento. Se o tempo for excedido, o processo é
   * encerrado e um aviso é logado com os itens restantes.
   * @returns {Promise<void>} Uma promessa que resolve quando todos os itens forem
   * processados ou quando o timeout for atingido.
   */
  async end(forceTimeoutMs = 30000) {
    // Garante que a lógica de finalização execute apenas uma vez.
    if (this.#isEnding) {
      return;
    }
    // Sinaliza para outras partes do processador (como o método `add`) que o desligamento começou.
    this.#isEnding = true;
    const endStartTime = Date.now();

    this.#logger.info("Finalizando o processador...", {
      itemsNoBuffer: this.#buffer.length,
      activeFlushes: this.#activeFlushes,
    });

    // Executa o callback de finalização do usuário, se fornecido.
    if (this.#callbacks.onEnd) {
      try {
        await this.#callbacks.onEnd({
          /* ... */
        });
      } catch (error) {
        this.#logger.error(`Erro no callback onEnd.`, {
          errorMessage: error.message,
        });
      }
    }

    // Dispara um último ciclo de flush para processar qualquer item restante no buffer.
    this.flush();

    // Aguarda o "esvaziamento" do processador, respeitando o timeout.
    // O laço continua enquanto houver itens no buffer ou operações de flush ativas.
    while (
      (this.#buffer.length > 0 || this.#activeFlushes > 0) &&
      Date.now() - endStartTime < forceTimeoutMs
    ) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    // Se o laço terminou mas ainda há trabalho pendente, significa que o timeout foi atingido.
    if (this.#buffer.length > 0 || this.#activeFlushes > 0) {
      this.#logger.warn(
        "Finalização forçada por timeout. Itens não processados foram descartados.",
        {
          remainingItems: this.#buffer.length,
          activeFlushes: this.#activeFlushes,
        }
      );
    }

    this.#logger.info("Processador finalizado.");
  }
}

// =================================================================================================
// Exportação da classe para o sistema de módulos do Node.js (CommonJS).
// Permite que a classe seja importada e instanciada em outros arquivos via `require` ou `import`.
// =================================================================================================
module.exports = BulkProcessor;