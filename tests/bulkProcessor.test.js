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
      warn: vi.fn(),
      debug: vi.fn(),
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
        expect.objectContaining({ limit: 5 })
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
        expect.objectContaining({ limit: 2 })
      );
      expect(mockCallbacks.onFlush).toHaveBeenCalledWith(
        expect.objectContaining({ payload })
      );
    });
  });

  // =================================================================================================
  // Testes de Configuração e Casos Extremos de Parâmetros
  // =================================================================================================
  describe("Parameter Validation and Edge Cases", () => {
    it.each([
      { description: "zero", input: 0, expected: 1 },
      { description: "negative", input: -10, expected: 1 },
      { description: "NaN", input: NaN, expected: 1 },
      { description: "a string", input: "abc", expected: 1 },
      { description: "null", input: null, expected: 1 },
      { description: "a float", input: 0.5, expected: 1 },
    ])(
      'should treat invalid limit value "$description" ($input) and default to $expected',
      ({ input, expected }) => {
        // Arrange & Act
        const processor = new BulkProcessor({
          limit: input,
          logger: mockLogger,
        });

        // Assert
        expect(mockLogger.info).toHaveBeenCalledWith(
          expect.stringContaining("BulkProcessor inicializado."),
          expect.objectContaining({ limit: expected })
        );
      }
    );

    it.each([
      {
        option: "maxConcurrentFlushes",
        input: 0,
        expected: 1,
        desc: "must be at least 1",
      },
      {
        option: "maxConcurrentFlushes",
        input: -5,
        expected: 1,
        desc: "must be at least 1",
      },
      {
        option: "retries",
        input: -5,
        expected: 0,
        desc: "must be at least 0",
      },
    ])(
      'should sanitize invalid value for "$option" from $input to $expected because it $desc',
      ({ option, input, expected }) => {
        // Arrange & Act
        const processor = new BulkProcessor({
          [option]: input,
          logger: mockLogger,
        });
        const expectedObject = { [option]: expected };

        // Assert
        expect(mockLogger.info).toHaveBeenCalledWith(
          expect.stringContaining("BulkProcessor inicializado."),
          expect.objectContaining(expectedObject)
        );
      }
    );

    it("should handle an extremely large limit correctly", async () => {
      // Arrange
      const processor = new BulkProcessor({
        limit: Number.MAX_SAFE_INTEGER,
        onFlush: mockCallbacks.onFlush,
      });

      // Act
      await processor.add({ id: 1 });
      await processor.add({ id: 2 });

      // Assert: Flush should not be called automatically due to the high limit
      expect(mockCallbacks.onFlush).not.toHaveBeenCalled();

      // Act
      await processor.end();

      // Assert: Flush should only be called on end()
      expect(mockCallbacks.onFlush).toHaveBeenCalledTimes(1);
      expect(mockCallbacks.onFlush).toHaveBeenCalledWith(
        expect.objectContaining({ batch: [{ id: 1 }, { id: 2 }] })
      );
    });

    it("should accept and use a custom logger with all methods", async () => {
      // Arrange
      const customLogger = {
        info: vi.fn(),
        error: vi.fn(),
        warn: vi.fn(),
        debug: vi.fn(),
      };
      const testError = new Error("Test failure");

      const processor = new BulkProcessor({
        limit: 1,
        logger: customLogger,
        onFlush: vi.fn().mockRejectedValue(testError),
        retries: 0, // Ensure it fails on the first attempt for the test
      });

      // Act
      await processor.add({ id: 1 });
      await processor.end();

      // Assert
      // Check if the constructor used the custom logger's info method
      expect(customLogger.info).toHaveBeenCalledWith(
        expect.stringContaining("BulkProcessor inicializado"),
        expect.any(Object)
      );

      // Check if the flush failure used the custom logger's error method
      expect(customLogger.error).toHaveBeenCalledWith(
        expect.stringContaining("Falha definitiva ao processar o lote"),
        expect.objectContaining({ errorMessage: testError.message })
      );

      // The class doesn't use warn/debug in this flow, but we can ensure it doesn't break
      expect(customLogger.warn).not.toHaveBeenCalled();
      expect(customLogger.debug).not.toHaveBeenCalled();
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

    it("should flush a single item immediately when limit is 1", async () => {
      // Arrange
      const processor = new BulkProcessor({
        limit: 1,
        onFlush: mockCallbacks.onFlush,
      });

      // Act
      await processor.add({ id: "single" });
      await flushPromises(); // Permite que o flush assíncrono seja executado

      // Assert
      expect(mockCallbacks.onFlush).toHaveBeenCalledTimes(1);
      expect(mockCallbacks.onFlush).toHaveBeenCalledWith(
        expect.objectContaining({ batch: [{ id: "single" }] })
      );
    });

    it("should not trigger a flush if the buffer is empty", async () => {
      // Arrange
      const processor = new BulkProcessor({
        limit: 5,
        onFlush: mockCallbacks.onFlush,
      });

      // Act: Chama o flush manualmente em um buffer vazio
      await processor.flush();

      // Assert
      expect(mockCallbacks.onFlush).not.toHaveBeenCalled();
    });

    it("should discard items with an info log if no onFlush callback is provided", async () => {
      // Arrange: Note a ausência do onFlush
      const processor = new BulkProcessor({
        limit: 2,
        logger: mockLogger,
      });

      // Act
      await processor.add({ id: 1 });
      await processor.add({ id: 2 }); // Isso irá disparar o flush
      await flushPromises(); // Aguarda o flush ser processado

      // Assert
      expect(mockLogger.info).toHaveBeenCalledWith(
        expect.stringContaining(
          "Nenhum callback onFlush definido. Lote de 2 itens descartado."
        )
      );
      // Garante que isso não foi tratado como um erro
      expect(mockLogger.error).not.toHaveBeenCalled();

      await processor.end();
    });
  });

  // =================================================================================================
  // Testes de Concorrência e Estado
  // =================================================================================================
  describe("Concurrency and State Management", () => {
    it("should not exceed the maxConcurrentFlushes limit", async () => {
      // Arrange: Prepara um mock de flush lento que nos permite controlar sua finalização.
      const flushResolvers = [];
      const slowFlush = vi.fn().mockImplementation(
        () =>
          new Promise((resolve) => {
            // Armazena a função `resolve` de cada chamada para liberá-la manualmente.
            flushResolvers.push(resolve);
          })
      );

      const processor = new BulkProcessor({
        limit: 2,
        maxConcurrentFlushes: 2, // Limite estrito de 2 flushes concorrentes.
        onFlush: slowFlush,
      });

      // Act (Phase 1): Adiciona itens suficientes para preencher todos os slots de concorrência.
      await processor.add({ id: 1 });
      await processor.add({ id: 2 }); // -> Dispara o flush 1
      await processor.add({ id: 3 });
      await processor.add({ id: 4 }); // -> Dispara o flush 2

      await flushPromises(); // Garante que os flushes tenham sido iniciados.

      // Assert (Phase 1): Verifica se exatamente 2 flushes foram iniciados.
      expect(slowFlush).toHaveBeenCalledTimes(2);
      expect(slowFlush.mock.calls[0][0].batch).toEqual([{ id: 1 }, { id: 2 }]);
      expect(slowFlush.mock.calls[1][0].batch).toEqual([{ id: 3 }, { id: 4 }]);

      // Act (Phase 2): Adiciona mais itens enquanto os slots estão cheios.
      await processor.add({ id: 5 });
      await processor.add({ id: 6 });

      await flushPromises();

      // Assert (Phase 2): Nenhum novo flush deve ter sido iniciado, pois o limite foi atingido.
      expect(slowFlush).toHaveBeenCalledTimes(2);

      // Act (Phase 3): Libera um dos slots, finalizando o primeiro flush.
      flushResolvers[0]();
      await flushPromises();

      // Assert (Phase 3): O processador deve ter iniciado o próximo flush para preencher o slot vago.
      expect(slowFlush).toHaveBeenCalledTimes(3);
      expect(slowFlush.mock.calls[2][0].batch).toEqual([{ id: 5 }, { id: 6 }]);

      // Cleanup: Libera os flushes restantes e finaliza o processador.
      flushResolvers.forEach((resolve) => resolve());
      await processor.end();
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
        expect.stringContaining("Falha definitiva ao processar o lote"),
        expect.objectContaining({ errorMessage: testError.message })
      );
    });

    it("should fill all available concurrency slots when there are enough items in the buffer", async () => {
      // Arrange
      const flushResolvers = [];
      const slowFlush = vi
        .fn()
        .mockImplementation(
          () => new Promise((resolve) => flushResolvers.push(resolve))
        );

      const processor = new BulkProcessor({
        limit: 2,
        maxConcurrentFlushes: 3, // Configurado para 3 slots
        onFlush: slowFlush,
      });

      // Act: Adiciona itens suficientes para 3 lotes
      await processor.add({ id: 1 });
      await processor.add({ id: 2 }); // -> Lote 1
      await processor.add({ id: 3 });
      await processor.add({ id: 4 }); // -> Lote 2
      await processor.add({ id: 5 });
      await processor.add({ id: 6 }); // -> Lote 3

      await flushPromises(); // Garante que todos os flushes disparados tenham iniciado

      // Assert: O processador deve ter iniciado um flush para cada slot de concorrência disponível.
      expect(slowFlush).toHaveBeenCalledTimes(3);

      // Cleanup
      flushResolvers.forEach((resolve) => resolve());
      await processor.end();
    });

    it("should start a new flush immediately as soon as a concurrent flush ends and frees up a slot", async () => {
      // Arrange
      const flushResolvers = [];
      const slowFlush = vi
        .fn()
        .mockImplementation(
          () => new Promise((resolve) => flushResolvers.push(resolve))
        );

      const processor = new BulkProcessor({
        limit: 2,
        maxConcurrentFlushes: 2, // Limite de 2 slots para o teste
        onFlush: slowFlush,
      });

      // Act (Phase 1): Preenche todos os slots.
      await processor.add({ id: 1 });
      await processor.add({ id: 2 }); // -> Inicia Flush 1
      await processor.add({ id: 3 });
      await processor.add({ id: 4 }); // -> Inicia Flush 2
      await flushPromises();

      // Adiciona mais itens que devem ficar em espera no buffer.
      await processor.add({ id: 5 });
      await processor.add({ id: 6 }); // -> Lote 3 (em espera)

      // Assert (Phase 1): Confirma que apenas 2 flushes estão ativos.
      expect(slowFlush).toHaveBeenCalledTimes(2);

      // Act (Phase 2): Finaliza o primeiro flush, liberando um slot.
      flushResolvers[0]();
      await flushPromises();

      // Assert (Phase 2): O processador deve ter sido reativo e iniciado o flush
      // para o lote que estava em espera, preenchendo o slot vago.
      expect(slowFlush).toHaveBeenCalledTimes(3);
      expect(slowFlush.mock.calls[2][0].batch).toEqual([{ id: 5 }, { id: 6 }]);

      // Cleanup
      flushResolvers.forEach((resolve) => resolve());
      await processor.end();
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
      expect(mockLogger.info).toHaveBeenCalledWith("Processador finalizado.");
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
      // ================== INÍCIO DA CORREÇÃO ==================
      // Criamos um mock de onFlush que simula uma operação assíncrona real,
      // mas ainda muito rápida, usando setImmediate.
      const asyncOnFlush = vi
        .fn()
        .mockImplementation(
          () => new Promise((resolve) => setImmediate(resolve))
        );

      const processor = new BulkProcessor({
        limit: 100,
        // Usamos o novo mock assíncrono
        onFlush: asyncOnFlush,
      });
      // =================== FIM DA CORREÇÃO ====================

      const totalItems = 255;

      for (let i = 0; i < totalItems; i++) {
        await processor.add({ id: i });
      }
      await processor.end();

      // Agora as asserções devem passar, pois os lotes serão formados corretamente.
      expect(asyncOnFlush).toHaveBeenCalledTimes(3);
      expect(asyncOnFlush.mock.calls[0][0].batch.length).toBe(100);
      expect(asyncOnFlush.mock.calls[1][0].batch.length).toBe(100);
      expect(asyncOnFlush.mock.calls[2][0].batch.length).toBe(55);
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

      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining("Falha definitiva ao processar o lote"),
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

  // =================================================================================================
  // Testes de Performance e Carga (Stress Tests)
  // =================================================================================================
  describe("Performance and Stress Tests", () => {
    it("should process a massive volume of items in a reasonable time (throughput test)", async () => {
      // Arrange
      let totalItemsProcessed = 0;
      const onFlush = vi.fn().mockImplementation(async ({ batch }) => {
        totalItemsProcessed += batch.length;
        // Simula uma operação de I/O muito rápida e não bloqueante
        await new Promise((resolve) => setImmediate(resolve));
      });

      const processor = new BulkProcessor({
        limit: 1000,
        maxConcurrentFlushes: 10, // Configuração agressiva para alta performance
        onFlush,
      });

      const itemCount = 100000;
      const startTime = performance.now();

      // Act
      for (let i = 0; i < itemCount; i++) {
        await processor.add({ id: i });
      }
      await processor.end();
      const duration = performance.now() - startTime;

      // Assert
      expect(totalItemsProcessed).toBe(itemCount);
      // Espera que o teste seja concluído em menos de 5 segundos, indicando bom throughput.
      // Este valor pode ser ajustado dependendo da máquina que executa os testes.
      expect(duration).toBeLessThan(5000);
    });

    it("should trigger onBackpressure and pause add calls when maxBufferSize is hit", async () => {
      // Arrange
      const onBackpressure = vi.fn();
      const onFlush = vi
        .fn()
        .mockImplementation(() => new Promise((r) => setTimeout(r, 50))); // Flush lento

      const processor = new BulkProcessor({
        limit: 10,
        maxBufferSize: 25, // Buffer muito pequeno para forçar o backpressure
        onFlush,
        onBackpressure,
      });

      const addPromises = [];
      const startTime = performance.now();

      // Act: Dispara adições mais rápido do que o flush consegue processar
      for (let i = 0; i < 100; i++) {
        addPromises.push(processor.add({ id: i }));
      }

      const duration = performance.now() - startTime;

      await processor.end();

      expect(onBackpressure).toHaveBeenCalled();
    }, 15000);

    // Nota: Este teste requer que o Node seja executado com a flag --expose-gc
    it.skipIf(!global.gc)(
      "should maintain stable memory usage under sustained load (memory leak test)",
      async () => {
        // Arrange
        const processor = new BulkProcessor({
          limit: 500,
          maxBufferSize: 1000,
          onFlush: () => new Promise((resolve) => setImmediate(resolve)),
        });

        global.gc(); // Limpa a memória antes de começar
        const startMemory = process.memoryUsage().heapUsed;

        // Act: Processa um grande número de itens
        for (let i = 0; i < 50000; i++) {
          await processor.add({ data: `item-${i}`, payload: new Array(10) });
          if (i % 5000 === 0) {
            global.gc(); // Força o garbage collector periodicamente
          }
        }
        await processor.end();
        global.gc(); // Limpeza final

        const endMemory = process.memoryUsage().heapUsed;
        const memoryGrowth = endMemory - startMemory;

        // Assert: O crescimento da memória deve ser mínimo e não proporcional ao
        // número de itens processados. (ex: < 15 MB)
        expect(memoryGrowth).toBeLessThan(15 * 1024 * 1024);
      }
    );

    it("should handle bursts of additions without losing items", async () => {
      // Arrange
      let totalItemsProcessed = 0;
      const onFlush = vi.fn().mockImplementation(async ({ batch }) => {
        totalItemsProcessed += batch.length;
        await new Promise((r) => setTimeout(r, 10)); // Pequeno delay
      });

      const processor = new BulkProcessor({
        limit: 50,
        maxBufferSize: 100, // Buffer pequeno para garantir que o backpressure seja usado
        onFlush,
      });

      // Act: Dispara uma "rajada" de 500 adições de uma vez, sem esperar.
      const addPromises = [];
      for (let i = 0; i < 500; i++) {
        addPromises.push(processor.add({ id: i }));
      }

      await processor.end();

      expect(totalItemsProcessed).toBe(500);
    }, 15000);

    it("should have low latency on add() calls until backpressure is needed", async () => {
      // Arrange
      const processor = new BulkProcessor({
        limit: 100,
        maxBufferSize: 200, // Buffer grande para evitar backpressure no início
        onFlush: mockCallbacks.onFlush,
      });

      // Act: Mede o tempo de uma chamada `add` quando o buffer está vazio.
      const startTime = performance.now();
      await processor.add({ id: 1 });
      const duration = performance.now() - startTime;

      // Assert: A latência deve ser muito baixa (ex: < 3ms), pois não há espera.
      expect(duration).toBeLessThan(3);
    });
  });

  // =================================================================================================
  // Testes de Resiliência e Lógica de Retry
  // =================================================================================================
  describe("Resilience and Retry Logic", () => {
    it("should retry processing a batch the exact number of times configured in retries", async () => {
      // Arrange
      const testError = new Error("Temporary network failure");
      const failingFlush = vi.fn().mockRejectedValue(testError);

      const processor = new BulkProcessor({
        limit: 1,
        retries: 3, // 1 tentativa inicial + 3 retries
        retryDelayMs: 10, // Delay baixo para o teste rodar rápido
        onFlush: failingFlush,
      });

      // Act
      await processor.add({ id: 1 });
      await processor.end();

      // Assert: O flush deve ter sido chamado 4 vezes no total (1 inicial + 3 retries).
      expect(failingFlush).toHaveBeenCalledTimes(4);
    });

    it("should wait for the configured retryDelayMs between failed attempts", async () => {
      // Arrange
      vi.useFakeTimers(); // Habilita o controle do tempo
      const testError = new Error("DB lock");
      const failingFlush = vi.fn().mockRejectedValue(testError);
      const processor = new BulkProcessor({
        limit: 1,
        retries: 2,
        retryDelayMs: 500, // 500ms de espera
        onFlush: failingFlush,
      });

      const startTime = Date.now();

      // Act
      await processor.add({ id: 1 });
      const endPromise = processor.end();

      // Avança o tempo simulado para cobrir as duas esperas de 500ms
      await vi.advanceTimersByTimeAsync(1000);
      await endPromise;
      const duration = Date.now() - startTime;

      // Assert
      expect(failingFlush).toHaveBeenCalledTimes(3);
      // A duração deve ser pelo menos o tempo total de espera (2 * 500ms)
      expect(duration).toBeGreaterThanOrEqual(1000);

      vi.useRealTimers(); // Restaura o controle normal do tempo
    });

    it("should call onFlushFailure with the correct batch and error ONLY after all retries are exhausted", async () => {
      // Arrange
      const testError = new Error("Permanent failure");
      const failingFlush = vi.fn().mockRejectedValue(testError);
      const onFlushFailure = vi.fn();

      const processor = new BulkProcessor({
        limit: 1,
        retries: 2,
        retryDelayMs: 10,
        onFlush: failingFlush,
        onFlushFailure,
      });

      const failedBatch = [{ id: "failed-item" }];

      // Act
      await processor.add(failedBatch[0]);
      await processor.end();

      // Assert
      expect(failingFlush).toHaveBeenCalledTimes(3); // 1 inicial + 2 retries
      expect(onFlushFailure).toHaveBeenCalledTimes(1); // Chamado apenas uma vez
      expect(onFlushFailure).toHaveBeenCalledWith(
        expect.objectContaining({
          batch: failedBatch,
          error: testError,
        })
      );
    });

    it("should NOT call onFlushFailure if the flush succeeds in one of the retry attempts", async () => {
      // Arrange
      const onFlushMock = vi
        .fn()
        .mockRejectedValueOnce(new Error("Attempt 1 fails")) // Falha na 1ª tentativa
        .mockRejectedValueOnce(new Error("Attempt 2 fails")) // Falha na 2ª tentativa
        .mockResolvedValueOnce(undefined); // Sucesso na 3ª tentativa

      const onFlushFailure = vi.fn();

      const processor = new BulkProcessor({
        limit: 1,
        retries: 3, // Permite até 4 tentativas no total
        retryDelayMs: 10,
        onFlush: onFlushMock,
        onFlushFailure,
      });

      // Act
      await processor.add({ id: "eventually-succeeds" });
      await processor.end();

      // Assert
      expect(onFlushMock).toHaveBeenCalledTimes(3); // Chamado 3 vezes até o sucesso
      expect(onFlushFailure).not.toHaveBeenCalled(); // Não deve ser chamado
    });

    it("should handle an error within the onFlushFailure callback gracefully", async () => {
      // Arrange
      const onFlushFailureError = new Error(
        "Error inside the failure handler!"
      );
      const failingFlush = vi.fn().mockRejectedValue(new Error("Initial fail"));
      const failingOnFlushFailure = vi
        .fn()
        .mockRejectedValue(onFlushFailureError);

      const processor = new BulkProcessor({
        limit: 1,
        retries: 1,
        retryDelayMs: 10,
        onFlush: failingFlush,
        onFlushFailure: failingOnFlushFailure,
        logger: mockLogger, // Logger para verificar o erro
      });

      // Act & Assert: O processador não deve quebrar (lançar uma exceção não tratada).
      // A promessa de end() deve resolver normalmente.
      await expect(
        processor.add({ id: 1 }).then(() => processor.end())
      ).resolves.not.toThrow();

      // Assert: O erro CRÍTICO do callback de falha deve ter sido logado.
      expect(mockLogger.error).toHaveBeenCalledWith(
        "Erro CRÍTICO no próprio callback onFlushFailure.",
        expect.objectContaining({
          errorMessage: onFlushFailureError.message,
        })
      );
    });

    it("should timeout a flush that takes too long and treat it as a failure", async () => {
      // Arrange
      // Cria um mock de flush "travado" que nunca resolve.
      const stuckFlush = vi
        .fn()
        .mockImplementation(() => new Promise((resolve) => {}));
      const onFlushFailure = vi.fn();

      const processor = new BulkProcessor({
        limit: 1,
        retries: 0, // Sem retries para simplificar a verificação da falha
        onFlush: stuckFlush,
        onFlushFailure,
        flushTimeoutMs: 100, // Timeout bem curto para o teste rodar rápido
      });

      // Act
      await processor.add({ id: "item-that-will-timeout" });
      await processor.end();

      // Assert
      // 1. A função de flush foi chamada.
      expect(stuckFlush).toHaveBeenCalledTimes(1);

      // 2. O callback de falha definitiva foi acionado por causa do timeout.
      expect(onFlushFailure).toHaveBeenCalledTimes(1);

      // 3. O erro passado para o callback de falha deve ser o erro de timeout.
      const failureArgs = onFlushFailure.mock.calls[0][0];
      expect(failureArgs.error).toBeInstanceOf(Error);
      expect(failureArgs.error.message).toContain("Flush timed out");
    });
  });

  // =================================================================================================
  // Testes de Ciclo de Vida e Finalização (end())
  // =================================================================================================
  describe("Shutdown Logic (`end()` method)", () => {
    it("should force shutdown after a timeout and log remaining items", async () => {
      // Arrange
      // Cria um flush que nunca resolve, simulando uma operação "travada".
      const stuckFlush = vi
        .fn()
        .mockImplementation(() => new Promise((resolve) => {}));

      const processor = new BulkProcessor({
        limit: 2,
        maxConcurrentFlushes: 1, // Limita a 1 para simplificar o cenário
        onFlush: stuckFlush,
        logger: mockLogger,
      });

      // Act
      // Inicia o flush travado
      await processor.add({ id: 1 });
      await processor.add({ id: 2 });
      await flushPromises();

      // Adiciona mais itens que ficarão presos no buffer, pois o único slot de flush está ocupado.
      await processor.add({ id: 3 });
      await processor.add({ id: 4 });

      // Chama end() com um timeout curto. O teste não deve travar aqui.
      await processor.end(500); // Força o timeout em 500ms

      // Assert
      // 1. O flush travado foi chamado.
      expect(stuckFlush).toHaveBeenCalledTimes(1);

      // 2. O log de AVISO sobre o timeout deve ter sido chamado.
      expect(mockLogger.warn).toHaveBeenCalledTimes(1);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining("Finalização forçada por timeout"),
        // 3. O contexto do log deve informar que ainda haviam 2 itens no buffer.
        expect.objectContaining({
          remainingItems: 2,
          activeFlushes: 1,
        })
      );
    });
  });

  // =================================================================================================
  // Testes de Segurança e Integridade dos Dados
  // =================================================================================================
  describe("Data Integrity and Security", () => {
    it("should process complex and nested objects, maintaining their structure intact", async () => {
      // Arrange
      const complexObject = {
        id: 123n, // BigInt
        name: "Test Object",
        metadata: {
          createdAt: new Date(),
          tags: ["a", "b", { nested: true }],
          config: { retries: 3 },
        },
        isActive: true,
        pattern: /test/g, // RegExp
        run: () => "function",
      };

      const processor = new BulkProcessor({
        limit: 1,
        onFlush: mockCallbacks.onFlush,
      });

      // Act
      await processor.add(complexObject);
      await processor.end();

      // Assert
      expect(mockCallbacks.onFlush).toHaveBeenCalledTimes(1);
      const receivedObject = mockCallbacks.onFlush.mock.calls[0][0].batch[0];

      // Usa `toEqual` para uma comparação profunda de valores.
      expect(receivedObject).toEqual(complexObject);
      // Verifica a igualdade de referência para objetos internos para garantir que não foram clonados desnecessariamente.
      expect(receivedObject.metadata).toBe(complexObject.metadata);
    });

    it("should handle objects with circular references without crashing", async () => {
      // Arrange
      const circularObject = { id: "circular" };
      circularObject.self = circularObject; // Cria a referência circular

      const processor = new BulkProcessor({
        limit: 1,
        retries: 1, // Força um log de 'warn' para testar a serialização do log
        retryDelayMs: 10,
        onFlush: vi.fn().mockRejectedValueOnce(new Error("Fail for retry")), // Falha uma vez
        logger: mockLogger,
      });

      // Act & Assert: A operação deve completar sem lançar uma exceção de stack overflow.
      await expect(
        processor.add(circularObject).then(() => processor.end())
      ).resolves.not.toThrow();

      // Assert: O log de aviso, que tenta inspecionar o objeto, foi chamado, e a aplicação não quebrou.
      expect(mockLogger.warn).toHaveBeenCalled();
    });

    it("should ensure that mutating the batch array in onFlush does not affect other concurrent flushes", async () => {
      // Arrange
      const receivedBatches = [];
      const flushResolvers = [vi.fn(), vi.fn()]; // Funções para controlar a finalização

      const mutatingFlush = vi.fn().mockImplementation(async ({ batch }) => {
        const batchId = batch[0].id;
        // Salva uma cópia do lote original no momento do recebimento.
        receivedBatches.push(JSON.parse(JSON.stringify(batch)));

        // Simula um trabalho e espera por um sinal para continuar.
        await new Promise((resolve) => {
          // Armazena a função resolve para o lote específico (1 ou 2)
          flushResolvers[batchId - 1] = resolve;
        });

        // Muta o array do lote após a espera.
        batch.length = 0;
        batch.push({ id: `mutated-${batchId}` });
      });

      const processor = new BulkProcessor({
        limit: 1,
        maxConcurrentFlushes: 2,
        onFlush: mutatingFlush,
      });

      // Act
      // Dispara dois flushes que irão rodar em paralelo.
      await processor.add({ id: 1 });
      await processor.add({ id: 2 });

      // Aguarda um pouco para garantir que ambos os flushes tenham iniciado.
      await new Promise((r) => setTimeout(r, 50));

      // Libera os dois flushes para que eles completem a mutação e terminem.
      flushResolvers[0]();
      flushResolvers[1]();
      await processor.end();

      // Assert
      // A asserção mais importante: os lotes recebidos originalmente devem estar intactos,
      // provando que a mutação em um não afetou o outro.
      expect(mutatingFlush).toHaveBeenCalledTimes(2);
      expect(receivedBatches).toHaveLength(2);
      expect(receivedBatches).toContainEqual([{ id: 1 }]);
      expect(receivedBatches).toContainEqual([{ id: 2 }]);
    });
  });

  // =================================================================================================
  // Testes de Interação de Features
  // =================================================================================================
  describe("Feature Interaction Tests", () => {
    it("should retry a flush that fails due to a timeout", async () => {
      // Arrange
      // Cria um mock de flush "travado" que nunca resolve para forçar o timeout.
      const stuckFlush = vi
        .fn()
        .mockImplementation(() => new Promise(() => {}));
      const onFlushFailure = vi.fn();

      const processor = new BulkProcessor({
        limit: 1,
        retries: 1, // 1 tentativa inicial + 1 retry
        flushTimeoutMs: 100, // Timeout bem curto para o teste
        onFlush: stuckFlush,
        onFlushFailure,
      });

      // Act: Adiciona um item para disparar o flush, que irá falhar por timeout.
      // O processador deve então tentar novamente, o que também falhará por timeout.
      await processor.add({ id: 1 });
      await processor.end();

      // Assert
      // A lógica de retry foi acionada, chamando o flush 2 vezes no total.
      expect(stuckFlush).toHaveBeenCalledTimes(2);
      // Como todas as tentativas falharam, o callback de falha definitiva foi chamado.
      expect(onFlushFailure).toHaveBeenCalledTimes(1);
    });

    it("should shutdown gracefully if end() is called while add() calls are paused by backpressure", async () => {
      // Arrange
      let totalItemsProcessed = 0;
      const slowFlush = vi.fn().mockImplementation(async ({ batch }) => {
        // Flush bem lento para garantir que o backpressure seja ativado
        await new Promise((r) => setTimeout(r, 100));
        totalItemsProcessed += batch.length;
      });

      const processor = new BulkProcessor({
        limit: 10,
        maxBufferSize: 20, // Buffer muito pequeno
        maxConcurrentFlushes: 1, // Sequencial para facilitar a análise do teste
        onFlush: slowFlush,
      });

      // Act
      // Dispara 50 chamadas a 'add'. As primeiras serão processadas,
      // mas as últimas ficarão pausadas pelo backpressure.
      const addPromises = [];
      for (let i = 0; i < 50; i++) {
        addPromises.push(processor.add({ id: i }));
      }

      // Imediatamente, chama end(). Esta chamada vai "competir" com as chamadas 'add' pausadas.
      const endPromise = processor.end();

      // Aguarda a finalização de tudo. O método `end()` só deve resolver após
      // todas as chamadas `add` pausadas terem conseguido adicionar seus itens e
      // estes terem sido processados pelo flush.
      await Promise.all([...addPromises, endPromise]);

      // Assert: Nenhum item foi perdido. Todos os 50 itens foram processados,
      // provando que `end()` esperou o backpressure ser resolvido.
      expect(totalItemsProcessed).toBe(50);
    }, 20000); // Timeout maior para este teste complexo
  });

  // =================================================================================================
  // Testes de Concorrência e Estado (Cenários Caóticos)
  // =================================================================================================
  describe("Advanced Concurrency and State Scenarios (Chaotic)", () => {
    it("should handle simultaneous calls to flush() and end() gracefully", async () => {
      // Arrange
      let resolveFlush;
      const slowFlush = vi.fn().mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveFlush = resolve;
          })
      );
      const onEndCallback = vi.fn();

      const processor = new BulkProcessor({
        limit: 10, // Limite alto para evitar auto-flush
        onFlush: slowFlush,
        onEnd: onEndCallback,
      });

      await processor.add({ id: 1 });
      await processor.add({ id: 2 });

      // Act: Dispara flush() e end() ao mesmo tempo.
      const racePromise = Promise.all([processor.flush(), processor.end()]);
      await flushPromises(); // Garante que as chamadas foram iniciadas.

      // Libera o flush que foi iniciado pela chamada manual.
      resolveFlush();
      // Aguarda a conclusão da corrida.
      await racePromise;

      // Assert
      // 1. O onEnd foi chamado, como esperado.
      expect(onEndCallback).toHaveBeenCalledTimes(1);
      // 2. O onFlush foi chamado APENAS UMA VEZ. O end() não deve ter disparado um segundo flush redundante.
      expect(slowFlush).toHaveBeenCalledTimes(1);
      // 3. O lote processado continha os itens corretos.
      expect(slowFlush.mock.calls[0][0].batch).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it("should ignore multiple concurrent manual flush() calls if concurrency slots are full", async () => {
      // Arrange
      const flushResolvers = [];
      const slowFlush = vi
        .fn()
        .mockImplementation(
          () => new Promise((resolve) => flushResolvers.push(resolve))
        );

      const processor = new BulkProcessor({
        limit: 2,
        maxConcurrentFlushes: 1, // Apenas 1 slot de concorrência
        onFlush: slowFlush,
      });

      // Adiciona itens para 2 lotes
      await processor.add({ id: 1 });
      await processor.add({ id: 2 });
      await processor.add({ id: 3 });
      await processor.add({ id: 4 });

      // Act (Phase 1): Inicia o primeiro flush e, enquanto ele está "travado", dispara vários outros.
      processor.flush(); // Ocupa o único slot.
      await flushPromises();

      // Dispara chamadas manuais que devem ser ignoradas.
      await Promise.all([
        processor.flush(),
        processor.flush(),
        processor.flush(),
      ]);

      // Assert (Phase 1): Apenas o primeiro flush deve estar ativo.
      expect(slowFlush).toHaveBeenCalledTimes(1);

      // Act (Phase 2): Libera o primeiro flush. A lógica reativa interna deve iniciar o segundo.
      flushResolvers[0]();
      await flushPromises();

      // Assert (Phase 2): O segundo lote foi processado pela lógica interna, não pelas chamadas manuais.
      // O total de chamadas agora é 2.
      expect(slowFlush).toHaveBeenCalledTimes(2);

      // Cleanup
      flushResolvers.forEach((r) => r());
      await processor.end();
    });
  });

  // =================================================================================================
  // Testes de Casos Extremos de Dados e Configuração
  // =================================================================================================
  describe("Data and Configuration Edge Cases", () => {
    it("should handle a single giant item without memory issues", async () => {
      // Arrange
      // Cria um item grande (20 MB) para testar o manuseio de memória.
      const largeString = "x".repeat(20 * 1024 * 1024);
      const giantItem = { id: "giant", data: largeString };

      const processor = new BulkProcessor({
        limit: 2, // Precisa de 2 itens para disparar o flush
        onFlush: mockCallbacks.onFlush,
      });

      // Act
      await processor.add(giantItem);
      await processor.add({ id: "normal-item" }); // Adiciona um segundo item para disparar
      await processor.end();

      // Assert
      expect(mockCallbacks.onFlush).toHaveBeenCalledTimes(1);
      const receivedBatch = mockCallbacks.onFlush.mock.calls[0][0].batch;
      expect(receivedBatch).toHaveLength(2);
      // Verifica se o item gigante foi passado corretamente, checando o tamanho do payload.
      expect(receivedBatch[0].data.length).toBe(20 * 1024 * 1024);
    }, 20000); // Timeout maior para alocação de memória grande.

    it.each([
      { option: "limit", input: "150", expected: 150 },
      { option: "maxConcurrentFlushes", input: "5", expected: 5 },
      { option: "retries", input: "3", expected: 3 },
      { option: "retryDelayMs", input: "2500", expected: 2500 },
      { option: "flushTimeoutMs", input: "10000", expected: 10000 },
    ])(
      'should correctly parse numeric parameter "$option" passed as a string',
      ({ option, input, expected }) => {
        // Arrange & Act
        const processor = new BulkProcessor({
          [option]: input,
          logger: mockLogger,
        });
        const expectedObject = { [option]: expected };

        // Assert: O log de inicialização deve mostrar o valor numérico correto.
        expect(mockLogger.info).toHaveBeenCalledWith(
          expect.stringContaining("BulkProcessor inicializado."),
          expect.objectContaining(expectedObject)
        );
      }
    );
  });

  // =================================================================================================
  // Testes de Comportamento de Callbacks
  // =================================================================================================
  describe("Callback Behavior", () => {
    it("should not block processing if the onBackpressure callback is slow or fails", async () => {
      // Arrange
      const onBackpressureError = new Error("onBackpressure failed!");
      const slowAndFailingOnBackpressure = vi
        .fn()
        // Na primeira chamada, é lento
        .mockImplementationOnce(
          () => new Promise((resolve) => setTimeout(resolve, 500))
        )
        // Nas chamadas seguintes, ele falha
        .mockRejectedValue(onBackpressureError);

      let totalItemsProcessed = 0;
      const slowFlush = vi.fn().mockImplementation(async ({ batch }) => {
        await new Promise((r) => setTimeout(r, 50));
        totalItemsProcessed += batch.length;
      });

      const processor = new BulkProcessor({
        limit: 10,
        maxBufferSize: 20,
        maxConcurrentFlushes: 2,
        onFlush: slowFlush,
        onBackpressure: slowAndFailingOnBackpressure,
        logger: mockLogger,
      });

      // Act & Assert: A operação inteira não deve quebrar, mesmo com o callback problemático.
      await expect(
        (async () => {
          const addPromises = [];
          for (let i = 0; i < 50; i++) {
            addPromises.push(processor.add({ id: i }));
          }
          await processor.end();
        })()
      ).resolves.not.toThrow();

      // Assert
      // 1. O callback de backpressure foi chamado.
      expect(slowAndFailingOnBackpressure).toHaveBeenCalled();
      // 2. O erro do callback foi logado, mas não parou o processador.
      expect(mockLogger.error).toHaveBeenCalledWith(
        "Erro no callback onBackpressure.",
        expect.objectContaining({ errorMessage: onBackpressureError.message })
      );
      // 3. Mais importante: nenhum item foi perdido.
      expect(totalItemsProcessed).toBe(50);
    }, 15000);
  });
});
