// =================================================================================================
// ARQUIVO:      BulkProcessor.js
// OBJETIVO:     Fornecer uma classe genérica e de alta performance para processamento de dados
//               em lote (bulk). Abstrai a complexidade de acumular itens, enviá-los em
//               batches, e gerenciar concorrência e finalização segura.
// DATA:         22/08/2025
// =================================================================================================

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
  /** @private @type {boolean} */
  #isFlushing = false;
  /** @private @type {boolean} */
  #isEnding = false;
  /** @private @type {Logger} */
  #logger;
  /** @private @type {any} */
  #payload;
  /** @private @type {any} */
  #serviceContext;
  /** @private @type {{onAdd?: Function, onFlush?: Function, onEnd?: Function}} */
  #callbacks;

  /**
   * Cria uma instância do BulkProcessor.
   * @param {BulkProcessorOptions | object} [arg1={}] - O objeto de opções ou o `payload` (legado).
   * @param {object} [arg2={}] - O objeto `callbackFunctions` (legado).
   * @param {object} [arg3={}] - O objeto `options` (legado).
   */
  constructor(arg1 = {}, arg2 = {}, arg3 = {}) {
    let options;

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

    const {
      limit: userLimit = 1000,
      logger = { info: () => {}, error: () => {} },
      payload = {},
      serviceContext = null,
      onFlush,
      onAdd,
      onEnd,
    } = options;

    // Garante que o limite seja sempre um número positivo, no mínimo 1, para evitar loops infinitos.
    this.#limit = Math.max(1, userLimit);
    this.#logger = logger;
    this.#payload = payload;
    this.#serviceContext = serviceContext;
    this.#callbacks = { onFlush, onAdd, onEnd };

    this.#logger.info(`BulkProcessor inicializado.`, { limit: this.#limit });
  }

  /**
   * Adiciona um item à fila de processamento. A chamada ao callback onAdd é assíncrona e não-bloqueante.
   * @param {*} item - O item a ser adicionado ao lote.
   */
  add(item) {
    if (this.#isEnding) {
      this.#logger.info(
        "Processador em estado de finalização. Novos itens estão sendo ignorados.",
        { item }
      );
      return;
    }

    this.#buffer.push(item);

    if (this.#callbacks.onAdd) {
      try {
        // CORREÇÃO: Envolve a chamada em Promise.resolve() para tratar
        // tanto funções síncronas quanto assíncronas de forma segura.
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
        // Adiciona um catch extra para o caso de a função onAdd em si ser síncrona e lançar um erro.
        this.#logger.error(`Erro síncrono no callback onAdd.`, {
          errorMessage: syncError.message,
        });
      }
    }

    if (this.#buffer.length >= this.#limit) {
      this.flush();
    }
  }

  /**
   * Processa os itens acumulados no buffer de forma contínua até esvaziá-lo.
   * @returns {Promise<void>} Uma promessa que resolve quando o ciclo de flush atual termina.
   */
  async flush() {
    if (this.#isFlushing || this.#buffer.length === 0) {
      return;
    }

    this.#isFlushing = true;

    try {
      while (this.#buffer.length > 0) {
        const batch = this.#buffer.splice(0, this.#limit);
        this.#logger.info(`Processando lote de ${batch.length} itens.`);

        if (!this.#callbacks.onFlush) {
          this.#logger.info(
            `Nenhum callback onFlush definido. Lote de ${batch.length} itens descartado.`
          );
          continue;
        }

        try {
          await this.#callbacks.onFlush({
            batch,
            payload: this.#payload,
            serviceContext: this.#serviceContext,
            logger: this.#logger,
          });
          this.#logger.info(
            `Lote de ${batch.length} itens processado com sucesso.`
          );
        } catch (error) {
          this.#logger.error("Falha crítica ao processar o lote.", {
            errorMessage: error.message,
            errorStack: error.stack,
            batchSize: batch.length,
          });
        }
      }
    } finally {
      this.#isFlushing = false;
      this.#logger.info(
        `Ciclo de flush finalizado. Buffer com ${this.#buffer.length} itens.`
      );
    }
  }

  /**
   * Finaliza o processador, garantindo que todos os itens pendentes sejam processados.
   * Este método é idempotente e DEVE ser chamado para evitar perda de dados.
   * @returns {Promise<void>} Uma promessa que resolve quando todos os itens forem processados.
   */
  async end() {
    if (this.#isEnding) {
      return;
    }
    this.#isEnding = true;

    this.#logger.info("Finalizando o processador...");

    if (this.#callbacks.onEnd) {
      try {
        await this.#callbacks.onEnd({
          payload: this.#payload,
          serviceContext: this.#serviceContext,
          logger: this.#logger,
        });
      } catch (error) {
        this.#logger.error(`Erro no callback onEnd.`, {
          errorMessage: error.message,
        });
      }
    }

    await this.flush();

    this.#logger.info("Processador finalizado. Nenhum item pendente.");
  }
}

// =================================================================================================
// Exporta a classe diretamente para uso com 'new BulkProcessor()'.
// =================================================================================================
module.exports = BulkProcessor;
