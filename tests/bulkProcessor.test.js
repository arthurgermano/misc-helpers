import { describe, it, expect, vi, beforeEach } from "vitest";
import { custom } from "../index.js";

const BulkProcessor = custom.bulkProcessor;

// Helper para aguardar a resolução de microtasks (promessas pendentes).
const flushPromises = () => new Promise(setImmediate);

describe("BulkProcessor (Class Export)", () => {
  let mockLogger;
  let mockCallbacks;

  // Reseta os mocks antes de cada teste para garantir isolamento.
  beforeEach(() => {
    mockLogger = {
      info: vi.fn(),
      error: vi.fn(),
    };
    mockCallbacks = {
      onAdd: vi.fn().mockResolvedValue(),
      onFlush: vi.fn().mockResolvedValue(),
      onEnd: vi.fn().mockResolvedValue(),
    };
  });

  // =================================================================================================
  // Testes de Inicialização e Configuração
  // =================================================================================================
  describe("Initialization and Configuration", () => {
    it("should initialize with default options when instantiated with no arguments", () => {
      const processor = new BulkProcessor();
      expect(processor).toBeInstanceOf(BulkProcessor);
    });

    it("should correctly instantiate with the modern options object", async () => {
      const payload = { project: "gemini" };
      const serviceContext = { tenantId: 123 };

      const processor = new BulkProcessor({
        limit: 5,
        logger: mockLogger,
        payload,
        serviceContext,
        onFlush: mockCallbacks.onFlush,
      });

      await processor.add({ id: 1 });
      await processor.end();

      expect(mockLogger.info).toHaveBeenCalledWith(
        expect.stringContaining("BulkProcessor inicializado."),
        { limit: 5 }
      );
      expect(mockCallbacks.onFlush).toHaveBeenCalledWith(
        expect.objectContaining({
          payload,
          serviceContext,
          logger: mockLogger,
          batch: [{ id: 1 }],
        })
      );
    });

    it("should correctly instantiate with the legacy (payload, callbacks, options) signature", async () => {
      const payload = { legacy: true };
      const callbackFunctions = { onFlushCallback: mockCallbacks.onFlush };
      const options = { limit: 2, logger: mockLogger };

      // Instancia usando a assinatura antiga
      const processor = new BulkProcessor(payload, callbackFunctions, options);

      await processor.add({ id: 1 });
      await processor.end();

      expect(mockLogger.info).toHaveBeenCalledWith(
        expect.stringContaining("BulkProcessor inicializado."),
        { limit: 2 }
      );
      expect(mockCallbacks.onFlush).toHaveBeenCalledWith(
        expect.objectContaining({ payload })
      );
    });
  });

  // =================================================================================================
  // Testes de Lógica Central: Buffer e Flush
  // =================================================================================================
  describe("Core Buffering and Flushing Logic", () => {
    it("should buffer items and not flush before reaching the limit", async () => {
      const processor = new BulkProcessor({
        limit: 10,
        onFlush: mockCallbacks.onFlush,
      });

      for (let i = 0; i < 9; i++) {
        await processor.add({ id: i });
      }

      expect(mockCallbacks.onFlush).not.toHaveBeenCalled();
    });

    it("should automatically trigger flush when the limit is reached", async () => {
      const processor = new BulkProcessor({
        limit: 3,
        onFlush: mockCallbacks.onFlush,
      });

      await processor.add({ id: 1 });
      await processor.add({ id: 2 });
      await processor.add({ id: 3 }); // O 3º item aciona o flush

      await flushPromises(); // Aguarda a resolução da promessa do flush

      expect(mockCallbacks.onFlush).toHaveBeenCalledTimes(1);
      expect(mockCallbacks.onFlush).toHaveBeenCalledWith(
        expect.objectContaining({
          batch: [{ id: 1 }, { id: 2 }, { id: 3 }],
        })
      );
    });

    it("should process all items in a continuous loop if more are added during a flush", async () => {
      let resolveFlush;
      const slowFlush = vi.fn().mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveFlush = resolve;
          })
      );

      const processor = new BulkProcessor({
        limit: 2,
        onFlush: slowFlush,
        logger: mockLogger,
      });

      // Aciona o primeiro flush
      await processor.add({ id: 1 });
      await processor.add({ id: 2 });

      await flushPromises(); // Garante que o flush começou
      expect(slowFlush).toHaveBeenCalledTimes(1);

      // Adiciona mais itens enquanto o primeiro flush está "preso"
      await processor.add({ id: 3 });
      await processor.add({ id: 4 });

      // Libera o primeiro flush
      resolveFlush();
      await flushPromises();

      // O processador deve ter iniciado o segundo flush em loop
      expect(slowFlush).toHaveBeenCalledTimes(2);
      expect(slowFlush).toHaveBeenCalledWith(
        expect.objectContaining({ batch: [{ id: 3 }, { id: 4 }] })
      );
    });
  });

  // =================================================================================================
  // Testes de Concorrência e Estado
  // =================================================================================================
  describe("Concurrency and State Management", () => {
    it("should prevent a new flush from starting if one is already in progress", async () => {
      let resolveFlush;
      const slowFlush = vi.fn().mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveFlush = resolve;
          })
      );

      const processor = new BulkProcessor({ limit: 2, onFlush: slowFlush });

      await processor.add({ id: 1 });
      await processor.add({ id: 2 });
      await flushPromises();

      // Tenta acionar um flush manual enquanto o outro está em progresso
      processor.flush();
      processor.flush();

      expect(slowFlush).toHaveBeenCalledTimes(1);

      resolveFlush();
      await flushPromises();
    });
  });

  // =================================================================================================
  // Testes de Callbacks e Erros
  // =================================================================================================
  describe("Callbacks and Error Handling", () => {
    it("should call onAdd, onFlush, and onEnd with correct parameters", async () => {
      const processor = new BulkProcessor({
        limit: 1,
        logger: mockLogger,
        onAdd: mockCallbacks.onAdd,
        onFlush: mockCallbacks.onFlush,
        onEnd: mockCallbacks.onEnd,
      });

      const item = { id: "test" };
      await processor.add(item);
      await processor.end();

      expect(mockCallbacks.onAdd).toHaveBeenCalledWith(
        expect.objectContaining({ item })
      );
      expect(mockCallbacks.onFlush).toHaveBeenCalledWith(
        expect.objectContaining({ batch: [item] })
      );
      expect(mockCallbacks.onEnd).toHaveBeenCalledTimes(1);
    });

    it("should log an error but continue if onFlush fails", async () => {
      const testError = new Error("Database connection failed");
      mockCallbacks.onFlush.mockRejectedValue(testError);

      const processor = new BulkProcessor({
        limit: 1,
        onFlush: mockCallbacks.onFlush,
        logger: mockLogger,
      });

      await processor.add({ id: 1 });
      await processor.end();

      expect(mockLogger.error).toHaveBeenCalledWith(
        "Falha crítica ao processar o lote.",
        expect.objectContaining({ errorMessage: testError.message })
      );
    });
  });

  // =================================================================================================
  // Testes de Finalização (Shutdown)
  // =================================================================================================
  describe("Shutdown Logic (`end()` method)", () => {
    it("should flush remaining items in the buffer when end() is called", async () => {
      const processor = new BulkProcessor({
        limit: 10,
        onFlush: mockCallbacks.onFlush,
        logger: mockLogger,
      });

      await processor.add({ id: 1 });
      await processor.add({ id: 2 });

      expect(mockCallbacks.onFlush).not.toHaveBeenCalled();
      await processor.end();

      expect(mockCallbacks.onFlush).toHaveBeenCalledTimes(1);
      expect(mockCallbacks.onFlush).toHaveBeenCalledWith(
        expect.objectContaining({ batch: [{ id: 1 }, { id: 2 }] })
      );
      expect(mockLogger.info).toHaveBeenCalledWith(
        "Processador finalizado. Nenhum item pendente."
      );
    });

    it("should complete immediately if the buffer is empty", async () => {
      const processor = new BulkProcessor({ onFlush: mockCallbacks.onFlush });
      await processor.end();
      expect(mockCallbacks.onFlush).not.toHaveBeenCalled();
    });
  });

  // =================================================================================================
  // Testes de Casos Extremos (Edge Cases) e Cenários Avançados
  // =================================================================================================
  describe("Edge Cases and Advanced Scenarios", () => {
    it("should handle non-object items gracefully", async () => {
      const processor = new BulkProcessor({
        limit: 4,
        onFlush: mockCallbacks.onFlush,
      });
      const items = [null, undefined, 123, "string"];

      for (const item of items) {
        await processor.add(item);
      }
      await processor.end();

      expect(mockCallbacks.onFlush).toHaveBeenCalledTimes(1);
      expect(mockCallbacks.onFlush).toHaveBeenCalledWith(
        expect.objectContaining({ batch: items })
      );
    });

    it("should add item to buffer even if onAdd callback fails", async () => {
      // 1. Prepara o erro que será simulado
      const testError = new Error("onAdd validation failed");

      // 2. Configura o mock do onAdd para rejeitar a promessa com o erro
      mockCallbacks.onAdd.mockRejectedValue(testError);

      // 3. Instancia o processador com os mocks necessários
      const processor = new BulkProcessor({
        limit: 2,
        onAdd: mockCallbacks.onAdd,
        onFlush: mockCallbacks.onFlush,
        logger: mockLogger,
      });

      // 4. Adiciona o item. A chamada não é bloqueada, mesmo com a falha do onAdd.
      processor.add({ id: "resilient" });

      // 5. Garante que qualquer promessa pendente seja processada
      await flushPromises();

      // 6. Verifica se o erro foi devidamente logado com a mensagem correta
      expect(mockLogger.error).toHaveBeenCalledWith(
        "Erro não tratado no callback onAdd.",
        expect.objectContaining({ errorMessage: testError.message })
      );

      // 7. Finaliza o processador para forçar o flush do item
      await processor.end();

      // 8. Verifica se, apesar da falha no onAdd, o item foi processado pelo onFlush
      expect(mockCallbacks.onFlush).toHaveBeenCalledWith(
        expect.objectContaining({ batch: [{ id: "resilient" }] })
      );
    });

    it("should still perform a final flush even if onEnd callback fails", async () => {
      const testError = new Error("onEnd cleanup failed");
      mockCallbacks.onEnd.mockRejectedValue(testError);

      const processor = new BulkProcessor({
        limit: 2,
        onEnd: mockCallbacks.onEnd,
        onFlush: mockCallbacks.onFlush,
        logger: mockLogger,
      });

      await processor.add({ id: "data-to-save" });
      await processor.end();

      // O erro do onEnd deve ser logado
      expect(mockLogger.error).toHaveBeenCalledWith(
        "Erro no callback onEnd.",
        expect.objectContaining({ errorMessage: testError.message })
      );

      // O flush final, que é crítico, deve ter ocorrido mesmo assim
      expect(mockCallbacks.onFlush).toHaveBeenCalledTimes(1);
      expect(mockCallbacks.onFlush).toHaveBeenCalledWith(
        expect.objectContaining({ batch: [{ id: "data-to-save" }] })
      );
    });

    it("should correctly process a partial buffer when flush() is called manually", async () => {
      const processor = new BulkProcessor({
        limit: 10,
        onFlush: mockCallbacks.onFlush,
      });
      await processor.add({ id: 1 });
      await processor.add({ id: 2 });
      await processor.add({ id: 3 });

      await processor.flush(); // Chamada manual

      expect(mockCallbacks.onFlush).toHaveBeenCalledTimes(1);
      expect(mockCallbacks.onFlush).toHaveBeenCalledWith(
        expect.objectContaining({ batch: [{ id: 1 }, { id: 2 }, { id: 3 }] })
      );
    });

    it("should be safe to call end() multiple times", async () => {
      const processor = new BulkProcessor({
        limit: 1,
        onEnd: mockCallbacks.onEnd,
        onFlush: mockCallbacks.onFlush,
      });
      await processor.add({ id: 1 });

      // Chama end() duas vezes em paralelo
      await Promise.all([processor.end(), processor.end()]);

      // Os callbacks devem ser chamados apenas uma vez
      expect(mockCallbacks.onEnd).toHaveBeenCalledTimes(1);
      expect(mockCallbacks.onFlush).toHaveBeenCalledTimes(1);
    });

    it("should process a large volume of items correctly across multiple batches", async () => {
      const processor = new BulkProcessor({
        limit: 100,
        onFlush: mockCallbacks.onFlush,
      });
      const totalItems = 255;

      for (let i = 0; i < totalItems; i++) {
        await processor.add({ id: i });
      }
      await processor.end();

      // Devem ocorrer 3 chamadas de flush: 100, 100, e os 55 restantes
      expect(mockCallbacks.onFlush).toHaveBeenCalledTimes(3);
      expect(mockCallbacks.onFlush.mock.calls[0][0].batch.length).toBe(100);
      expect(mockCallbacks.onFlush.mock.calls[1][0].batch.length).toBe(100);
      expect(mockCallbacks.onFlush.mock.calls[2][0].batch.length).toBe(55);
    });
  });

  // =================================================================================================
  // Testes de Cenários Complexos e Transições de Estado
  // =================================================================================================
  describe("Complex Scenarios and State Transitions", () => {
    it("should correctly wait and finalize if end() is called during an active manual flush", async () => {
      let resolveFlush;
      const slowFlush = vi.fn().mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveFlush = resolve;
          })
      );

      const processor = new BulkProcessor({
        limit: 20,
        onFlush: slowFlush,
        onEnd: mockCallbacks.onEnd,
      });

      // Adiciona alguns itens e inicia um flush manual lento
      await processor.add({ id: 1 });
      await processor.add({ id: 2 });
      const flushPromise = processor.flush();

      await flushPromises(); // Garante que o flush tenha iniciado e a trava #isFlushing esteja ativa

      // Enquanto o flush está "preso", chamamos end()
      const endPromise = processor.end();

      // Verificamos que onEnd foi chamado, pois não depende da trava de flush
      expect(mockCallbacks.onEnd).toHaveBeenCalledTimes(1);

      // Agora liberamos o flush original
      resolveFlush();
      await Promise.all([flushPromise, endPromise]);

      // O onFlush só deve ter sido chamado uma vez para o lote inicial
      expect(slowFlush).toHaveBeenCalledTimes(1);
      expect(slowFlush).toHaveBeenCalledWith(
        expect.objectContaining({ batch: [{ id: 1 }, { id: 2 }] })
      );
    });

    it("should discard a failed batch and continue processing subsequent items", async () => {
      const error = new Error("Batch failed");
      const onFlushMock = vi
        .fn()
        .mockImplementationOnce(() => Promise.reject(error)) // Primeira chamada falha
        .mockImplementationOnce(() => Promise.resolve()); // Segunda chamada tem sucesso

      const processor = new BulkProcessor({
        limit: 2,
        onFlush: onFlushMock,
        logger: mockLogger,
      });

      // Adiciona itens para o primeiro lote, que irá falhar
      await processor.add({ id: 1 });
      await processor.add({ id: 2 });

      await flushPromises(); // Espera o flush falhar

      // A falha deve ser logada
      expect(mockLogger.error).toHaveBeenCalledWith(
        "Falha crítica ao processar o lote.",
        expect.any(Object)
      );

      // Adiciona itens para o segundo lote, que deve ter sucesso
      await processor.add({ id: 3 });
      await processor.add({ id: 4 });

      await processor.end();

      // Garante que onFlush foi chamado duas vezes
      expect(onFlushMock).toHaveBeenCalledTimes(2);
      // A primeira chamada foi com o primeiro lote
      expect(onFlushMock.mock.calls[0][0].batch).toEqual([
        { id: 1 },
        { id: 2 },
      ]);
      // A segunda chamada foi com o segundo lote, não com o primeiro novamente
      expect(onFlushMock.mock.calls[1][0].batch).toEqual([
        { id: 3 },
        { id: 4 },
      ]);
    });

    it("should process every item individually when limit is 1", async () => {
      const processor = new BulkProcessor({
        limit: 1,
        onFlush: mockCallbacks.onFlush,
      });

      await processor.add({ id: "a" });
      await flushPromises();
      await processor.add({ id: "b" });
      await flushPromises();
      await processor.add({ id: "c" });
      await flushPromises();

      expect(mockCallbacks.onFlush).toHaveBeenCalledTimes(3);
      expect(mockCallbacks.onFlush.mock.calls[0][0].batch.length).toBe(1);
      expect(mockCallbacks.onFlush.mock.calls[1][0].batch.length).toBe(1);
      expect(mockCallbacks.onFlush.mock.calls[2][0].batch.length).toBe(1);
    });

    it("should behave like limit:1 when limit is 0, processing each item", async () => {
      const processor = new BulkProcessor({
        limit: 0,
        onFlush: mockCallbacks.onFlush,
      });

      await processor.add({ id: "a" });
      await flushPromises();
      await processor.add({ id: "b" });
      await flushPromises();

      // Com limite 0, cada `add` deve disparar um flush para o item recém-adicionado
      expect(mockCallbacks.onFlush).toHaveBeenCalledTimes(2);
      expect(mockCallbacks.onFlush.mock.calls[1][0].batch).toEqual([
        { id: "b" },
      ]);
    });

    it("should not be reusable after end() has fully completed", async () => {
      const processor = new BulkProcessor({
        limit: 2,
        onFlush: mockCallbacks.onFlush,
        onEnd: mockCallbacks.onEnd,
      });

      await processor.add({ id: 1 });
      await processor.end(); // Finaliza o processador

      // Os callbacks foram chamados uma vez
      expect(mockCallbacks.onFlush).toHaveBeenCalledTimes(1);
      expect(mockCallbacks.onEnd).toHaveBeenCalledTimes(1);

      // Tenta adicionar mais itens após a finalização
      await processor.add({ id: 2 });
      await processor.add({ id: 3 });

      // Tenta finalizar novamente
      await processor.end();

      // Os contadores de chamada não devem ter sido incrementados
      expect(mockCallbacks.onFlush).toHaveBeenCalledTimes(1);
      expect(mockCallbacks.onEnd).toHaveBeenCalledTimes(1);
    });
  });

  // =================================================================================================
  // Testes de Comportamento Assíncrono Avançado e Manipulação de Dados
  // =================================================================================================
  describe("Advanced Asynchronous Behavior and Data Handling", () => {
    it("should trigger flush immediately even if a previous onAdd callback has not resolved", async () => {
      let resolveOnAdd;
      const slowOnAdd = vi.fn().mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveOnAdd = resolve;
          })
      );

      const processor = new BulkProcessor({
        limit: 2,
        onFlush: mockCallbacks.onFlush,
        onAdd: slowOnAdd,
      });

      // A primeira chamada ao add fica "presa" no onAdd
      const addPromise1 = processor.add({ id: 1 });

      // A segunda chamada é feita em seguida. O buffer atinge o limite e dispara o flush.
      await processor.add({ id: 2 });

      await flushPromises();

      // O onFlush deve ter sido chamado, mesmo que o onAdd do primeiro item ainda não tenha terminado.
      expect(mockCallbacks.onFlush).toHaveBeenCalledTimes(1);
      expect(mockCallbacks.onFlush).toHaveBeenCalledWith(
        expect.objectContaining({ batch: [{ id: 1 }, { id: 2 }] })
      );

      // Agora liberamos o onAdd e a promessa original do add.
      resolveOnAdd();
      await addPromise1;
    });

    it("should remain stable if the batch array is mutated within the onFlush callback", async () => {
      const receivedBatches = []; // Array para armazenar as "fotografias"

      const mutatingOnFlush = vi.fn().mockImplementation(({ batch }) => {
        // 1. Salva uma cópia profunda do lote no momento em que é recebido
        receivedBatches.push(JSON.parse(JSON.stringify(batch)));

        // 2. Muta o lote original
        batch.length = 0;
        batch.push({ id: "mutated" });
      });

      const processor = new BulkProcessor({
        limit: 2,
        onFlush: mutatingOnFlush,
      });

      await processor.add({ id: 1 });
      await processor.add({ id: 2 });
      await flushPromises();

      await processor.add({ id: 3 });
      await processor.add({ id: 4 });
      await processor.end();

      expect(mutatingOnFlush).toHaveBeenCalledTimes(2);

      // 3. A asserção é feita contra a cópia salva, que reflete o estado original
      expect(receivedBatches[1]).toEqual([{ id: 3 }, { id: 4 }]);
    });

    it("should operate without errors and discard items if no onFlush callback is provided", async () => {
      // Instancia SEM o callback onFlush
      const processor = new BulkProcessor({ limit: 2, logger: mockLogger });

      await processor.add({ id: 1 });
      await processor.add({ id: 2 });
      await processor.end();

      // Deve logar que os itens foram descartados, mas não deve lançar um erro
      expect(mockLogger.info).toHaveBeenCalledWith(
        expect.stringContaining(
          "Nenhum callback onFlush definido. Lote de 2 itens descartado."
        )
      );
      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it("should reflect modifications to context objects across subsequent callback calls", async () => {
      const payload = { counter: 0 };

      // Este onAdd modifica o objeto de payload
      const onAddModifying = vi.fn().mockImplementation(({ payload }) => {
        payload.counter += 1;
      });

      const processor = new BulkProcessor({
        limit: 2,
        payload: payload,
        onAdd: onAddModifying,
        onFlush: mockCallbacks.onFlush,
      });

      await processor.add({ id: 1 });
      await processor.add({ id: 2 });
      await processor.end();

      expect(onAddModifying).toHaveBeenCalledTimes(2);

      // O onFlush deve receber o objeto payload com o estado modificado pelas chamadas do onAdd.
      expect(mockCallbacks.onFlush).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: { counter: 2 },
        })
      );
    });
  });
});
