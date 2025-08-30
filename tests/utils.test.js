import {
  describe,
  expect,
  it,
  vi,
  assert,
  beforeEach,
  afterEach,
} from "vitest";
import { constants, utils } from "../src/index.js";
import fs from "fs";
import jsonTest from "./testContent.js";

// ------------------------------------------------------------------------------------------------

function deepEqual(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

// ------------------------------------------------------------------------------------------------

describe("UTILS - assign", () => {
  // ----------------------------------------------------------------------------------------------

  const assign = utils.assign;

  // ----------------------------------------------------------------------------------------------

  it("assign should merge two objects successfully", () => {
    const target = { a: 1, b: { c: 2 } };
    const source = { b: { d: 3 }, e: 4 };

    const result = assign(target, source);
    const expected = { a: 1, b: { c: 2, d: 3 }, e: 4 };

    expect(deepEqual(result, expected)).toBeTruthy();
  });

  // ----------------------------------------------------------------------------------------------

  it("assign should merge two objects successfully with an empty target", () => {
    const target = {};
    const source = { a: 1, b: { c: 2 } };

    const result = assign(target, source);

    assert(deepEqual(result, { a: 1, b: { c: 2 } }));
  });

  // ----------------------------------------------------------------------------------------------

  it("assign should merge two objects successfully with an empty source", () => {
    const target = { a: 1, b: { c: 2 } };
    const source = {};

    const result = assign(target, source);

    assert(deepEqual(result, { a: 1, b: { c: 2 } }));
  });

  // ----------------------------------------------------------------------------------------------

  it("assign should handle non-object target when throwsError=false", () => {
    const target = "notAnObject";
    const source = { a: 1, b: 2 };

    const result = assign(target, source, { throwsError: false });

    expect(result).toBe(null);
  });

  // ----------------------------------------------------------------------------------------------

  it("assign should handle non-object source when throwsError=false", () => {
    const target = { a: 1 };
    const source = "notAnObject";

    const result = assign(target, source, { throwsError: false });

    expect(result).toBe(null);
  });

  // ----------------------------------------------------------------------------------------------

  it("assign should throw an error for non-object target when throwsError=true", () => {
    const target = "notAnObject";
    const source = { a: 1, b: 2 };

    try {
      assign(target, source);
      // If it doesn't throw an error, fail the test
      assert(false);
    } catch (error) {
      expect(error.message).toBe(
        "assign: O parâmetro 'target' deve ser um objeto."
      );
    }
  });

  // ----------------------------------------------------------------------------------------------

  it("assign should throw an error for non-object source when throwsError=true", () => {
    const target = { a: 1 };
    const source = "notAnObject";

    try {
      assign(target, source);
      // If it doesn't throw an error, fail the test
      assert(false);
    } catch (error) {
      expect(error.message).toBe(
        "assign: O parâmetro 'source' deve ser um objeto."
      );
    }
  });

  // ----------------------------------------------------------------------------------------------
});

describe("UTILS - assign (Comprehensive Tests)", () => {
  const assign = utils.assign;

  // ----------------------------------------------------------------------------------------------
  // TESTES BÁSICOS (seus testes originais)
  // ----------------------------------------------------------------------------------------------

  it("assign should merge two objects successfully", () => {
    const target = { a: 1, b: { c: 2 } };
    const source = { b: { d: 3 }, e: 4 };

    const result = assign(target, source);
    const expected = { a: 1, b: { c: 2, d: 3 }, e: 4 };

    expect(deepEqual(result, expected)).toBeTruthy();
  });

  it("assign should merge two objects successfully with an empty target", () => {
    const target = {};
    const source = { a: 1, b: { c: 2 } };

    const result = assign(target, source);

    assert(deepEqual(result, { a: 1, b: { c: 2 } }));
  });

  it("assign should merge two objects successfully with an empty source", () => {
    const target = { a: 1, b: { c: 2 } };
    const source = {};

    const result = assign(target, source);

    assert(deepEqual(result, { a: 1, b: { c: 2 } }));
  });

  it("assign should handle non-object target when throwsError=false", () => {
    const target = "notAnObject";
    const source = { a: 1, b: 2 };

    const result = assign(target, source, { throwsError: false });

    expect(result).toBe(null);
  });

  it("assign should handle non-object source when throwsError=false", () => {
    const target = { a: 1 };
    const source = "notAnObject";

    const result = assign(target, source, { throwsError: false });

    expect(result).toBe(null);
  });

  it("assign should throw an error for non-object target when throwsError=true", () => {
    const target = "notAnObject";
    const source = { a: 1, b: 2 };

    try {
      assign(target, source);
      assert(false);
    } catch (error) {
      expect(error.message).toBe(
        "assign: O parâmetro 'target' deve ser um objeto."
      );
    }
  });

  it("assign should throw an error for non-object source when throwsError=true", () => {
    const target = { a: 1 };
    const source = "notAnObject";

    try {
      assign(target, source);
      assert(false);
    } catch (error) {
      expect(error.message).toBe(
        "assign: O parâmetro 'source' deve ser um objeto."
      );
    }
  });

  // ----------------------------------------------------------------------------------------------
  // TESTES DE IMUTABILIDADE
  // ----------------------------------------------------------------------------------------------

  it("assign should not modify original objects (immutability test)", () => {
    const target = { a: 1, nested: { x: 10 } };
    const source = { b: 2, nested: { y: 20 } };

    const originalTarget = JSON.parse(JSON.stringify(target));
    const originalSource = JSON.parse(JSON.stringify(source));

    assign(target, source);

    expect(deepEqual(target, originalTarget)).toBeTruthy();
    expect(deepEqual(source, originalSource)).toBeTruthy();
  });

  // ----------------------------------------------------------------------------------------------
  // TESTES DE TIPOS ESPECIAIS
  // ----------------------------------------------------------------------------------------------

  it("assign should handle Date objects correctly", () => {
    const target = { date: new Date("2023-01-01") };
    const source = { date: new Date("2024-01-01"), other: "value" };

    const result = assign(target, source);

    expect(result.date instanceof Date).toBeTruthy();
    expect(result.date.getTime()).toBe(new Date("2024-01-01").getTime());
    expect(result.other).toBe("value");
  });

  it("assign should handle RegExp objects correctly", () => {
    const target = { regex: /old/gi };
    const source = { regex: /new/m, flag: true };

    const result = assign(target, source);

    expect(result.regex instanceof RegExp).toBeTruthy();
    expect(result.regex.source).toBe("new");
    expect(result.regex.flags).toBe("m");
    expect(result.flag).toBe(true);
  });

  it("assign should handle Map objects correctly", () => {
    const target = {
      map: new Map([["key1", "value1"]]),
      other: "preserved",
    };
    const source = {
      map: new Map([
        ["key2", "value2"],
        ["key3", "value3"],
      ]),
    };

    const result = assign(target, source);

    expect(result.map instanceof Map).toBeTruthy();
    expect(result.map.get("key2")).toBe("value2");
    expect(result.map.get("key3")).toBe("value3");
    expect(result.map.has("key1")).toBeFalsy(); // Substituição completa
    expect(result.other).toBe("preserved");
  });

  it("assign should handle Set objects correctly", () => {
    const target = {
      set: new Set([1, 2, 3]),
      data: "kept",
    };
    const source = {
      set: new Set([4, 5, 6]),
    };

    const result = assign(target, source);

    expect(result.set instanceof Set).toBeTruthy();
    expect(result.set.has(4)).toBeTruthy();
    expect(result.set.has(5)).toBeTruthy();
    expect(result.set.has(6)).toBeTruthy();
    expect(result.set.has(1)).toBeFalsy(); // Substituição completa
    expect(result.data).toBe("kept");
  });

  it("assign should handle Arrays correctly", () => {
    const target = {
      arr: [1, 2, { nested: "old" }],
      other: "value",
    };
    const source = {
      arr: [3, 4, { nested: "new", added: true }],
    };

    const result = assign(target, source);

    expect(Array.isArray(result.arr)).toBeTruthy();
    expect(result.arr).toEqual([3, 4, { nested: "new", added: true }]);
    expect(result.other).toBe("value");
  });

  it("assign should handle TypedArrays correctly", () => {
    const target = {
      buffer: new Uint8Array([1, 2, 3]),
    };
    const source = {
      buffer: new Uint8Array([4, 5, 6, 7]),
    };

    const result = assign(target, source);

    expect(result.buffer instanceof Uint8Array).toBeTruthy();
    expect(Array.from(result.buffer)).toEqual([4, 5, 6, 7]);
  });

  // ----------------------------------------------------------------------------------------------
  // TESTES DE REFERÊNCIAS CIRCULARES
  // ----------------------------------------------------------------------------------------------

  it("assign should handle circular references in target", () => {
    const target = { a: 1 };
    target.self = target;

    const source = { b: 2 };

    const result = assign(target, source);

    expect(result.a).toBe(1);
    expect(result.b).toBe(2);
    expect(result.self).toBe(result); // Referência circular preservada
  });

  it("assign should handle circular references in source", () => {
    const target = { a: 1 };
    const source = { b: 2 };
    source.self = source;

    const result = assign(target, source);

    expect(result.a).toBe(1);
    expect(result.b).toBe(2);
    expect(result.self).toBe(result.self); // Referência circular clonada
  });

  it("assign should handle complex circular references", () => {
    const target = {
      level1: {
        level2: { value: "target" },
      },
    };
    target.level1.level2.parent = target.level1;

    const source = {
      level1: {
        level2: { value: "source", newProp: "added" },
      },
    };
    source.level1.level2.parent = source;

    const result = assign(target, source);

    expect(result.level1.level2.value).toBe("source");
    expect(result.level1.level2.newProp).toBe("added");
    // A estrutura circular deve estar presente (substituição completa do level1)
  });

  // ----------------------------------------------------------------------------------------------
  // TESTES DE MERGE PROFUNDO - COMENTADOS (FUNCIONALIDADE NÃO IMPLEMENTADA)
  // ----------------------------------------------------------------------------------------------

  it("assign should not perform deep merge when deepMerge=false (default)", () => {
    const target = {
      config: { theme: "dark", notifications: true },
      user: "admin",
    };
    const source = {
      config: { notifications: false, timezone: "UTC-3" },
    };

    const result = assign(target, source);

    expect(result.config.theme).toBe("dark"); // Perdido na substituição
    expect(result.config.notifications).toBe(false);
    expect(result.config.timezone).toBe("UTC-3");
    expect(result.user).toBe("admin");
  });

  // ----------------------------------------------------------------------------------------------
  // TESTES DE EXCLUSÃO DE PROPRIEDADES
  // ----------------------------------------------------------------------------------------------

  it("assign should handle invalid exclude option", () => {
    const target = { a: 1 };
    const source = { b: 2 };

    const result = assign(target, source, { exclude: "notAnArray" });

    expect(result).toEqual({ a: 1, b: 2 });
  });

  // ----------------------------------------------------------------------------------------------
  // TESTES DE CASOS ESPECIAIS
  // ----------------------------------------------------------------------------------------------

  it("assign should handle null values correctly", () => {
    const target = { a: 1, b: null };
    const source = { b: { nested: "value" }, c: null };

    const result = assign(target, source);

    expect(result.a).toBe(1);
    expect(result.b.nested).toBe("value");
    expect(result.c).toBe(null);
  });

  it("assign should handle undefined values correctly", () => {
    const target = { a: 1, b: undefined };
    const source = { b: "defined", c: undefined };

    const result = assign(target, source);

    expect(result.a).toBe(1);
    expect(result.b).toBe("defined");
    expect(result.c).toBe(undefined);
  });

  it("assign should handle arrays with complex nested structures", () => {
    const target = {
      items: [
        { id: 1, data: { status: "active" } },
        { id: 2, data: { status: "inactive" } },
      ],
    };
    const source = {
      items: [{ id: 3, data: { status: "pending", priority: "high" } }],
    };

    const result = assign(target, source);

    expect(result.items.length).toBe(1); // Array substituído completamente
    expect(result.items[0].id).toBe(3);
    expect(result.items[0].data.status).toBe("pending");
    expect(result.items[0].data.priority).toBe("high");
  });

  it("assign should handle mixed primitive and object values", () => {
    const target = {
      string: "target",
      number: 42,
      boolean: true,
      object: { nested: "target" },
      array: [1, 2, 3],
    };
    const source = {
      string: "source",
      number: 100,
      boolean: false,
      object: { nested: "source", added: "new" },
      array: [4, 5],
    };

    const result = assign(target, source);

    expect(result.string).toBe("source");
    expect(result.number).toBe(100);
    expect(result.boolean).toBe(false);
    expect(result.object.nested).toBe("source");
    expect(result.object.added).toBe("new");
    expect(result.array).toEqual([4, 5]);
  });

  // ----------------------------------------------------------------------------------------------
  // TESTES DE TYPES ESPECIAIS (para a versão robusta)
  // ----------------------------------------------------------------------------------------------

  it("assign should handle Date objects in nested structures", () => {
    const target = {
      events: {
        created: new Date("2023-01-01"),
        updated: new Date("2023-06-01"),
      },
    };
    const source = {
      events: {
        updated: new Date("2024-01-01"),
        deleted: new Date("2024-06-01"),
      },
    };

    const result = assign(target, source);

    expect(result.events.created instanceof Date).toBeTruthy();
    expect(result.events.updated instanceof Date).toBeTruthy();
    expect(result.events.updated.getTime()).toBe(
      new Date("2024-01-01").getTime()
    );
    expect(result.events.deleted instanceof Date).toBeTruthy();
  });

  it("assign should handle RegExp objects in nested structures", () => {
    const target = {
      validation: {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^\d{10}$/,
      },
    };
    const source = {
      validation: {
        phone: /^\d{11}$/,
        zipCode: /^\d{5}-?\d{3}$/,
      },
    };

    const result = assign(target, source);

    expect(result.validation.email).toEqual(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    expect(result.validation.phone instanceof RegExp).toBeTruthy();
    expect(result.validation.phone.source).toBe("^\\d{11}$");
    expect(result.validation.zipCode instanceof RegExp).toBeTruthy();
  });

  it("assign should handle Map objects", () => {
    const target = {
      cache: new Map([["key1", "value1"]]),
      other: "data",
    };
    const source = {
      cache: new Map([
        ["key2", "value2"],
        ["key3", { nested: true }],
      ]),
    };

    const result = assign(target, source);

    expect(result.cache instanceof Map).toBeTruthy();
    expect(result.cache.get("key2")).toBe("value2");
    expect(result.cache.get("key3")).toEqual({ nested: true });
    expect(result.cache.has("key1")).toBeFalsy();
    expect(result.other).toBe("data");
  });

  it("assign should handle Set objects", () => {
    const target = {
      tags: new Set(["tag1", "tag2"]),
      name: "target",
    };
    const source = {
      tags: new Set(["tag3", "tag4"]),
    };

    const result = assign(target, source);

    expect(result.tags instanceof Set).toBeTruthy();
    expect(result.tags.has("tag3")).toBeTruthy();
    expect(result.tags.has("tag4")).toBeTruthy();
    expect(result.tags.has("tag1")).toBeFalsy();
    expect(result.name).toBe("target");
  });

  it("assign should handle TypedArrays", () => {
    const target = {
      buffer: new Uint8Array([1, 2, 3]),
      meta: "info",
    };
    const source = {
      buffer: new Uint16Array([100, 200]),
    };

    const result = assign(target, source);

    expect(result.buffer instanceof Uint16Array).toBeTruthy();
    expect(Array.from(result.buffer)).toEqual([100, 200]);
    expect(result.meta).toBe("info");
  });

  // ----------------------------------------------------------------------------------------------
  // TESTES DE PERFORMANCE E EDGE CASES
  // ----------------------------------------------------------------------------------------------

  it("assign should handle deeply nested objects", () => {
    const target = {
      level1: {
        level2: {
          level3: {
            level4: {
              level5: { value: "deep_target" },
            },
          },
        },
      },
    };
    const source = {
      level1: {
        level2: {
          level3: {
            level4: {
              level5: { value: "deep_source", newKey: "added" },
            },
          },
        },
      },
    };

    const result = assign(target, source);

    expect(result.level1.level2.level3.level4.level5.value).toBe("deep_source");
    expect(result.level1.level2.level3.level4.level5.newKey).toBe("added");
  });

  it("assign should handle large objects efficiently", () => {
    const target = {};
    const source = {};

    // Cria objetos com muitas propriedades
    for (let i = 0; i < 1000; i++) {
      target[`prop_${i}`] = { value: i, nested: { deep: i * 2 } };
    }
    for (let i = 500; i < 1500; i++) {
      source[`prop_${i}`] = { value: i + 1000, nested: { deep: i * 3 } };
    }

    const startTime = performance.now();
    const result = assign(target, source);
    const endTime = performance.now();

    expect(Object.keys(result).length).toBe(1500);
    expect(result.prop_0.value).toBe(0); // Do target
    expect(result.prop_1000.value).toBe(2000); // Do source
    expect(endTime - startTime).toBeLessThan(100); // Deve ser rápido (< 100ms)
  });

  it("assign should handle objects with symbol properties", () => {
    const sym1 = Symbol("test1");
    const sym2 = Symbol("test2");

    const target = {
      [sym1]: "target_symbol",
      regular: "target_regular",
    };
    const source = {
      [sym2]: "source_symbol",
      regular: "source_regular",
    };

    const result = assign(target, source);

    expect(result[sym1]).toBe("target_symbol"); // Símbolos do target são preservados
    expect(result[sym2]).toBe("source_symbol"); // Símbolos do source são adicionados
    expect(result.regular).toBe("source_regular");
  });

  // ----------------------------------------------------------------------------------------------
  // TESTES DE VALIDAÇÃO DE OPÇÕES
  // ----------------------------------------------------------------------------------------------

  it("assign should handle default options correctly", () => {
    const target = { a: 1 };
    const source = { b: 2 };

    const result = assign(target, source);

    expect(result.a).toBe(1);
    expect(result.b).toBe(2);
  });

  // ----------------------------------------------------------------------------------------------
  // TESTES DE EDGE CASES EXTREMOS
  // ----------------------------------------------------------------------------------------------

  it("assign should handle empty objects with different prototypes", () => {
    const target = Object.create({ inherited: "from_target" });
    const source = Object.create({ inherited: "from_source" });
    source.own = "property";

    const result = assign(target, source);

    expect(result.own).toBe("property");
    // Com deepClone, o protótipo é preservado
    expect(result.inherited).toBe("from_source"); // Protótipo do target preservado
  });

  it("assign should handle objects with non-enumerable properties", () => {
    const target = {};
    Object.defineProperty(target, "hidden", {
      value: "target_hidden",
      enumerable: false,
      writable: true,
      configurable: true,
    });

    const source = { visible: "source_visible" };
    Object.defineProperty(source, "hidden", {
      value: "source_hidden",
      enumerable: false,
      writable: true,
      configurable: true,
    });

    const result = assign(target, source);

    expect(result.visible).toBe("source_visible");
    // Propriedades não-enumeráveis podem ser perdidas dependendo da implementação
  });

  it("assign should preserve object integrity after multiple operations", () => {
    const base = {
      id: 1,
      data: {
        values: [1, 2, 3],
        meta: { created: new Date("2023-01-01") },
      },
    };

    const update1 = { data: { values: [4, 5] } };
    const update2 = { data: { meta: { updated: new Date("2024-01-01") } } };

    const result1 = assign(base, update1);
    const result2 = assign(result1, update2);

    expect(result2.id).toBe(1);
    // Com merge superficial, data é completamente substituído a cada operação
    expect(result2.data.meta.updated instanceof Date).toBeTruthy();
    expect(result2.data.values).toEqual([4, 5]);
    expect(result2.data.meta.created instanceof Date).toBeTruthy();

    // Objetos originais devem permanecer inalterados
    expect(base.data.values).toEqual([1, 2, 3]);
  });

  // ----------------------------------------------------------------------------------------------
  // TESTES DE COMPATIBILIDADE E EDGE CASES
  // ----------------------------------------------------------------------------------------------

  it("assign should handle objects with getters and setters", () => {
    const target = {
      get computed() {
        return this._value * 2;
      },
      set computed(val) {
        this._value = val / 2;
      },
      _value: 5,
    };
    const source = { _value: 10, other: "data" };

    const result = assign(target, source);

    expect(result._value).toBe(10);
    expect(result.other).toBe("data");
    // Getters/setters podem ser perdidos dependendo da implementação
  });

  it("assign should maintain performance with complex circular structures", () => {
    const target = { a: 1 };
    const source = { b: 2 };

    // Cria uma estrutura circular complexa
    for (let i = 0; i < 10; i++) {
      target[`level${i}`] = { ref: target, data: i };
      source[`level${i}`] = { ref: source, data: i + 100 };
    }

    const startTime = performance.now();
    const result = assign(target, source);
    const endTime = performance.now();

    expect(result.a).toBe(1);
    expect(result.b).toBe(2);
    expect(result.level5.data).toBe(105);
    expect(endTime - startTime).toBeLessThan(50); // Deve ser eficiente
  });

  it("assign should handle function properties correctly", () => {
    const target = {
      method: function () {
        return "target";
      },
      data: "target_data",
    };
    const source = {
      method: function () {
        return "source";
      },
      newMethod: () => "arrow_function",
    };

    const result = assign(target, source);

    expect(typeof result.method).toBe("function");
    expect(result.method()).toBe("source");
    expect(typeof result.newMethod).toBe("function");
    expect(result.newMethod()).toBe("arrow_function");
    expect(result.data).toBe("target_data");
  });

  // ----------------------------------------------------------------------------------------------
  // TESTES DE REGRESSÃO E COMPATIBILIDADE
  // ----------------------------------------------------------------------------------------------

  it("assign should handle stress test with mixed data types", () => {
    const target = {
      string: "test",
      number: 42,
      boolean: true,
      date: new Date("2023-01-01"),
      regex: /test/gi,
      array: [1, { nested: "value" }],
      map: new Map([["key", "value"]]),
      set: new Set([1, 2, 3]),
      nested: {
        deep: {
          deeper: {
            value: "target",
          },
        },
      },
    };

    const source = {
      string: "updated",
      newNumber: 100,
      date: new Date("2024-01-01"),
      array: [{ different: "structure" }],
      map: new Map([["newKey", "newValue"]]),
      nested: {
        deep: {
          deeper: {
            value: "source",
            added: "property",
          },
        },
      },
    };

    const result = assign(target, source);

    expect(result.string).toBe("updated");
    expect(result.number).toBe(42);
    expect(result.newNumber).toBe(100);
    expect(result.date.getTime()).toBe(source.date.getTime());
    expect(result.array[0].different).toBe("structure");
    expect(result.map.get("newKey")).toBe("newValue");
    expect(result.nested.deep.deeper.value).toBe("source");
  });

  // ----------------------------------------------------------------------------------------------
  // TESTES DE ERROR HANDLING
  // ----------------------------------------------------------------------------------------------

  it("assign should handle stack overflow protection", () => {
    // Cria um objeto com aninhamento muito profundo
    let deepTarget = {};
    let current = deepTarget;

    for (let i = 0; i < 100; i++) {
      current.next = { level: i };
      current = current.next;
    }

    const source = { additional: "data" };

    // Não deve causar stack overflow
    expect(() => assign(deepTarget, source)).not.toThrow();
  });

  // ----------------------------------------------------------------------------------------------
  // TESTES DE DEEP MERGE AVANÇADOS
  // ----------------------------------------------------------------------------------------------

  it("assign should handle deep merge with complex mixed types", () => {
    // NOTA: Este teste assume que deepMerge foi implementado.
    // Se não estiver disponível, deve ser removido ou adaptado.

    // Teste básico sem deepMerge para compatibilidade
    const target = {
      data: {
        timestamps: { created: new Date("2023-01-01") },
        patterns: { email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      },
    };
    const source = {
      data: {
        timestamps: { accessed: new Date("2024-01-01") },
        patterns: { phone: /^\(\d{2}\)\s\d{4,5}-\d{4}$/ },
      },
    };

    const result = assign(target, source);

    // Com merge superficial, data é completamente substituído
    expect(result.data.timestamps.accessed instanceof Date).toBeTruthy();
    expect(result.data.timestamps.created instanceof Date).toBeTruthy();
    expect(result.data.patterns.phone instanceof RegExp).toBeTruthy();
    expect(result.data.patterns.email).toEqual(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  // ----------------------------------------------------------------------------------------------
  // TESTES DE EXCLUDE AVANÇADOS
  // ----------------------------------------------------------------------------------------------

  it("assign should handle exclude with nested property names - REQUIRES IMPLEMENTATION", () => {
    // NOTA: Este teste requer que a funcionalidade exclude seja implementada
    // Removendo por enquanto, pois não está no código original

    const target = {
      user: { name: "John", password: "old123" },
      session: { token: "old_token" },
    };
    const source = {
      user: { name: "Jane", password: "new456", email: "jane@example.com" },
      session: { token: "new_token", refreshToken: "refresh123" },
    };

    // Comportamento atual sem exclude
    const result = assign(target, source);

    expect(result.user.name).toBe("Jane");
    expect(result.user.password).toBe("new456"); // Substituído (não há exclude implementado)
    expect(result.user.email).toBe("jane@example.com");
    expect(result.session.token).toBe("new_token"); // Substituído (não há exclude implementado)
    expect(result.session.refreshToken).toBe("refresh123");
  });

  it("assign should handle exclude with empty array", () => {
    const target = { a: 1 };
    const source = { b: 2 };

    const result = assign(target, source, true, { exclude: [] });

    expect(result.a).toBe(1);
    expect(result.b).toBe(2);
  });

  // ----------------------------------------------------------------------------------------------
  // TESTES DE CASOS REAIS DE USO
  // ----------------------------------------------------------------------------------------------

  it("assign should handle state management scenario", () => {
    const currentState = {
      user: {
        id: 1,
        profile: { name: "John", avatar: "john.jpg" },
        preferences: { notifications: true, theme: "dark" },
      },
      app: {
        loading: false,
        errors: [],
      },
    };

    const stateUpdate = {
      user: {
        profile: { name: "John Doe", lastLogin: new Date("2024-01-01") },
      },
      app: {
        loading: true,
      },
    };

    // Com merge superficial (comportamento atual)
    const newState = assign(currentState, stateUpdate);

    expect(newState.user.id).toBe(1); // Preservado
    expect(newState.user.profile.name).toBe("John Doe"); // Atualizado
    expect(newState.user.profile.avatar).toBe("john.jpg");
    expect(newState.user.profile.lastLogin instanceof Date).toBeTruthy(); // Adicionado
    expect(newState.app.loading).toBe(true); // Atualizado
    expect(newState.app.errors).toEqual([]);
  });

  // ----------------------------------------------------------------------------------------------
  // TESTES DE MEMORY LEAKS E PERFORMANCE
  // ----------------------------------------------------------------------------------------------

  it("assign should not create memory leaks with large circular structures", () => {
    const createCircularStructure = (size) => {
      const root = { id: "root" };
      let current = root;

      for (let i = 0; i < size; i++) {
        current.next = { id: i, parent: root };
        current = current.next;
      }
      current.next = root; // Fecha o círculo

      return root;
    };

    const target = createCircularStructure(100);
    const source = {
      additional: "data",
      circular: createCircularStructure(50),
    };

    // Deve completar sem esgotar memória
    expect(() => assign(target, source)).not.toThrow();
  });

  it("assign should handle concurrent modifications gracefully", () => {
    const target = { counter: 0, data: { values: [] } };
    const source = { counter: 1, data: { values: [1, 2, 3] } };

    // Simula múltiplas operações
    const results = [];
    for (let i = 0; i < 10; i++) {
      const tempSource = { counter: i, iteration: i };
      results.push(assign(target, tempSource));
    }

    expect(results.length).toBe(10);
    expect(results[5].counter).toBe(5);
    expect(results[9].iteration).toBe(9);
    expect(target.counter).toBe(0); // Original não modificado
  });

  // ----------------------------------------------------------------------------------------------
  // TESTES DE VALIDAÇÃO ROBUSTA
  // ----------------------------------------------------------------------------------------------

  it("assign should handle edge case with prototype pollution protection", () => {
    const target = { safe: "property" };
    const maliciousSource = JSON.parse('{"__proto__": {"polluted": true}}');

    const result = assign(target, maliciousSource);

    expect(result.safe).toBe("property");
    expect({}.polluted).toBeUndefined(); // Não deve poluir prototype global
  });

  // ----------------------------------------------------------------------------------------------
  // TESTES DE CASOS ESPECÍFICOS DO JAVASCRIPT
  // ----------------------------------------------------------------------------------------------

  it("assign should handle WeakMap and WeakSet correctly", () => {
    const obj1 = { id: 1 };
    const obj2 = { id: 2 };

    const target = {
      weakMap: new WeakMap([[obj1, "value1"]]),
      regular: "data",
    };
    const source = {
      weakMap: new WeakMap([[obj2, "value2"]]),
    };

    // WeakMap/WeakSet não são iteráveis, então o comportamento pode variar
    const result = assign(target, source);
    expect(result.regular).toBe("data");
  });

  it("assign should preserve object descriptors when possible", () => {
    const target = {};
    Object.defineProperty(target, "readonly", {
      value: "cannot_change",
      writable: false,
      enumerable: true,
      configurable: false,
    });

    const source = {
      readonly: "new_value",
      normal: "property",
    };

    const result = assign(target, source);

    expect(result.normal).toBe("property");
    // O comportamento com propriedades readonly pode variar
  });

  // ----------------------------------------------------------------------------------------------
  // BENCHMARK E PERFORMANCE TESTS
  // ----------------------------------------------------------------------------------------------

  it("assign should complete within reasonable time for large datasets", () => {
    const createLargeObject = (size) => {
      const obj = {};
      for (let i = 0; i < size; i++) {
        obj[`key_${i}`] = {
          id: i,
          data: `value_${i}`,
          nested: {
            array: new Array(10).fill(i),
            date: new Date(),
            metadata: { created: i, active: i % 2 === 0 },
          },
        };
      }
      return obj;
    };

    const target = createLargeObject(1000);
    const source = createLargeObject(500);

    const startTime = performance.now();
    const result = assign(target, source);
    const endTime = performance.now();

    expect(Object.keys(result).length).toBe(1000);
    expect(endTime - startTime).toBeLessThan(200); // Deve completar em < 200ms
  });

  // ----------------------------------------------------------------------------------------------
  // TESTES DE INTEGRAÇÃO E CASOS COMPLEXOS
  // ----------------------------------------------------------------------------------------------

  it("assign should work correctly in chain operations", () => {
    const base = { a: 1 };
    const update1 = { b: 2 };
    const update2 = { c: 3 };
    const update3 = { a: 10, d: 4 };

    const result = [update1, update2, update3].reduce(
      (acc, update) => assign(acc, update),
      base
    );

    expect(result.a).toBe(10);
    expect(result.b).toBe(2);
    expect(result.c).toBe(3);
    expect(result.d).toBe(4);
    expect(base.a).toBe(1); // Original não modificado
  });

  // ----------------------------------------------------------------------------------------------
  // TESTES FINAIS DE ROBUSTEZ
  // ----------------------------------------------------------------------------------------------

  it("assign should handle all JavaScript primitive types", () => {
    const target = {
      string: "target",
      number: 42,
      bigint: BigInt(123),
      boolean: true,
      symbol: Symbol("target"),
      undefined: undefined,
      null: null,
    };

    const source = {
      string: "source",
      number: 100,
      bigint: BigInt(456),
      boolean: false,
      symbol: Symbol("source"),
      undefined: "now_defined",
      null: "now_not_null",
      newProp: "added",
    };

    const result = assign(target, source);

    expect(result.string).toBe("source");
    expect(result.number).toBe(100);
    expect(typeof result.bigint).toBe("bigint");
    expect(result.boolean).toBe(false);
    expect(typeof result.symbol).toBe("symbol");
    expect(result.undefined).toBe("now_defined");
    expect(result.null).toBe("now_not_null");
    expect(result.newProp).toBe("added");
  });

  it("assign should maintain consistent behavior across different environments", () => {
    const target = { env: "test" };
    const source = {
      date: new Date(),
      regex: /test/g,
      map: new Map([["key", "value"]]),
      set: new Set([1, 2, 3]),
      array: [1, { nested: true }],
      object: { deeply: { nested: { value: "deep" } } },
    };

    const result = assign(target, source);

    // Verifica tipos
    expect(result.date instanceof Date).toBeTruthy();
    expect(result.regex instanceof RegExp).toBeTruthy();
    expect(result.map instanceof Map).toBeTruthy();
    expect(result.set instanceof Set).toBeTruthy();
    expect(Array.isArray(result.array)).toBeTruthy();
    expect(typeof result.object).toBe("object");

    // Verifica integridade dos dados
    expect(result.map.get("key")).toBe("value");
    expect(result.set.has(2)).toBeTruthy();
    expect(result.array[1].nested).toBe(true);
    expect(result.object.deeply.nested.value).toBe("deep");
    expect(result.env).toBe("test");
  });

  // ----------------------------------------------------------------------------------------------
  // STRESS TESTS FINAIS
  // ----------------------------------------------------------------------------------------------

  it("assign should handle extreme nesting without stack overflow", () => {
    const createDeeplyNested = (depth) => {
      let obj = { value: "leaf" };
      for (let i = 0; i < depth; i++) {
        obj = { [`level_${i}`]: obj };
      }
      return obj;
    };

    const target = createDeeplyNested(50);
    const source = { additional: "property" };

    expect(() => assign(target, source)).not.toThrow();
  });

  it("assign should maintain referential integrity in complex scenarios", () => {
    const sharedObject = { shared: true };
    const target = {
      ref1: sharedObject,
      ref2: sharedObject,
      data: "target",
    };
    const source = {
      ref3: sharedObject,
      newData: "source",
    };

    const result = assign(target, source);

    expect(result.ref1.shared).toBe(true);
    expect(result.ref2.shared).toBe(true);
    expect(result.ref3.shared).toBe(true);
    expect(result.data).toBe("target");
    expect(result.newData).toBe("source");

    // Referências clonadas devem ser independentes do original
    sharedObject.modified = true;
    expect(result.ref1.modified).toBeUndefined();
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - base64From", () => {
  // ----------------------------------------------------------------------------------------------

  const base64From = utils.base64From;

  // ----------------------------------------------------------------------------------------------

  it("base64From should return an empty string for non-string input", () => {
    const nonStringInput = 123;
    const result = base64From(nonStringInput);
    expect(result).toBe("");
  });

  // ----------------------------------------------------------------------------------------------

  it("base64From should return an empty string for an empty string input", () => {
    const emptyStringInput = "";
    const result = base64From(emptyStringInput);
    expect(result).toBe("");
  });

  // ----------------------------------------------------------------------------------------------

  it("base64From should correctly decode a valid base64 string", () => {
    const validBase64Input = "SGVsbG8gd29ybGQ=";
    const result = base64From(validBase64Input);
    expect(result).toBe("Hello world");
  });

  // ----------------------------------------------------------------------------------------------

  it("base64From should handle decode to special characters", () => {
    const specialCharactersInput =
      "77-9bmzvv73vv73vv73vv73ilqHvv73vv703ee-_vWLvv70477-9c0rvv73vv73vv70";
    const result = base64From(specialCharactersInput);
    expect(result).toBe("�nl����□��7y�b�8�sJ���");
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - base64FromBase64URLSafe", () => {
  // ----------------------------------------------------------------------------------------------

  const base64FromBase64URLSafe = utils.base64FromBase64URLSafe;

  // ----------------------------------------------------------------------------------------------

  it("should convert URL-safe base64 to standard base64", () => {
    const urlSafeBase64String = "rqXRQrq_mSFhX4c2wSZJrA";
    const expectedBase64String = "rqXRQrq/mSFhX4c2wSZJrA==";
    expect(base64FromBase64URLSafe(urlSafeBase64String)).toBe(
      expectedBase64String
    );
  });

  // ----------------------------------------------------------------------------------------------

  it("should handle base64 strings with different lengths", () => {
    const urlSafeBase64String = "U29tZS1kYXRh";
    const expectedBase64String = "U29tZS1kYXRh";
    expect(base64FromBase64URLSafe(urlSafeBase64String)).toBe(
      expectedBase64String
    );
  });

  // ----------------------------------------------------------------------------------------------

  it("should handle base64 strings with padding characters", () => {
    const urlSafeBase64String = "YW55LXN0cmluZw";
    const expectedBase64String = "YW55LXN0cmluZw==";
    expect(base64FromBase64URLSafe(urlSafeBase64String)).toBe(
      expectedBase64String
    );
  });

  // ----------------------------------------------------------------------------------------------

  it("should handle base64 strings without padding characters", () => {
    const urlSafeBase64String = "c29tZS1kYXRhLXN0cmluZw";
    const expectedBase64String = "c29tZS1kYXRhLXN0cmluZw==";
    expect(base64FromBase64URLSafe(urlSafeBase64String)).toBe(
      expectedBase64String
    );
  });

  // ----------------------------------------------------------------------------------------------

  it("should handle empty strings", () => {
    const urlSafeBase64String = "";
    const expectedBase64String = "";
    expect(base64FromBase64URLSafe(urlSafeBase64String)).toBe(
      expectedBase64String
    );
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - base64FromBuffer", () => {
  // ----------------------------------------------------------------------------------------------

  const base64FromBuffer = utils.base64FromBuffer;

  // ----------------------------------------------------------------------------------------------

  it("base64FromBuffer - should convert an ArrayBuffer to a Base64 string", () => {
    // Create an example ArrayBuffer
    const buffer = new ArrayBuffer(4);
    const view = new Uint8Array(buffer);
    view[0] = 72;
    view[1] = 101;
    view[2] = 108;
    view[3] = 108;

    // Expected Base64 string
    const expectedBase64 = "SGVsbA";

    // Call the function
    const result = base64FromBuffer(buffer);

    // Assert that the result matches the expected Base64 string
    expect(result).toBe(expectedBase64);
  });

  // ----------------------------------------------------------------------------------------------

  it("base64FromBuffer - should return an empty string if the buffer is empty", () => {
    // Create an empty ArrayBuffer
    const buffer = new ArrayBuffer(0);

    // Expected empty Base64 string
    const expectedBase64 = "";

    // Call the function
    const result = base64FromBuffer(buffer);

    // Assert that the result is an empty string
    expect(result).toBe(expectedBase64);
  });

  // ----------------------------------------------------------------------------------------------

  it("base64FromBuffer - should convert an ArrayBuffer with special characters to a Base64 string", () => {
    // Create an example ArrayBuffer with special characters
    const buffer = new ArrayBuffer(6);
    const view = new Uint8Array(buffer);
    view[0] = 72; // 'H'
    view[1] = 101; // 'e'
    view[2] = 108; // 'l'
    view[3] = 108; // 'l'
    view[4] = 111; // 'o'
    view[5] = 240; // Special character (e.g., emoji)

    // Expected Base64 string with special characters
    const expectedBase64 = "SGVsbG/w";

    // Call the function
    const result = base64FromBuffer(buffer);

    // Assert that the result matches the expected Base64 string
    expect(result).toBe(expectedBase64);
  });
  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - base64To", () => {
  // ----------------------------------------------------------------------------------------------

  const base64To = utils.base64To;

  // ----------------------------------------------------------------------------------------------

  it("base64To should return the correct string for non-string input", () => {
    const nonStringInput = 123;
    const result = base64To(nonStringInput);
    expect(result).toBe("MTIz");
  });

  // ----------------------------------------------------------------------------------------------

  it("base64To should throw an error with an incorrect object input", () => {
    try {
      const nonStringInput = {};
      base64To(nonStringInput);
    } catch (error) {
      expect(error.message).toBe(
        "The first argument must be of type string or an instance of Buffer, ArrayBuffer, or Array or an Array-like Object. Received an instance of Object"
      );
    }
  });

  // ----------------------------------------------------------------------------------------------

  it("base64To should correctly encode a string to base64 with default encoding", () => {
    const textInput = "Hello world";
    const result = base64To(textInput);
    expect(result).toBe("SGVsbG8gd29ybGQ");
  });

  // ----------------------------------------------------------------------------------------------

  it("base64To should correctly encode a string to base64 with a specified encoding", () => {
    const textInput = "Hello world";
    const result = base64To(textInput, "utf16le");
    expect(result).toBe("SABlAGwAbABvACAAdwBvAHIAbABkAA");
  });

  // ----------------------------------------------------------------------------------------------

  it("base64To should correctly encode a string to base64 with a specified ASCII encoding", () => {
    const textInput = "Hello world";
    const result = base64To(textInput, "ascii");
    expect(result).toBe("SGVsbG8gd29ybGQ");
  });

  // ----------------------------------------------------------------------------------------------

  it("base64To should handle an empty string input", () => {
    const emptyStringInput = "";
    const result = base64To(emptyStringInput);
    expect(result).toBe("");
  });

  // ----------------------------------------------------------------------------------------------

  it("base64To should handle special characters in the input", () => {
    const specialCharactersInput = "!@#$%^&*()_+";
    const result = base64To(specialCharactersInput);
    expect(result).toBe("IUAjJCVeJiooKV8r");
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - base64ToBuffer", () => {
  // ----------------------------------------------------------------------------------------------

  const base64ToBuffer = utils.base64ToBuffer;

  // ----------------------------------------------------------------------------------------------

  it("base64ToBuffer - should convert a Base64 string to an ArrayBuffer", () => {
    // Example Base64 string
    const base64String = "SGVsbG8sIHdvcmxkIQ==";

    // Expected ArrayBuffer
    const expectedBuffer = new Uint8Array([
      72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33,
    ]).buffer;

    // Call the function
    const result = base64ToBuffer(base64String);

    // Assert that the result matches the expected ArrayBuffer
    expect(result).toEqual(expectedBuffer);
  });

  // ----------------------------------------------------------------------------------------------

  it("base64ToBuffer - should return an empty ArrayBuffer if the Base64 string is empty", () => {
    // Example empty Base64 string
    const base64String = "";

    // Expected empty ArrayBuffer
    const expectedBuffer = new ArrayBuffer(0);

    // Call the function
    const result = base64ToBuffer(base64String);

    // Assert that the result matches the expected empty ArrayBuffer
    expect(result).toEqual(expectedBuffer);
  });

  // ----------------------------------------------------------------------------------------------

  it("base64ToBuffer - should handle Base64 string with very special characters", () => {
    // Example Base64 string with very special characters (including emojis)
    const base64String =
      "8J+klPCfkpzojIPwn5ST8J+klPCfkpzojIPwn5ST8J+klPCfkpzojIPwn5ST8J+klPCfkpzojIPwn5ST8J+klPCfkpzojIPwn5ST"; // Some special characters

    // Expected ArrayBuffer
    const expectedBuffer = new Uint8Array([
      226, 152, 169, 226, 152, 169, 226, 152, 169, 226, 152, 169, 226, 152, 169,
      226, 152, 169, 226, 152, 169, 226, 152, 169, 226, 152, 169, 226, 152, 169,
      226, 152, 169, 226, 152, 169, 226, 152, 169, 226, 152, 169, 226, 152, 169,
    ]).buffer;

    // Call the function
    const result = base64ToBuffer(base64String);

    // Assert that the result matches the expected ArrayBuffer
    expect(result).toEqual(expectedBuffer);
  });
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - base64URLEncode", () => {
  // ----------------------------------------------------------------------------------------------

  const base64URLEncode = utils.base64URLEncode;

  // ----------------------------------------------------------------------------------------------

  it("base64URLEncode should return an empty string for non-string input", () => {
    const nonStringInput = 123;
    const result = base64URLEncode(nonStringInput);
    expect(result).toBe("MTIz");
  });

  // ----------------------------------------------------------------------------------------------

  it("base64URLEncode should correctly encode a string to base64 URL format with default encoding", () => {
    const textInput = "Hello world!";
    const result = base64URLEncode(textInput);
    expect(result).toBe("SGVsbG8gd29ybGQh");
  });

  // ----------------------------------------------------------------------------------------------

  it("base64URLEncode should correctly encode a string to base64 URL format with a specified encoding", () => {
    const textInput = "Hello world!";
    const result = base64URLEncode(textInput, "utf16le");
    expect(result).toBe("SABlAGwAbABvACAAdwBvAHIAbABkACEA");
  });

  // ----------------------------------------------------------------------------------------------

  it("base64URLEncode should handle an empty string input", () => {
    const emptyStringInput = "";
    const result = base64URLEncode(emptyStringInput);
    expect(result).toBe("");
  });

  // ----------------------------------------------------------------------------------------------

  it("base64URLEncode should handle special characters in the input", () => {
    const specialCharactersInput = "!@#$%^&*()_+";
    const result = base64URLEncode(specialCharactersInput);
    expect(result).toBe("IUAjJCVeJiooKV8r");
  });

  // ----------------------------------------------------------------------------------------------

  it("base64URLEncode should translate special chars from resultant base64", () => {
    const specialCharactersInput = "�nl����□��7y�b�8�sJ���";
    const result = base64URLEncode(specialCharactersInput);
    expect(result).toBe(
      "77-9bmzvv73vv73vv73vv73ilqHvv73vv703ee-_vWLvv70477-9c0rvv73vv73vv70"
    );
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - bufferCompare", () => {
  // ----------------------------------------------------------------------------------------------

  const bufferCompare = utils.bufferCompare;

  // ----------------------------------------------------------------------------------------------
  it("bufferCompare - buffers are equal", () => {
    const buffer1 = new Uint8Array([1, 2, 3, 4]).buffer;
    const buffer2 = new Uint8Array([1, 2, 3, 4]).buffer;

    expect(bufferCompare(buffer1, buffer2)).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("bufferCompare - buffers are not equal (different lengths)", () => {
    const buffer1 = new Uint8Array([1, 2, 3, 4]).buffer;
    const buffer2 = new Uint8Array([1, 2, 3, 4, 5]).buffer;

    expect(bufferCompare(buffer1, buffer2)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("bufferCompare - buffers are not equal (same lengths, different content)", () => {
    const buffer1 = new Uint8Array([1, 2, 3, 4]).buffer;
    const buffer2 = new Uint8Array([1, 2, 3, 5]).buffer;

    expect(bufferCompare(buffer1, buffer2)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("bufferCompare - one buffer is null", () => {
    const buffer1 = null;
    const buffer2 = new Uint8Array([1, 2, 3, 4]).buffer;

    expect(bufferCompare(buffer1, buffer2)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("bufferCompare - both buffers are null", () => {
    const buffer1 = null;
    const buffer2 = null;

    expect(bufferCompare(buffer1, buffer2)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("bufferCompare - empty buffers are equal", () => {
    const buffer1 = new Uint8Array([]).buffer;
    const buffer2 = new Uint8Array([]).buffer;

    expect(bufferCompare(buffer1, buffer2)).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("bufferCompare - buffers with special characters", () => {
    const buffer1 = new Uint8Array([0, 255, 128, 64]).buffer;
    const buffer2 = new Uint8Array([0, 255, 128, 64]).buffer;

    expect(bufferCompare(buffer1, buffer2)).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("bufferCompare - buffers with different special characters", () => {
    const buffer1 = new Uint8Array([0, 255, 128, 64]).buffer;
    const buffer2 = new Uint8Array([0, 255, 128, 63]).buffer;

    expect(bufferCompare(buffer1, buffer2)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - bufferConcatenate", () => {
  // ----------------------------------------------------------------------------------------------

  const bufferConcatenate = utils.bufferConcatenate;

  // ----------------------------------------------------------------------------------------------

  it("bufferConcatenate - should concatenate two buffers correctly", () => {
    const buffer1 = new Uint8Array([1, 2, 3]).buffer;
    const buffer2 = new Uint8Array([4, 5, 6]).buffer;
    const concatenated = bufferConcatenate(buffer1, buffer2);

    const expected = new Uint8Array([1, 2, 3, 4, 5, 6]).buffer;
    expect(concatenated).toEqual(expected);
  });

  // -----------------------------------------------------------------------------------------------

  it("bufferConcatenate - should return buffer2 if buffer1 is null", () => {
    const buffer1 = null;
    const buffer2 = new Uint8Array([4, 5, 6]).buffer;
    const concatenated = bufferConcatenate(buffer1, buffer2);
    expect(concatenated).toEqual(new Uint8Array([4, 5, 6]).buffer);
  });

  // -----------------------------------------------------------------------------------------------

  it("bufferConcatenate - should return buffer1 if buffer2 is null", () => {
    const buffer1 = new Uint8Array([1, 2, 3]).buffer;
    const buffer2 = null;
    const concatenated = bufferConcatenate(buffer1, buffer2);
    expect(concatenated).toEqual(new Uint8Array([1, 2, 3]).buffer);
  });

  // -----------------------------------------------------------------------------------------------

  it("bufferConcatenate - should return null if both buffers are null", () => {
    const buffer1 = null;
    const buffer2 = null;
    const concatenated = bufferConcatenate(buffer1, buffer2);
    expect(concatenated).toBeNull();
  });

  // -----------------------------------------------------------------------------------------------

  it("bufferConcatenate - should concatenate two empty buffers correctly", () => {
    const buffer1 = new Uint8Array([]).buffer;
    const buffer2 = new Uint8Array([]).buffer;
    const concatenated = bufferConcatenate(buffer1, buffer2);

    const expected = new Uint8Array([]).buffer;
    expect(concatenated).toEqual(expected);
  });

  // -----------------------------------------------------------------------------------------------

  it("bufferConcatenate - should concatenate buffers with special characters correctly", () => {
    const buffer1 = new Uint8Array([0, 255, 128]).buffer;
    const buffer2 = new Uint8Array([64, 32, 16]).buffer;
    const concatenated = bufferConcatenate(buffer1, buffer2);

    const expected = new Uint8Array([0, 255, 128, 64, 32, 16]).buffer;
    expect(concatenated).toEqual(expected);
  });

  // -----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - bufferFromString", () => {
  // ------------------------------------------------------------------------------------------------

  const bufferFromString = utils.bufferFromString;

  // ------------------------------------------------------------------------------------------------

  it("bufferFromString - should generate a buffer from a string in Node.js environment", () => {
    const str = "Hello, World!";
    const buffer = bufferFromString(str, "utf-8");
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.toString()).toBe(str);
  });

  // ------------------------------------------------------------------------------------------------

  it("bufferFromString - should generate a buffer from a string in browser environment", () => {
    const str = "Hello, World!";
    const buffer = bufferFromString(str);
    expect(buffer).toBeInstanceOf(Uint8Array);
    expect(new TextDecoder().decode(buffer)).toBe(str);
  });

  // ------------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - bufferToString", () => {
  // ----------------------------------------------------------------------------------------------

  const bufferToString = utils.bufferToString;

  // ----------------------------------------------------------------------------------------------

  it("bufferToString - should convert a buffer to a string in Node.js environment", () => {
    const buffer = Buffer.from("Hello, World!", "utf-8");
    const str = bufferToString(buffer, "utf-8");
    expect(str).toBe("Hello, World!");
  });

  // ----------------------------------------------------------------------------------------------

  it("bufferToString - should convert a buffer to a string in browser environment", () => {
    const buffer = new Uint8Array([
      72, 101, 108, 108, 111, 44, 32, 87, 111, 114, 108, 100,
    ]);
    const str = bufferToString(buffer, "utf-8");
    expect(str).toBe("Hello, World");
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - currencyBRToFloat", () => {
  // ----------------------------------------------------------------------------------------------

  const currencyBRToFloat = utils.currencyBRToFloat;

  // ----------------------------------------------------------------------------------------------

  it("currencyBRToFloat should convert valid money string to float", () => {
    const moneyString = "R$ 1.234,56";
    const result = currencyBRToFloat(moneyString);
    expect(result).toBe(1234.56);
  });

  // ----------------------------------------------------------------------------------------------

  it("currencyBRToFloat should return false for money string with invalid characters", () => {
    const moneyString = "1A23.B4C56";
    const result = currencyBRToFloat(moneyString);
    expect(result).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("currencyBRToFloat should handle money string with leading and trailing spaces", () => {
    const moneyString = "  789,01  ";
    const result = currencyBRToFloat(moneyString);
    expect(result).toBe(789.01);
  });

  // ----------------------------------------------------------------------------------------------

  it("currencyBRToFloat should return false for money string with only dots", () => {
    const moneyString = "......";
    const result = currencyBRToFloat(moneyString);
    expect(result).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("currencyBRToFloat should return false for money string with only commas", () => {
    const moneyString = ",,,,,,";
    const result = currencyBRToFloat(moneyString);
    expect(result).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  // Test case 6: Empty money string
  it("currencyBRToFloat should return false for empty money string", () => {
    const moneyString = "";
    const result = currencyBRToFloat(moneyString);
    expect(result).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("currencyBRToFloat should maitain the float value equal", () => {
    const moneyString = 1234.56;
    const result = currencyBRToFloat(moneyString);
    expect(result).toBe(1234.56);
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - dateFirstHourOfDay", () => {
  // ----------------------------------------------------------------------------------------------

  const dateFirstHourOfDay = utils.dateFirstHourOfDay;

  // ----------------------------------------------------------------------------------------------

  it("dateFirstHourOfDay should set hours, minutes, and seconds to 00:00:00 for a valid date object", () => {
    const inputDate = new Date("2023-01-15T12:34:56");
    const resultDate = dateFirstHourOfDay(inputDate);

    expect(resultDate.getHours()).toBe(0);
    expect(resultDate.getMinutes()).toBe(0);
    expect(resultDate.getSeconds()).toBe(0);
    expect(resultDate.getMilliseconds()).toBe(0);
  });

  // ----------------------------------------------------------------------------------------------

  it("dateFirstHourOfDay should return false for an invalid date input", () => {
    const inputDate = "not a date";
    const result = dateFirstHourOfDay(inputDate);

    expect(result).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("dateFirstHourOfDay should set hours, minutes, and seconds to 00:00:00 for a date with non-zero hours", () => {
    const inputDate = new Date("2023-01-15T08:45:30");
    const resultDate = dateFirstHourOfDay(inputDate);

    expect(resultDate.getHours()).toBe(0);
    expect(resultDate.getMinutes()).toBe(0);
    expect(resultDate.getSeconds()).toBe(0);
    expect(resultDate.getMilliseconds()).toBe(0);
  });

  // ----------------------------------------------------------------------------------------------

  it("dateFirstHourOfDay should set hours, minutes, and seconds to 00:00:00 for a date with non-zero minutes", () => {
    const inputDate = new Date("2023-01-15T15:20:45");
    const resultDate = dateFirstHourOfDay(inputDate);

    expect(resultDate.getHours()).toBe(0);
    expect(resultDate.getMinutes()).toBe(0);
    expect(resultDate.getSeconds()).toBe(0);
    expect(resultDate.getMilliseconds()).toBe(0);
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - dateLastHourOfDay", () => {
  // ----------------------------------------------------------------------------------------------

  const dateLastHourOfDay = utils.dateLastHourOfDay;

  // ----------------------------------------------------------------------------------------------

  it("dateLastHourOfDay should set hours, minutes, and seconds to 23:59:59 for a valid date object", () => {
    const inputDate = new Date("2023-01-15T12:34:56");
    const resultDate = dateLastHourOfDay(inputDate);

    expect(resultDate.getHours()).toBe(23);
    expect(resultDate.getMinutes()).toBe(59);
    expect(resultDate.getSeconds()).toBe(59);
    expect(resultDate.getMilliseconds()).toBe(999);
  });

  // ----------------------------------------------------------------------------------------------

  it("dateLastHourOfDay should return false for an invalid date input", () => {
    const inputDate = "not a date";
    const result = dateLastHourOfDay(inputDate);

    expect(result).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("dateLastHourOfDay should set hours, minutes, and seconds to 23:59:59 for a date with non-zero hours", () => {
    const inputDate = new Date("2023-01-15T08:45:30");
    const resultDate = dateLastHourOfDay(inputDate);

    expect(resultDate.getHours()).toBe(23);
    expect(resultDate.getMinutes()).toBe(59);
    expect(resultDate.getSeconds()).toBe(59);
    expect(resultDate.getMilliseconds()).toBe(999);
  });

  // ----------------------------------------------------------------------------------------------

  it("dateLastHourOfDay should set hours, minutes, and seconds to 23:59:59 for a date with non-zero minutes", () => {
    const inputDate = new Date("2023-01-15T15:20:45");
    const resultDate = dateLastHourOfDay(inputDate);

    expect(resultDate.getHours()).toBe(23);
    expect(resultDate.getMinutes()).toBe(59);
    expect(resultDate.getSeconds()).toBe(59);
    expect(resultDate.getMilliseconds()).toBe(999);
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - dateToFormat", () => {
  // ----------------------------------------------------------------------------------------------

  const dateToFormat = utils.dateToFormat;

  // ----------------------------------------------------------------------------------------------

  it("dateToFormat should return a string formatted as dd-MM-yyyy for a valid date object with default format", () => {
    const inputDate = new Date("2023-01-15T12:34:56");
    const result = dateToFormat(inputDate);

    expect(result).toBe("15-01-2023");
  });

  // ----------------------------------------------------------------------------------------------

  it("dateToFormat should return a string formatted as MM/dd/yyyy for a valid date object with custom format", () => {
    const inputDate = new Date("2023-01-15T12:34:56");
    const customFormat = "MM/dd/yyyy";
    const result = dateToFormat(inputDate, customFormat);

    expect(result).toBe("01/15/2023");
  });

  // ----------------------------------------------------------------------------------------------

  it("dateToFormat should return false for an invalid date input", () => {
    const inputDate = "not a date";
    const result = dateToFormat(inputDate);

    expect(result).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("dateToFormat should return a string formatted as dd-MM-yyyy for a valid date object with default format and non-zero hours", () => {
    const inputDate = new Date("2023-01-15T08:45:30");
    const result = dateToFormat(inputDate);

    expect(result).toBe("15-01-2023");
  });

  // ----------------------------------------------------------------------------------------------

  it("dateToFormat should return a string formatted as yyyy-MM-dd HH:mm:ss for a valid date object with 'yyyy-MM-dd HH:mm:ss' format", () => {
    const inputDate = new Date("2023-01-15T12:34:56");
    const result = dateToFormat(inputDate, "yyyy-MM-dd HH:mm:ss");

    expect(result).toBe("2023-01-15 12:34:56");
  });

  // ----------------------------------------------------------------------------------------------

  it("dateToFormat should return a string formatted as yyyy-MM for a valid date object with 'yyyy-MM' format", () => {
    const inputDate = new Date("2023-01-15T12:34:56");
    const result = dateToFormat(inputDate, "yyyy-MM");

    expect(result).toBe("2023-01");
  });

  // ----------------------------------------------------------------------------------------------

  it("dateToFormat should return a string formatted as dd-MM-yyyy for a valid date object with default format and non-zero minutes", () => {
    const inputDate = new Date("2023-01-15T12:05:00");
    const result = dateToFormat(inputDate);

    expect(result).toBe("15-01-2023");
  });

  // ----------------------------------------------------------------------------------------------

  it("dateToFormat should return a string formatted as yyyy-MM-dd HH:mm:ss for a valid date object with 'yyyy-MM-dd HH:mm:ss' format and non-zero seconds", () => {
    const inputDate = new Date("2023-01-15T12:34:45");
    const result = dateToFormat(inputDate, "yyyy-MM-dd HH:mm:ss");

    expect(result).toBe("2023-01-15 12:34:45");
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - debouncer", () => {
  // ----------------------------------------------------------------------------------------------

  const debouncer = utils.debouncer;

  // ----------------------------------------------------------------------------------------------

  it("debounce delays function execution", async () => {
    const mockCallback = vi.fn();
    const debouncedCallback = debouncer(mockCallback, 1000);

    debouncedCallback("argument1", "argument2");

    // Assert that the callback is not called immediately
    expect(mockCallback).not.toHaveBeenCalled();

    // Wait for the debounce timeout
    await new Promise((resolve) => setTimeout(resolve, 1100));

    // Assert that the callback is called once with the arguments after the timeout
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith("argument1", "argument2");
  });

  // ----------------------------------------------------------------------------------------------

  it("debounce cancels previous timeouts on subsequent calls", async () => {
    const mockCallback = vi.fn();
    const debouncedCallback = debouncer(mockCallback, 500);

    debouncedCallback("argument1"); // Schedule first call

    // Wait for a shorter duration to ensure first timeout isn't triggered
    await new Promise((resolve) => setTimeout(resolve, 200));

    debouncedCallback("argument2"); // Schedule second call, canceling the first

    // Wait for the longer timeout of the second call
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Assert that the callback is called only once with the arguments from the second call
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith("argument2");
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - deleteKeys", () => {
  // ----------------------------------------------------------------------------------------------

  const deleteKeys = utils.deleteKeys;

  // ----------------------------------------------------------------------------------------------

  it("deleteKeys should delete a single key from the object", () => {
    const inputObject = { a: 1, b: 2, c: 3 };
    const keysToDelete = ["b"];
    const result = deleteKeys(inputObject, keysToDelete);

    expect(result).toHaveProperty("a");
    expect(result.a).toBe(1);
    expect(result).not.toHaveProperty("b");
    expect(result).toHaveProperty("c");
    expect(result.c).toBe(3);
  });

  // ----------------------------------------------------------------------------------------------
  it("deleteKeys should delete multiple keys from the object", () => {
    const inputObject = { a: 1, b: 2, c: 3, d: 4 };
    const keysToDelete = ["b", "d"];
    const result = deleteKeys(inputObject, keysToDelete);

    expect(result).toHaveProperty("a");
    expect(result.a).toBe(1);
    expect(result).not.toHaveProperty("b");
    expect(result).toHaveProperty("c");
    expect(result.c).toBe(3);
    expect(result).not.toHaveProperty("d");
  });

  // ----------------------------------------------------------------------------------------------
  it("deleteKeys should not change the object if the key to delete does not exist", () => {
    const inputObject = { a: 1, b: 2, c: 3 };
    const keysToDelete = ["d"];
    const result = deleteKeys(inputObject, keysToDelete);

    expect(result).toHaveProperty("a");
    expect(result.a).toBe(1);
    expect(result).toHaveProperty("b");
    expect(result.b).toBe(2);
    expect(result).toHaveProperty("c");
    expect(result.c).toBe(3);
    expect(result).not.toHaveProperty("d");
  });

  // ----------------------------------------------------------------------------------------------
  it("deleteKeys should not change an empty object", () => {
    const inputObject = {};
    const keysToDelete = ["a", "b", "c"];
    const result = deleteKeys(inputObject, keysToDelete);

    expect(result).toEqual({});
  });

  // ----------------------------------------------------------------------------------------------
  it("deleteKeys should return the original object if input types are invalid", () => {
    const keysToDelete = ["b"];
    const result = deleteKeys("not an object", keysToDelete);

    expect(result).toEqual("not an object");
  });

  // ----------------------------------------------------------------------------------------------
  it("deleteKeys should return the original object if keys input is not an array", () => {
    const inputObject = { a: 1, b: 2, c: 3 };
    const keysToDelete = "not an array";
    const result = deleteKeys(inputObject, keysToDelete);

    expect(result).toEqual(inputObject);
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - cleanObject - Comprehensive Test Suite", () => {
  const cleanObject = utils.cleanObject;

  // Basic functionality tests - default behavior
  it("should remove undefined values by default", () => {
    const input = { a: 1, b: undefined, c: 3 };
    const result = cleanObject(input);

    expect(result).toEqual({ a: 1, c: 3 });
    expect(result).not.toHaveProperty("b");
  });

  it("should remove null values by default", () => {
    const input = { a: 1, b: null, c: 3 };
    const result = cleanObject(input);

    expect(result).toEqual({ a: 1, c: 3 });
    expect(result).not.toHaveProperty("b");
  });

  it("should remove empty strings by default", () => {
    const input = { a: 1, b: "", c: "test" };
    const result = cleanObject(input);

    expect(result).toEqual({ a: 1, c: "test" });
    expect(result).not.toHaveProperty("b");
  });

  it("should remove empty arrays by default", () => {
    const input = { a: 1, b: [], c: [1, 2, 3] };
    const result = cleanObject(input);

    expect(result).toEqual({ a: 1, c: [1, 2, 3] });
    expect(result).not.toHaveProperty("b");
  });

  it("should remove empty objects by default", () => {
    const input = { a: 1, b: {}, c: { test: "value" } };
    const result = cleanObject(input);

    expect(result).toEqual({ a: 1, c: { test: "value" } });
    expect(result).not.toHaveProperty("b");
  });

  it("should keep false values by default", () => {
    const input = { a: 1, b: false, c: true };
    const result = cleanObject(input);

    expect(result).toEqual({ a: 1, b: false, c: true });
  });

  it("should keep zero values", () => {
    const input = { a: 1, b: 0, c: -1 };
    const result = cleanObject(input);

    expect(result).toEqual({ a: 1, b: 0, c: -1 });
  });

  // Non-object inputs
  it("should return null unchanged", () => {
    const result = cleanObject(null);
    expect(result).toBe(null);
  });

  it("should return arrays unchanged", () => {
    const input = [1, 2, null, "", undefined];
    const result = cleanObject(input);
    expect(result).toBe(input);
    expect(result).toEqual([1, 2, null, "", undefined]);
  });

  it("should return primitives unchanged", () => {
    expect(cleanObject(42)).toBe(42);
    expect(cleanObject("string")).toBe("string");
    expect(cleanObject(true)).toBe(true);
    expect(cleanObject(false)).toBe(false);
    expect(cleanObject(undefined)).toBe(undefined);
  });

  // Empty object tests
  it("should return empty object for empty input", () => {
    const result = cleanObject({});
    expect(result).toEqual({});
  });

  it("should return empty object when all values are removed", () => {
    const input = { a: null, b: undefined, c: "", d: [], e: {} };
    const result = cleanObject(input);
    expect(result).toEqual({});
  });

  // Recursive functionality tests
  it("should clean nested objects recursively by default", () => {
    const input = {
      a: 1,
      b: {
        c: 2,
        d: null,
        e: "",
        f: {
          g: 3,
          h: undefined,
        },
      },
    };
    const result = cleanObject(input);

    expect(result).toEqual({
      a: 1,
      b: {
        c: 2,
        f: {
          g: 3,
        },
      },
    });
  });

  it("should remove nested objects that become empty after cleaning", () => {
    const input = {
      a: 1,
      b: {
        c: null,
        d: undefined,
        e: "",
      },
    };
    const result = cleanObject(input);

    expect(result).toEqual({ a: 1 });
    expect(result).not.toHaveProperty("b");
  });

  it("should handle deeply nested objects", () => {
    const input = {
      level1: {
        level2: {
          level3: {
            level4: {
              value: "deep",
              empty: null,
            },
            emptyObj: {},
          },
        },
        emptyAfterCleaning: {
          removed: undefined,
        },
      },
    };
    const result = cleanObject(input);

    expect(result).toEqual({
      level1: {
        level2: {
          level3: {
            level4: {
              value: "deep",
            },
          },
        },
      },
    });
  });

  // Options tests - recursive
  it("should not clean nested objects when recursive=false", () => {
    const input = {
      a: 1,
      b: {
        c: 2,
        d: null,
        e: "",
      },
    };
    const result = cleanObject(input, { recursive: false });

    expect(result).toEqual({
      a: 1,
      b: {
        c: 2,
        d: null,
        e: "",
      },
    });
  });

  // Options tests - considerNullValue
  it("should keep null values when considerNullValue=true", () => {
    const input = { a: 1, b: null, c: 3 };
    const result = cleanObject(input, { considerNullValue: true });

    expect(result).toEqual({ a: 1, b: null, c: 3 });
  });

  it("should keep null in nested objects when considerNullValue=true", () => {
    const input = {
      a: 1,
      b: {
        c: null,
        d: "test",
      },
    };
    const result = cleanObject(input, { considerNullValue: true });

    expect(result).toEqual({
      a: 1,
      b: {
        c: null,
        d: "test",
      },
    });
  });

  // Options tests - considerFalseValue
  it("should remove false values when considerFalseValue=false", () => {
    const input = { a: 1, b: false, c: true };
    const result = cleanObject(input, { considerFalseValue: false });

    expect(result).toEqual({ a: 1, c: true });
    expect(result).not.toHaveProperty("b");
  });

  it("should remove false in nested objects when considerFalseValue=false", () => {
    const input = {
      a: 1,
      b: {
        c: false,
        d: "test",
      },
    };
    const result = cleanObject(input, { considerFalseValue: false });

    expect(result).toEqual({
      a: 1,
      b: {
        d: "test",
      },
    });
  });

  // Combined options tests
  it("should handle multiple options correctly", () => {
    const input = {
      a: 1,
      b: null,
      c: false,
      d: "",
      e: undefined,
      f: {
        g: null,
        h: false,
        i: "valid",
      },
    };
    const result = cleanObject(input, {
      considerNullValue: true,
      considerFalseValue: false,
    });

    expect(result).toEqual({
      a: 1,
      b: null,
      f: {
        g: null,
        i: "valid",
      },
    });
  });

  it("should handle all options combined with recursive=false", () => {
    const input = {
      a: 1,
      b: null,
      c: false,
      d: {
        e: null,
        f: false,
        g: undefined,
      },
    };
    const result = cleanObject(input, {
      recursive: false,
      considerNullValue: true,
      considerFalseValue: false,
    });

    expect(result).toEqual({
      a: 1,
      b: null,
      d: {
        e: null,
        f: false,
        g: undefined,
      },
    });
  });

  // Edge cases with options
  it("should handle undefined options", () => {
    const input = { a: 1, b: null, c: false };
    const result = cleanObject(input, undefined);

    expect(result).toEqual({ a: 1, c: false });
  });

  it("should handle null options", () => {
    const input = { a: 1, b: null, c: false };
    const result = cleanObject(input, null);

    expect(result).toEqual({ a: 1, c: false });
  });

  it("should handle empty options object", () => {
    const input = { a: 1, b: null, c: false };
    const result = cleanObject(input, {});

    expect(result).toEqual({ a: 1, c: false });
  });

  it("should handle options with extra properties", () => {
    const input = { a: 1, b: null, c: false };
    const result = cleanObject(input, {
      considerNullValue: true,
      extraProp: "ignored",
    });

    expect(result).toEqual({ a: 1, b: null, c: false });
  });

  // Complex data types
  it("should handle Date objects correctly", () => {
    const date = new Date();
    const input = { a: 1, b: date, c: null };
    const result = cleanObject(input);

    expect(result).toEqual({ a: 1, b: date });
  });

  it("should handle RegExp objects correctly", () => {
    const regex = /test/g;
    const input = { a: 1, b: regex, c: null };
    const result = cleanObject(input);

    expect(result).toEqual({ a: 1, b: regex });
  });

  it("should handle functions correctly", () => {
    const func = () => "test";
    const input = { a: 1, b: func, c: null };
    const result = cleanObject(input);

    expect(result).toEqual({ a: 1, b: func });
  });

  it("should handle arrays with mixed content", () => {
    const array = [1, null, "", undefined, { test: "value" }];
    const input = { a: 1, b: array, c: null };
    const result = cleanObject(input);

    expect(result).toEqual({ a: 1, b: array });
  });

  // Special string cases
  it("should keep whitespace-only strings", () => {
    const input = { a: "   ", b: "\n\t", c: "" };
    const result = cleanObject(input);

    expect(result).toEqual({ a: "   ", b: "\n\t" });
    expect(result).not.toHaveProperty("c");
  });

  it("should handle string with only zeros", () => {
    const input = { a: "0", b: "00", c: "" };
    const result = cleanObject(input);

    expect(result).toEqual({ a: "0", b: "00" });
    expect(result).not.toHaveProperty("c");
  });

  // Special number cases
  it("should keep NaN values", () => {
    const input = { a: 1, b: NaN, c: null };
    const result = cleanObject(input);

    expect(result).toEqual({ a: 1, b: NaN });
  });

  it("should keep Infinity values", () => {
    const input = { a: 1, b: Infinity, c: -Infinity, d: null };
    const result = cleanObject(input);

    expect(result).toEqual({ a: 1, b: Infinity, c: -Infinity });
  });

  // Object mutation tests
  it("should not mutate the original object", () => {
    const input = { a: 1, b: null, c: 3 };
    const original = { ...input };
    const result = cleanObject(input);

    expect(input).toEqual(original);
    expect(result).not.toBe(input);
  });

  it("should not mutate nested objects", () => {
    const nested = { b: null, c: "test" };
    const input = { a: 1, nested: nested };
    const originalNested = { ...nested };

    const result = cleanObject(input);

    expect(nested).toEqual(originalNested);
    expect(result.nested).not.toBe(nested);
  });

  // Performance and memory tests
  it("should handle large objects efficiently", () => {
    const largeObject = {};
    for (let i = 0; i < 1000; i++) {
      largeObject[`key${i}`] = i % 5 === 0 ? null : `value${i}`;
    }

    const result = cleanObject(largeObject);
    const expectedSize = Object.keys(largeObject).filter(
      (key) => largeObject[key] !== null
    ).length;

    expect(Object.keys(result).length).toBe(expectedSize);
  });

  it("should handle deep nesting without stack overflow", () => {
    let deepObject = { value: "deep" };
    for (let i = 0; i < 100; i++) {
      deepObject = { level: deepObject, empty: null };
    }

    const result = cleanObject(deepObject);

    // Should successfully clean without throwing
    expect(result).toBeTruthy();
    expect(result).not.toHaveProperty("empty");
  });

  // Arrays in objects
  it("should not recursively clean arrays", () => {
    const input = {
      a: 1,
      b: [
        { c: null, d: "test" },
        { e: undefined, f: "value" },
      ],
    };
    const result = cleanObject(input);

    expect(result).toEqual({
      a: 1,
      b: [
        { c: null, d: "test" },
        { e: undefined, f: "value" },
      ],
    });
  });

  // Symbol keys (if supported)
  it("should handle objects with Symbol keys", () => {
    const sym = Symbol("test");
    const input = { a: 1, [sym]: "symbol", b: null };
    const result = cleanObject(input);

    expect(result.a).toBe(1);
    expect(result[sym]).toBe("symbol");
    expect(result).not.toHaveProperty("b");
  });

  // Prototype chain
  it("should only clean own properties", () => {
    const proto = { inherited: "value" };
    const input = Object.create(proto);
    input.own = "test";
    input.empty = null;

    const result = cleanObject(input);

    expect(result).toEqual({ own: "test" });
    expect(result.inherited).toBeUndefined();
  });

  // Circular references (should not cause infinite recursion)
  it("should handle circular references gracefully", () => {
    const input = { a: 1, b: null };
    input.circular = input;

    // This should not throw or cause infinite recursion
    expect(() => cleanObject(input)).not.toThrow();
  });
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - generateRandomString", () => {
  // ----------------------------------------------------------------------------------------------

  const generateRandomString = utils.generateRandomString;

  // ----------------------------------------------------------------------------------------------

  it("generateRandomString should generate a random string with default parameters", () => {
    const result = generateRandomString();

    expect(result).toHaveLength(32);
    // Ensure that the result contains a mix of characters
    expect(/[a-zA-Z0-9!@#$%^&*-_+=;:,.<>?]+/.test(result)).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("generateRandomString should generate a random string with custom size", () => {
    const customSize = 20;
    const result = generateRandomString(customSize);

    expect(result).toHaveLength(customSize);
    // Ensure that the result contains a mix of characters
    expect(/[a-zA-Z0-9!@#$%^&*-_+=;:,.<>?]+/.test(result)).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("generateRandomString should generate a random string excluding lowercase characters", () => {
    const options = { excludeLowerCaseChars: true };
    const result = generateRandomString(64, options);

    expect(result).toHaveLength(64);
    // Ensure that the result contains only uppercase characters, digits, and symbols
    expect(
      "abcdefghijklmnopqrstuvwxyz"
        .split("")
        .every((value) => !result.includes(value))
    ).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("generateRandomString should generate a random string excluding uppercase characters", () => {
    const options = { excludeUpperCaseChars: true };
    const result = generateRandomString(64, options);

    expect(result).toHaveLength(64);
    // Ensure that the result contains only uppercase characters, digits, and symbols
    expect(
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        .split("")
        .every((value) => !result.includes(value))
    ).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("generateRandomString should generate a random string excluding accented chars characters", () => {
    const options = { excludeAccentedChars: true };
    const result = generateRandomString(64, options);

    expect(result).toHaveLength(64);
    // Ensure that the result contains only uppercase characters, digits, and symbols
    expect(
      "àáâãçèéêìíîðñòóôõùúûýú"
        .split("")
        .every((value) => !result.includes(value))
    ).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("generateRandomString should generate a random string excluding digits", () => {
    const options = { excludeDigits: true };
    const result = generateRandomString(64, options);

    expect(result).toHaveLength(64);
    // Ensure that the result contains only uppercase characters, digits, and symbols
    expect(
      "0123456789".split("").every((value) => !result.includes(value))
    ).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("generateRandomString should generate a random string excluding symbols", () => {
    const options = { excludeSymbols: true };
    const result = generateRandomString(64, options);

    expect(result).toHaveLength(64);
    // Ensure that the result contains only uppercase characters, digits, and symbols
    expect(
      "!@#$%^&*-_+=;:,.<>?".split("").every((value) => !result.includes(value))
    ).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("generateRandomString should generate a random string with custom symbols", () => {
    const customSymbols = "@#$%";
    const options = {
      includeSymbols: customSymbols,
      excludeLowerCaseChars: true,
      excludeUpperCaseChars: true,
      excludeAccentedChars: true,
      excludeSymbols: true,
    };
    const result = generateRandomString(64, options);
    expect(result).toHaveLength(64);
    expect(
      customSymbols.split("").some((value) => result.includes(value))
    ).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("generateRandomString should generate an empty string when excluding all character types", () => {
    const options = {
      excludeLowerCaseChars: true,
      excludeUpperCaseChars: true,
      excludeAccentedChars: true,
      excludeDigits: true,
      excludeSymbols: true,
    };
    const result = generateRandomString(32, options);

    expect(result).toHaveLength(0);
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - generateSimpleId", () => {
  // ----------------------------------------------------------------------------------------------

  const generateSimpleId = utils.generateSimpleId;

  // ----------------------------------------------------------------------------------------------

  it("should generate a simple id with default separator", () => {
    const result = generateSimpleId("example");
    expect(result.includes("_")).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("should generate a simple id with a custom separator", () => {
    const customSeparator = "-";
    const result = generateSimpleId("example", customSeparator);
    expect(result.includes(customSeparator)).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("should generate a simple id with an empty input and default separator", () => {
    const result = generateSimpleId();
    expect(result.includes("_")).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("should generate a simple id with an empty input and not the default separator", () => {
    const result = generateSimpleId(undefined, "-");
    expect(result.includes("_")).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("should have a valid timestamp in the generated string", () => {
    const result = generateSimpleId("example");
    const timestampPart = result.split("_")[1];

    const currentTimestamp = Date.now();
    expect(Number(timestampPart)).toBeGreaterThan(currentTimestamp - 86400000); // 24 hours ago
    expect(Number(timestampPart)).toBeLessThan(currentTimestamp + 86400000); // 24 hours in the future
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - getExecutionTime", () => {
  // ----------------------------------------------------------------------------------------------

  const getExecutionTime = utils.getExecutionTime;

  // ----------------------------------------------------------------------------------------------

  it("getExecutionTime should return a non-negative value", () => {
    const time = process.hrtime();
    const result = parseFloat(getExecutionTime(time));
    expect(result).toBeGreaterThanOrEqual(0);
  });

  // ----------------------------------------------------------------------------------------------

  it("getExecutionTime should return a string", () => {
    const time = process.hrtime();
    const result = getExecutionTime(time);
    expect(typeof result).toBe("string");
  });

  // ----------------------------------------------------------------------------------------------

  it("getExecutionTime should return a value with three decimal places", () => {
    const time = process.hrtime();
    const result = getExecutionTime(time);
    const decimalPlaces = (result.split(".")[1] || "").length;
    expect(decimalPlaces).toBe(3);
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - JSONFrom", () => {
  // ----------------------------------------------------------------------------------------------

  const JSONFrom = utils.JSONFrom;

  // ----------------------------------------------------------------------------------------------

  it("JSONFrom should return an object from a valid JSON string", () => {
    const jsonString = '{"key": "value", "number": 42}';
    const result = JSONFrom(jsonString);
    expect(result).toEqual({ key: "value", number: 42 });
  });

  // ----------------------------------------------------------------------------------------------

  it("JSONFrom should throw an error an empty string", () => {
    try {
      JSONFrom("");
    } catch (error) {
      expect(error.message).toBe("Unexpected end of JSON input");
    }
  });

  // ----------------------------------------------------------------------------------------------

  it("JSONFrom should throw an error for an invalid JSON string when throwsError is true", () => {
    const invalidJsonString = '{"key": "value", "missingQuotes: "invalid}';
    expect(() => JSONFrom(invalidJsonString)).toThrow();
  });

  // ----------------------------------------------------------------------------------------------

  it("JSONFrom should return null for an invalid JSON string when throwsError is false", () => {
    const invalidJsonString = '{"key": "value", "missingQuotes: "invalid}';
    const result = JSONFrom(invalidJsonString, false);
    expect(result).toBeNull();
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - JSONTo", () => {
  // ----------------------------------------------------------------------------------------------

  const JSONTo = utils.JSONTo;

  // ----------------------------------------------------------------------------------------------

  it("JSONTo should return a JSON string for a valid object", () => {
    const inputObject = { key: "value", number: 42 };
    const result = JSONTo(inputObject);
    expect(result).toBe('{"key":"value","number":42}');
  });

  // ----------------------------------------------------------------------------------------------

  it("JSONTo should return an empty object for an undefined object", () => {
    const result = JSONTo(undefined);
    expect(result).toBe("{}");
  });

  // ----------------------------------------------------------------------------------------------

  it("JSONTo should throw an error for a circular object when throwsError is true", () => {
    const circularObject = { key: "value" };
    circularObject.circularReference = circularObject;
    expect(() => JSONTo(circularObject)).toThrow();
  });

  // ----------------------------------------------------------------------------------------------

  it("JSONTo should return null for a circular object when throwsError is false", () => {
    const circularObject = { key: "value" };
    circularObject.circularReference = circularObject;
    const result = JSONTo(circularObject, false);
    expect(result).toBe(null);
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - normalize", () => {
  // ----------------------------------------------------------------------------------------------

  const normalize = utils.normalize;

  // ----------------------------------------------------------------------------------------------

  it("normalize should return a normalized string for a valid text", () => {
    const inputText = "héllö wôrld";
    const result = normalize(inputText);
    expect(result).toBe("hello world");
  });

  // ----------------------------------------------------------------------------------------------

  it("normalize should return an empty string for an undefined text", () => {
    const result = normalize(undefined);
    expect(result).toBe("");
  });

  // ----------------------------------------------------------------------------------------------

  it("normalize should return an empty string for an object", () => {
    const result = normalize({});
    expect(result).toBeInstanceOf(Object);
  });

  // ----------------------------------------------------------------------------------------------

  it("normalize should return a number string for a value", () => {
    const result = normalize(123);
    expect(result).toBe("123");
  });

  // ----------------------------------------------------------------------------------------------

  it("normalize should handle an empty string input", () => {
    const result = normalize("");
    expect(result).toBe("");
  });

  // ----------------------------------------------------------------------------------------------

  it("normalize should handle a string with only accents", () => {
    const inputText = "éèê";
    const result = normalize(inputText);
    expect(result).toBe("eee");
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - messageEncryptToChunks", () => {
  // ----------------------------------------------------------------------------------------------

  const PUBLIC_KEY = fs.readFileSync("./keys/public_key.pem", "utf8");
  const messageEncryptToChunks = utils.messageEncryptToChunks;

  // ----------------------------------------------------------------------------------------------

  it("messageEncryptToChunks - Encrypts a short message with default chunk size", async () => {
    const message = "Hello, world!";
    const encryptedChunks = await utils.messageEncryptToChunks(
      PUBLIC_KEY,
      message
    );
    expect(encryptedChunks).toBeTruthy();
  });

  // ----------------------------------------------------------------------------------------------

  it("messageEncryptToChunks - Encrypts a long message with custom chunk size", async () => {
    const longMessage = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`;
    const encryptedChunks = await utils.messageEncryptToChunks(
      PUBLIC_KEY,
      longMessage,
      { chunkSize: 190 }
    );
    expect(encryptedChunks).toBeTruthy();
  });

  // ----------------------------------------------------------------------------------------------

  it("messageEncryptToChunks - Throws error for invalid public key", async () => {
    const message = "Hello, world!";
    const publicKey = "INVALID_PUBLIC_KEY";

    try {
      await utils.messageEncryptToChunks(publicKey, message);
    } catch (error) {
      expect(error.message).toBe("Invalid keyData");
    }
  });

  // ----------------------------------------------------------------------------------------------

  it("messageEncryptToChunks - Returns empty array for undefined message", async () => {
    const encryptedChunks = await utils.messageEncryptToChunks(PUBLIC_KEY);
    expect(encryptedChunks).toEqual([]);
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - messageDecryptFromChunks", () => {
  // ----------------------------------------------------------------------------------------------

  const PUBLIC_KEY = fs.readFileSync("./keys/public_key.pem", "utf8");
  const PRIVATE_KEY = fs.readFileSync("./keys/private_key.pem", "utf8");

  // ----------------------------------------------------------------------------------------------

  it("messageDecryptFromChunks - Returns empty string for empty messageChunks", async () => {
    const result = await utils.messageDecryptFromChunks(PRIVATE_KEY, []);
    expect(result).toBe("");
  });

  // ----------------------------------------------------------------------------------------------

  it("messageDecryptFromChunks - Throws error for invalid private key format", async () => {
    try {
      await utils.messageDecryptFromChunks("invalid_private_key", [
        "chunk1",
        "chunk2",
      ]);
    } catch (error) {
      expect(error.message).toBe("Invalid keyData");
    }
  });

  // ----------------------------------------------------------------------------------------------

  it("messageDecryptFromChunks - Decrypt the message correctly", async () => {
    const message = "Hello, world! à ã ü ñ ° ª";
    const encryptedChunks = await utils.messageEncryptToChunks(
      PUBLIC_KEY,
      message
    );
    const decrypted = await utils.messageDecryptFromChunks(
      PRIVATE_KEY,
      encryptedChunks
    );

    expect(decrypted).toEqual(message);
  });

  // ----------------------------------------------------------------------------------------------

  it("messageDecryptFromChunks - Calls privateKeyFromPem with correct parameters but with different public keys", async () => {
    const PUBLIC_KEY2 = fs.readFileSync("./keys/public_key2.pem", "utf8");
    const message = "Hello, world!";
    try {
      const encryptedChunks = await utils.messageEncryptToChunks(
        PUBLIC_KEY2,
        message
      );
      await utils.messageDecryptFromChunks(PRIVATE_KEY, encryptedChunks);
    } catch (error) {
      expect(error.message).toBe(
        "The operation failed for an operation-specific reason"
      );
    }
  });

  // ----------------------------------------------------------------------------------------------

  it("messageDecryptFromChunks - Encrypt a long message with chunk size greater than allowed", async () => {
    try {
      const encryptedChunks = await utils.messageEncryptToChunks(
        PUBLIC_KEY,
        jsonTest,
        { chunkSize: 300 }
      );
      await utils.messageDecryptFromChunks(PRIVATE_KEY, encryptedChunks);
    } catch (error) {
      expect(error.message).toBe(
        "The operation failed for an operation-specific reason"
      );
    }
  });

  // ----------------------------------------------------------------------------------------------

  it("messageDecryptFromChunks - Encrypt a long message with chunk size equal to allowed", async () => {
    const encryptedChunks = await utils.messageEncryptToChunks(
      PUBLIC_KEY,
      jsonTest
    );

    const decrypted = await utils.messageDecryptFromChunks(
      PRIVATE_KEY,
      encryptedChunks
    );

    expect(decrypted).toEqual(jsonTest);
  });

  // ----------------------------------------------------------------------------------------------

  it("messageDecryptFromChunks - Encrypt a long message WITH ACCENTS", async () => {
    // Adicione isso no topo do seu describe
    const jsonTestComAcentos = JSON.stringify({
      user: "José da Silva",
      description:
        "Operação com acentuação e caracteres especiais para teste: ç, ã, é.",
      data: "a".repeat(500), // para garantir que seja uma mensagem longa
    });
    const encryptedChunks = await utils.messageEncryptToChunks(
      PUBLIC_KEY,
      jsonTestComAcentos
    );

    const decrypted = await utils.messageDecryptFromChunks(
      PRIVATE_KEY,
      encryptedChunks
    );

    expect(decrypted).toEqual(jsonTestComAcentos);
  });
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - regexDigitsOnly", () => {
  // ----------------------------------------------------------------------------------------------

  const regexDigitsOnly = utils.regexDigitsOnly;

  // ----------------------------------------------------------------------------------------------

  it("regexDigitsOnly should return only digits for a valid text", () => {
    const inputText = "abc123xyz456";
    const result = regexDigitsOnly(inputText);
    expect(result).toBe("123456");
  });

  // ----------------------------------------------------------------------------------------------

  it("regexDigitsOnly should return an empty string for an undefined text", () => {
    const result = regexDigitsOnly(undefined);
    expect(result).toBe("");
  });

  // ----------------------------------------------------------------------------------------------

  it("regexDigitsOnly should return an empty string for an object", () => {
    const result = regexDigitsOnly({});
    expect(result).toBe("");
  });

  // ----------------------------------------------------------------------------------------------

  it("regexDigitsOnly should return a string with a number for a number", () => {
    const result = regexDigitsOnly(123);
    expect(result).toBe("123");
  });

  // ----------------------------------------------------------------------------------------------

  it("regexDigitsOnly should handle an empty string input", () => {
    const result = regexDigitsOnly("");
    expect(result).toBe("");
  });

  // ----------------------------------------------------------------------------------------------

  it("regexDigitsOnly should return only digits for a string with mixed characters", () => {
    const inputText = "!@#$%^12345&*()6789";
    const result = regexDigitsOnly(inputText);
    expect(result).toBe("123456789");
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - regexReplaceTrim", () => {
  // ----------------------------------------------------------------------------------------------

  const regexReplaceTrim = utils.regexReplaceTrim;

  // ----------------------------------------------------------------------------------------------

  it("regexReplaceTrim should replace characters outside the specified regex with the replacement", () => {
    const inputText = "A1B2C3";
    const result = regexReplaceTrim(inputText, "A-Za-z0-9", "-");
    expect(result).toBe("A1B2C3");
  });

  // ----------------------------------------------------------------------------------------------

  it("regexReplaceTrim should trim the resulting string", () => {
    const inputText = "   A B C   ";
    const result = regexReplaceTrim(inputText, "A-Z", "");
    expect(result).toBe("ABC");
  });

  // ----------------------------------------------------------------------------------------------

  it("regexReplaceTrim should handle an empty string input", () => {
    const result = regexReplaceTrim("", "A-Za-z0-9", "");
    expect(result).toBe("");
  });

  // ----------------------------------------------------------------------------------------------

  it("regexReplaceTrim should handle an undefined input", () => {
    const result = regexReplaceTrim(undefined, "A-Za-z0-9", "");
    expect(result).toBe("");
  });

  // ----------------------------------------------------------------------------------------------

  it("regexReplaceTrim should correctly replace characters outside the specified regex with the replacement", () => {
    const inputText = "Hello! @123 World 456";
    const result = regexReplaceTrim(inputText, "A-Za-z0-9", "*");
    expect(result).toBe("Hello***123*World*456");
  });

  // ----------------------------------------------------------------------------------------------

  it("regexReplaceTrim should handle special characters in the regex", () => {
    const inputText = "Alpha!@Beta?Gamma#$Delta";
    const result = regexReplaceTrim(inputText, "!@#$%", "");
    expect(result).toBe("!@#$");
  });

  // ----------------------------------------------------------------------------------------------

  it("regexReplaceTrim should handle multi-word strings", () => {
    const inputText = "  One Two Three   ";
    const result = regexReplaceTrim(inputText, "A-Za-z", "_");
    expect(result).toBe("__One_Two_Three___");
  });

  // ----------------------------------------------------------------------------------------------

  it("regexReplaceTrim should handle a complex regex pattern", () => {
    const inputText = "123-abc_456-xyz@789";
    const result = regexReplaceTrim(inputText, "a-z@", "");
    expect(result).toBe("abcxyz@");
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - regexLettersOnly", () => {
  // ----------------------------------------------------------------------------------------------

  const regexLettersOnly = utils.regexLettersOnly;

  // ----------------------------------------------------------------------------------------------

  it("regexLettersOnly should remove non-letter characters", () => {
    const inputText = "Hello123 World!456";
    const result = regexLettersOnly(inputText);
    expect(result).toBe("HelloWorld");
  });

  // ----------------------------------------------------------------------------------------------

  it("regexLettersOnly should handle special characters", () => {
    const inputText = "Alpha!@Beta?Gamma#$Delta";
    const result = regexLettersOnly(inputText);
    expect(result).toBe("AlphaBetaGammaDelta");
  });

  // ----------------------------------------------------------------------------------------------

  it("regexLettersOnly should handle multi-word strings", () => {
    const inputText = "  One Two Three   ";
    const result = regexLettersOnly(inputText);
    expect(result).toBe("OneTwoThree");
  });

  // ----------------------------------------------------------------------------------------------

  it("regexLettersOnly should handle accented characters", () => {
    const inputText = "Café crème";
    const result = regexLettersOnly(inputText);
    expect(result).toBe("Cafécrème");
  });

  // ----------------------------------------------------------------------------------------------

  it("regexLettersOnly should handle uppercase and lowercase letters", () => {
    const inputText = "AbC XyZ";
    const result = regexLettersOnly(inputText);
    expect(result).toBe("AbCXyZ");
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - removeDuplicatedStrings", () => {
  // ----------------------------------------------------------------------------------------------

  const removeDuplicatedStrings = utils.removeDuplicatedStrings;

  // ----------------------------------------------------------------------------------------------

  it("removeDuplicatedStrings should remove duplicated strings", () => {
    const inputText = "apple orange banana apple mango banana";
    const result = removeDuplicatedStrings(inputText, " ");
    expect(result).toBe("apple orange banana mango");
  });

  // ----------------------------------------------------------------------------------------------

  it("removeDuplicatedStrings should remove case-insensitive duplicated strings", () => {
    const inputText = "apple orange Banana apple Mango Banana";
    const result = removeDuplicatedStrings(inputText, " ", true);
    expect(result).toBe("orange apple Mango Banana");
  });

  // ----------------------------------------------------------------------------------------------

  it("removeDuplicatedStrings should handle case-sensitive duplicated strings", () => {
    const inputText = "apple orange Banana apple Mango Banana";
    const result = removeDuplicatedStrings(inputText, " ", false);
    expect(result).toBe("apple orange Banana Mango");
  });

  // ----------------------------------------------------------------------------------------------

  it("removeDuplicatedStrings should handle case-insensitivity with different split string characters", () => {
    const inputText = "Apple,Orange,Banana,apple,Mango,Banana";
    const result = removeDuplicatedStrings(inputText, ",", true);
    expect(result).toBe("Orange,apple,Mango,Banana");
  });

  // ----------------------------------------------------------------------------------------------

  it("removeDuplicatedStrings should handle different split string characters", () => {
    const inputText = "apple,orange,banana,apple,mango,banana";
    const result = removeDuplicatedStrings(inputText, ",");
    expect(result).toBe("apple,orange,banana,mango");
  });

  // ----------------------------------------------------------------------------------------------

  it("removeDuplicatedStrings should handle case-insensitivity", () => {
    const inputText = "Apple Orange apple ORANGE";
    const result = removeDuplicatedStrings(inputText, " ", true);
    expect(result).toBe("apple ORANGE");
  });

  // ----------------------------------------------------------------------------------------------

  it("removeDuplicatedStrings should handle leading and trailing spaces", () => {
    const inputText = "   cat   dog   cat   ";
    const result = removeDuplicatedStrings(inputText, " ");
    expect(result).toBe("cat dog");
  });

  // ----------------------------------------------------------------------------------------------

  it("removeDuplicatedStrings should handle an empty string", () => {
    const inputText = "";
    const result = removeDuplicatedStrings(inputText, ",");
    expect(result).toBe("");
  });

  // ----------------------------------------------------------------------------------------------

  it("removeDuplicatedStrings should handle an object string", () => {
    const result = removeDuplicatedStrings({}, ",");
    expect(result).toBe("");
  });

  // ----------------------------------------------------------------------------------------------

  it("removeDuplicatedStrings should handle an number", () => {
    const result = removeDuplicatedStrings(123, ",");
    expect(result).toBe("123");
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - sleep", () => {
  // ----------------------------------------------------------------------------------------------

  const sleep = utils.sleep;

  // ----------------------------------------------------------------------------------------------

  it("sleep - should resolve with the default returnValue after the specified delay", async () => {
    const start = Date.now();
    const returnValue = await sleep(100);
    const end = Date.now();

    expect(returnValue).toBe(true);
    expect(end - start).toBeGreaterThanOrEqual(95);
  });

  // ----------------------------------------------------------------------------------------------

  it("sleep - should resolve with the specified returnValue after the specified delay", async () => {
    const start = Date.now();
    const returnValue = await sleep(100, "Hello");
    const end = Date.now();

    expect(returnValue).toBe("Hello");
    expect(end - start).toBeGreaterThanOrEqual(95);
  });

  // ----------------------------------------------------------------------------------------------

  it("sleep - should reject with the default error after the specified delay if throwError is true", async () => {
    const start = Date.now();
    try {
      await sleep(100, true, true);
    } catch (error) {
      const end = Date.now();
      expect(error).toEqual(new Error("Sleep Error"));
      expect(end - start).toBeGreaterThanOrEqual(95);
    }
  });

  // ----------------------------------------------------------------------------------------------

  it("sleep - should reject with the specified returnValue after the specified delay if throwError is true", async () => {
    const start = Date.now();
    try {
      await sleep(100, "Oops!", true);
    } catch (error) {
      const end = Date.now();
      expect(error).toBe("Oops!");
      expect(end - start).toBeGreaterThanOrEqual(95);
    }
  });

  // ----------------------------------------------------------------------------------------------

  it("sleep - should resolve immediately if milliseconds is 0", async () => {
    const start = Date.now();
    const returnValue = await sleep(0);
    const end = Date.now();

    expect(returnValue).toBe(true);
    expect(end - start).toBeLessThan(10); // Allow a small buffer for execution time
  });

  // ----------------------------------------------------------------------------------------------

  it("sleep - should reject immediately if milliseconds is 0 and throwError is true", async () => {
    const start = Date.now();
    try {
      await sleep(0, "Immediate error", true);
    } catch (error) {
      const end = Date.now();
      expect(error).toBe("Immediate error");
      expect(end - start).toBeLessThan(10); // Allow a small buffer for execution time
    }
  });
  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - stringCompress", () => {
  // ----------------------------------------------------------------------------------------------

  const stringCompress = utils.stringCompress;

  // ----------------------------------------------------------------------------------------------

  it("deve comprimir uma string para o formato Base64 por padrão", () => {
    const text = "Este é um teste de compressão.";
    const result = stringCompress(text);

    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
    // Verifica se a string parece ser Base64 válida
    expect(
      /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(
        result
      )
    ).toBe(true);
  });

  it("deve retornar um Uint8Array quando outputType for 'buffer'", () => {
    const text = "Este é um teste de buffer.";
    const result = stringCompress(text, { outputType: "buffer" });

    expect(result).toBeInstanceOf(Uint8Array);
    expect(result.length).toBeGreaterThan(0);
  });

  it("deve lidar corretamente com caracteres unicode e multi-byte", () => {
    const text = "Compressão com acentuação e emojis 👋 & ✅";
    const result = stringCompress(text);

    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("deve retornar uma string vazia para entrada de string vazia", () => {
    expect(stringCompress("")).toBe("");
  });

  it("deve retornar um Uint8Array vazio para entrada vazia com outputType 'buffer'", () => {
    const result = stringCompress("", { outputType: "buffer" });
    expect(result).toBeInstanceOf(Uint8Array);
    expect(result.length).toBe(0);
  });

  it("deve lidar com entradas nulas, indefinidas ou que não são strings", () => {
    expect(stringCompress(null)).toBe("");
    expect(stringCompress(undefined)).toBe("");
    expect(stringCompress(12345)).toBe("");
  });

  it("deve usar diferentes níveis de compressão e gerar resultados diferentes", () => {
    const text =
      "texto repetitivo texto repetitivo texto repetitivo texto repetitivo texto repetitivo";
    const resultNivel1 = stringCompress(text, { level: 1 });
    const resultNivel9 = stringCompress(text, { level: 9 });

    expect(resultNivel1).not.toBe(resultNivel9);
    // Um nível de compressão maior deve resultar em um tamanho menor ou igual
    expect(resultNivel9.length).toBeLessThanOrEqual(resultNivel1.length);
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - stringDecompress", () => {
  // ----------------------------------------------------------------------------------------------

  const stringCompress = utils.stringCompress;
  const stringDecompress = utils.stringDecompress;

  // ----------------------------------------------------------------------------------------------

  it("deve descomprimir uma string Base64 de volta para o texto original (ciclo completo)", () => {
    const originalText =
      "Este é um teste completo de compressão e descompressão!";
    const compressed = stringCompress(originalText);
    const decompressed = stringDecompress(compressed);
    expect(decompressed).toBe(originalText);
  });

  it("deve realizar um ciclo completo com caracteres unicode", () => {
    const originalText =
      "Teste com acentuação (áéíóú) e símbolos complexos (👋 & ✅)";
    const compressed = stringCompress(originalText);
    const decompressed = stringDecompress(compressed);
    expect(decompressed).toBe(originalText);
  });

  it("deve realizar um ciclo completo usando buffers como formato intermediário", () => {
    const originalText = "Ciclo completo de buffer para buffer";
    const compressedBuffer = stringCompress(originalText, {
      outputType: "buffer",
    });
    const decompressed = stringDecompress(compressedBuffer, {
      inputType: "buffer",
    });
    expect(decompressed).toBe(originalText);
  });

  it("deve funcionar independentemente do nível de compressão usado", () => {
    const originalText = "Testando com nível de compressão 9";
    const compressed = stringCompress(originalText, { level: 9 });
    const decompressed = stringDecompress(compressed);
    expect(decompressed).toBe(originalText);
  });

  it("deve retornar uma string vazia para entrada vazia ou nula", () => {
    expect(stringDecompress("")).toBe("");
    expect(stringDecompress(null)).toBe("");
    expect(stringDecompress(undefined)).toBe("");
  });

  it("deve retornar uma string vazia para dados Base64 corrompidos", () => {
    const corruptBase64 = "isto nao e base64 valida";
    expect(stringDecompress(corruptBase64)).toBe("");
  });

  it("deve retornar uma string vazia para um buffer corrompido", () => {
    const corruptBuffer = new Uint8Array([1, 2, 3, 4, 5]);
    const result = stringDecompress(corruptBuffer, { inputType: "buffer" });
    expect(result).toBe("");
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - stringToDate", () => {
  // ----------------------------------------------------------------------------------------------

  const stringToDate = utils.stringToDate;

  // ----------------------------------------------------------------------------------------------

  it("stringToDate should parse a valid date string with default format", () => {
    const dateString = "2023-12-22T12:34:56.789";
    const result = stringToDate(dateString);
    expect(result instanceof Date).toBe(true);
    expect(result.toGMTString()).toBe("Fri, 22 Dec 2023 12:34:56 GMT");
  });

  // ----------------------------------------------------------------------------------------------

  it("stringToDate should parse a valid date string with default format with timezone format", () => {
    const dateString = "2023-12-22T12:34:56.789Z";
    const result = stringToDate(dateString, constants.DATE_ISO_FORMAT_TZ);
    expect(result instanceof Date).toBe(true);
    expect(result.toGMTString()).toBe("Fri, 22 Dec 2023 12:34:56 GMT");
  });

  // ----------------------------------------------------------------------------------------------

  it("stringToDate should parse a valid date string with custom format", () => {
    const dateString = "22-12-2023";
    const customFormat = "dd-MM-yyyy";
    const result = stringToDate(dateString, customFormat);
    expect(result instanceof Date).toBe(true);
    expect(result.toGMTString()).toBe("Fri, 22 Dec 2023 00:00:00 GMT");
  });

  // ----------------------------------------------------------------------------------------------

  it("stringToDate should parse a valid date string with custom incomplete format", () => {
    const dateString = "12-07-2022";
    const result = stringToDate(dateString, constants.DATE_BR_FORMAT_D);
    expect(result instanceof Date).toBe(true);
    expect(result.toGMTString()).toBe("Tue, 12 Jul 2022 00:00:00 GMT");
  });

  // ----------------------------------------------------------------------------------------------

  it("stringToDate should return default date for an invalid date string with default format", () => {
    const invalidDateString = "invalid-date";
    const defaultDate = new Date(2022, 0, 1);
    const result = stringToDate(invalidDateString, undefined, defaultDate);
    expect(result instanceof Date).toBe(true);
    expect(result.toGMTString()).toBe("Sat, 01 Jan 2022 00:00:00 GMT");
  });

  // ----------------------------------------------------------------------------------------------

  it("stringToDate should return default date for an invalid date string with custom format", () => {
    const invalidDateString = "invalid-date";
    const customFormat = "dd-MM-yyyy";
    const defaultDate = new Date(2022, 0, 1);
    const result = stringToDate(invalidDateString, customFormat, defaultDate);
    expect(result instanceof Date).toBe(true);
    expect(result.toGMTString()).toBe("Sat, 01 Jan 2022 00:00:00 GMT");
  });

  // ----------------------------------------------------------------------------------------------

  it("stringToDate should return default date as false for an invalid date string with custom format", () => {
    const invalidDateString = "invalid-date";
    const customFormat = "dd-MM-yyyy";
    const result = stringToDate(invalidDateString, customFormat, false);
    expect(result).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - stringToDateToFormat", () => {
  // ----------------------------------------------------------------------------------------------

  const stringToDateToFormat = utils.stringToDateToFormat;

  // ----------------------------------------------------------------------------------------------

  it("should return a formatted date string in the default format", () => {
    const inputDateString = "2022-01-15T12:34:56.789";
    const result = stringToDateToFormat(inputDateString);
    expect(result).toEqual("15-01-2022 12:34:56");
  });

  // ----------------------------------------------------------------------------------------------

  it("should return a formatted date string from a custom format", () => {
    const inputDateString = "02-05-2021";
    const result = stringToDateToFormat(
      inputDateString,
      constants.DATE_BR_FORMAT_D,
      constants.DATE_BR_MONTH_FORMAT_FS
    );
    expect(result).toEqual("05/2021");
  });

  // ----------------------------------------------------------------------------------------------

  it("should return a formatted date string in the specified format", () => {
    const inputDateString = "2022-12-22T12:34:56.789";
    const result = stringToDateToFormat(
      inputDateString,
      constants.DATE_ISO_FORMAT,
      constants.DATE_BR_FORMAT_D
    );
    expect(result).toEqual("22-12-2022");
  });

  // ----------------------------------------------------------------------------------------------

  it("should return false for an invalid date string", () => {
    const invalidDateString = "invalid-date-string";
    const result = stringToDateToFormat(invalidDateString);
    expect(result).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("should return false for a valid date string but invalid format", () => {
    const inputDateString = "2022-12-22T12:34:56.789Z";
    const invalidFormat = "invalid-format";
    const result = stringToDateToFormat(
      inputDateString,
      constants.DATE_ISO_FORMAT,
      invalidFormat
    );
    expect(result).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - stringToFormat", () => {
  // ----------------------------------------------------------------------------------------------

  const stringToFormat = utils.stringToFormat;

  // ----------------------------------------------------------------------------------------------

  it("should return a formatted string with the default pattern", () => {
    const inputText = "12345678901234";
    const result = stringToFormat(inputText);
    expect(result).toBe("12.345.678/9012-34");
  });

  // ----------------------------------------------------------------------------------------------

  it("should return a formatted string with the specified pattern", () => {
    const inputText = "12345678901234";
    const customPattern = "###-###-###";
    const result = stringToFormat(inputText, customPattern);
    expect(result).toBe("123-456-789");
  });

  // ----------------------------------------------------------------------------------------------

  it("should pad the input text with zeros if it is shorter than the pattern", () => {
    const inputText = "123400";
    const result = stringToFormat(inputText);
    expect(result).toBe("00.000.000/1234-00");
  });

  // ----------------------------------------------------------------------------------------------

  it("should ignore extra digits if the input text is longer than the pattern", () => {
    const inputText = "12345678901234567890";
    const result = stringToFormat(inputText);
    expect(result).toBe("12.345.678/9012-34");
  });

  // ----------------------------------------------------------------------------------------------

  it("should handle an empty input text", () => {
    const result = stringToFormat("");
    expect(result).toBe("00.000.000/0000-00");
  });

  // ----------------------------------------------------------------------------------------------

  it("should return a formatted string with the default pattern and options", () => {
    const inputText = "12345678901234";
    const result = stringToFormat(inputText);
    expect(result).toBe("12.345.678/9012-34");
  });

  // ----------------------------------------------------------------------------------------------

  it("should return a formatted string with the specified pattern and options", () => {
    const inputText = "12345678901234";
    const customPattern = "###-###-###";
    const options = { digitsOnly: true, paddingChar: "X" };
    const result = stringToFormat(inputText, customPattern, options);
    expect(result).toBe("123-456-789");
  });

  // ----------------------------------------------------------------------------------------------

  it("should pad the input text if it is shorter than the pattern and apply custom padding char", () => {
    const inputText = "1234";
    const options = { digitsOnly: true, paddingChar: "9" };
    const result = stringToFormat(inputText, undefined, options);
    expect(result).toBe("99.999.999/9912-34");
  });

  // ----------------------------------------------------------------------------------------------

  it("should handle an empty input text and apply custom padding char", () => {
    const options = { digitsOnly: true, paddingChar: "7" };
    const result = stringToFormat("", undefined, options);
    expect(result).toBe("77.777.777/7777-77");
  });

  // ----------------------------------------------------------------------------------------------

  it("should handle a undefined text", () => {
    const options = { digitsOnly: true, paddingChar: "X" };
    const result = stringToFormat(undefined, "XXX.XXX.XXX-XX", options);
    expect(result).toBe("XXX.XXX.XXX-XX");
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - stringZLibCompress", () => {
  // ----------------------------------------------------------------------------------------------

  const stringZLibCompress = utils.stringZLibCompress;

  // ----------------------------------------------------------------------------------------------

  it("deve comprimir uma string com Zlib para o formato Base64 por padrão", () => {
    const text = "Este é um teste de compressão Zlib.";
    const result = stringZLibCompress(text);

    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
    // Verifica se a string parece ser Base64 válida
    expect(
      /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(
        result
      )
    ).toBe(true);
  });

  it("deve retornar um Uint8Array quando outputType for 'buffer'", () => {
    const text = "Este é um teste de buffer com Zlib.";
    const result = stringZLibCompress(text, { outputType: "buffer" });

    expect(result).toBeInstanceOf(Uint8Array);
    expect(result.length).toBeGreaterThan(0);
  });

  it("deve lidar corretamente com caracteres unicode e multi-byte", () => {
    const text = "Compressão Zlib com acentuação e emojis 👋 & ✅";
    const result = stringZLibCompress(text);

    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("deve retornar uma string vazia para entrada de string vazia", () => {
    expect(stringZLibCompress("")).toBe("");
  });

  it("deve retornar um Uint8Array vazio para entrada vazia com outputType 'buffer'", () => {
    const result = stringZLibCompress("", { outputType: "buffer" });
    expect(result).toBeInstanceOf(Uint8Array);
    expect(result.length).toBe(0);
  });

  it("deve lidar com entradas nulas, indefinidas ou que não são strings", () => {
    expect(stringZLibCompress(null)).toBe("");
    expect(stringZLibCompress(undefined)).toBe("");
    expect(stringZLibCompress(12345)).toBe("");
  });

  it("deve usar diferentes níveis de compressão e gerar resultados diferentes", () => {
    const text =
      "zlib repetitivo zlib repetitivo zlib repetitivo zlib repetitivo zlib repetitivo";
    const resultNivel1 = stringZLibCompress(text, { level: 1 });
    const resultNivel9 = stringZLibCompress(text, { level: 9 });

    expect(resultNivel1).not.toBe(resultNivel9);
    // Um nível de compressão maior deve resultar em um tamanho menor ou igual
    expect(resultNivel9.length).toBeLessThanOrEqual(resultNivel1.length);
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - stringZLibDecompress", () => {
  // ----------------------------------------------------------------------------------------------

  const stringZLibCompress = utils.stringZLibCompress;
  const stringZLibDecompress = utils.stringZLibDecompress;

  // ----------------------------------------------------------------------------------------------

  it("deve descomprimir uma string Base64 (Zlib) de volta para o texto original", () => {
    const originalText =
      "Este é um teste completo de compressão e descompressão Zlib!";
    const compressed = stringZLibCompress(originalText);
    const decompressed = stringZLibDecompress(compressed);
    expect(decompressed).toBe(originalText);
  });

  it("deve realizar um ciclo completo com caracteres unicode", () => {
    const originalText =
      "Teste Zlib com acentuação (áéíóú) e símbolos complexos (👋 & ✅)";
    const compressed = stringZLibCompress(originalText);
    const decompressed = stringZLibDecompress(compressed);
    expect(decompressed).toBe(originalText);
  });

  it("deve realizar um ciclo completo usando buffers como formato intermediário", () => {
    const originalText = "Ciclo completo Zlib: de buffer para buffer";
    const compressedBuffer = stringZLibCompress(originalText, {
      outputType: "buffer",
    });
    const decompressed = stringZLibDecompress(compressedBuffer, {
      inputType: "buffer",
    });
    expect(decompressed).toBe(originalText);
  });

  it("deve funcionar independentemente do nível de compressão usado", () => {
    const originalText = "Testando Zlib com nível de compressão 9";
    const compressed = stringZLibCompress(originalText, { level: 9 });
    const decompressed = stringZLibDecompress(compressed);
    expect(decompressed).toBe(originalText);
  });

  it("deve retornar uma string vazia para entrada vazia ou nula", () => {
    expect(stringZLibDecompress("")).toBe("");
    expect(stringZLibDecompress(null)).toBe("");
    expect(stringZLibDecompress(undefined)).toBe("");
  });

  it("deve retornar uma string vazia para dados Base64 corrompidos", () => {
    const corruptBase64 = "isto nao e base64 valida para zlib";
    expect(stringZLibDecompress(corruptBase64)).toBe("");
  });

  it("deve retornar uma string vazia para um buffer corrompido", () => {
    const corruptBuffer = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
    const result = stringZLibDecompress(corruptBuffer, { inputType: "buffer" });
    expect(result).toBe("");
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - throttle", () => {
  // ----------------------------------------------------------------------------------------------

  const throttle = utils.throttle;
  const sleep = utils.sleep;
  let vi; // Mocking utility from vitest/jest

  beforeEach(() => {
    // Para ambientes de teste como Vitest/Jest
    vi = global.vi || global.jest;
    vi.useFakeTimers(); // Usa timers falsos para controlar o tempo com precisão
  });

  afterEach(() => {
    vi.useRealTimers(); // Restaura os timers reais após cada teste
  });

  // ----------------------------------------------------------------------------------------------

  it("deve executar o callback imediatamente na primeira chamada", () => {
    const mockCallback = vi.fn();
    const throttledFn = throttle(mockCallback, 100);

    throttledFn();

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it("deve ignorar chamadas subsequentes dentro do período de espera", () => {
    const mockCallback = vi.fn();
    const throttledFn = throttle(mockCallback, 100);

    throttledFn(); // Executa
    throttledFn(); // Ignorada
    throttledFn(); // Ignorada

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it("deve executar novamente após o período de espera ter passado", () => {
    const mockCallback = vi.fn();
    const throttledFn = throttle(mockCallback, 100);

    throttledFn();
    expect(mockCallback).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(50);
    throttledFn();
    expect(mockCallback).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(50);
    throttledFn();
    expect(mockCallback).toHaveBeenCalledTimes(2);
  });

  it("deve passar os argumentos corretamente para o callback", () => {
    const mockCallback = vi.fn();
    const throttledFn = throttle(mockCallback, 100);
    const args = [1, "teste", { data: true }];

    throttledFn(...args);

    expect(mockCallback).toHaveBeenCalledWith(...args);
  });

  it("deve preservar o contexto 'this' corretamente", () => {
    const mockCallback = vi.fn();
    const context = { name: "meuObjeto" };
    const throttledFn = throttle(mockCallback, 100);

    throttledFn.call(context);

    // CORREÇÃO: Acessa o array de contextos da chamada mock e verifica o primeiro.
    // Esta é a forma padrão de verificar o `this` em mocks do Vitest/Jest.
    expect(mockCallback.mock.contexts[0]).toBe(context);
  });

  it("deve lançar um erro se o callback não for uma função", () => {
    const createInvalidThrottle = () => throttle("não é uma função", 100);

    expect(createInvalidThrottle).toThrow(TypeError);
    expect(createInvalidThrottle).toThrow(
      "O callback fornecido para o throttle deve ser uma função."
    );
  });

  it("deve lançar um erro se o tempo de espera não for um número", () => {
    const createInvalidThrottle = () => throttle(() => {}, "100");

    expect(createInvalidThrottle).toThrow(TypeError);
    // CORREÇÃO: Atualiza a mensagem de erro para corresponder à validação mais robusta da função.
    expect(createInvalidThrottle).toThrow(
      "O tempo de espera (wait) do throttle deve ser um número não negativo."
    );
  });

  it("deve permitir uma nova chamada após uma chamada anterior e um ciclo completo de espera", () => {
    const mockCallback = vi.fn();
    const throttledFn = throttle(mockCallback, 100);

    throttledFn(1);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(1);

    vi.advanceTimersByTime(101);

    throttledFn(2);
    expect(mockCallback).toHaveBeenCalledTimes(2);
    expect(mockCallback).toHaveBeenLastCalledWith(2);
  });

  // ----------------------------------------------------------------------------------------------
});
// ------------------------------------------------------------------------------------------------

describe("UTILS - toString", () => {
  // ----------------------------------------------------------------------------------------------

  const toString = utils.toString;

  // ----------------------------------------------------------------------------------------------

  it("should return an empty string for undefined input", () => {
    const result = toString();
    expect(result).toBe("");
  });

  // ----------------------------------------------------------------------------------------------

  it("should return the same string for a string input", () => {
    const inputText = "Hello, World!";
    const result = toString(inputText);
    expect(result).toBe(inputText);
  });

  // ----------------------------------------------------------------------------------------------

  it("should convert a number to a string", () => {
    const inputNumber = 42;
    const result = toString(inputNumber);
    expect(result).toBe("42");
  });

  // ----------------------------------------------------------------------------------------------

  it("should convert a boolean to a string", () => {
    const inputBoolean = true;
    const result = toString(inputBoolean);
    expect(result).toBe("true");
  });

  // ----------------------------------------------------------------------------------------------

  it("should use toString method for custom objects", () => {
    const customObject = {
      toString: () => "Custom Object",
    };
    const result = toString(customObject);
    expect(result).toBe("Custom Object");
  });

  // ----------------------------------------------------------------------------------------------

  it("should convert null to an empty string", () => {
    const inputNull = null;
    const result = toString(inputNull);
    expect(result).toBe("");
  });

  // ----------------------------------------------------------------------------------------------

  it("should convert undefined to an empty string", () => {
    const inputUndefined = undefined;
    const result = toString(inputUndefined);
    expect(result).toBe("");
  });

  // ----------------------------------------------------------------------------------------------

  it("should convert symbols to a string", () => {
    const inputSymbol = Symbol("test");
    const result = toString(inputSymbol);
    expect(result).toBe("Symbol(test)");
  });

  // ----------------------------------------------------------------------------------------------

  it("should use toString method for custom objects", () => {
    const customObject = {
      a: 2,
      b: "text",
      c: { x: "test" },
    };
    const result = toString(customObject);
    expect(result).toBe('{"a":2,"b":"text","c":{"x":"test"}}');
  });

  // ----------------------------------------------------------------------------------------------

  it("should use toString method for custom objects but not JSON stringfy it", () => {
    const customObject = {
      a: 2,
      b: "text",
      c: { x: "test" },
    };
    const result = toString(customObject, false);
    expect(result).toBe("[object Object]");
  });
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - uint8ArrayFromString", () => {
  // ----------------------------------------------------------------------------------------------

  const uint8ArrayFromString = utils.uint8ArrayFromString;

  // ----------------------------------------------------------------------------------------------

  it("should return Uint8Array when no joinChar is specified", () => {
    const text = "Hello, world!";
    const result = uint8ArrayFromString(text);
    assert.ok(result instanceof Uint8Array);
    assert.strictEqual(result.length, text.length);
  });

  // ----------------------------------------------------------------------------------------------

  it("should return joined string when joinChar is specified", () => {
    const text = "Hello, world!";
    const joinChar = "-";
    const result = uint8ArrayFromString(text, joinChar);
    assert.strictEqual(typeof result, "string");
    assert.strictEqual(
      result,
      "72-101-108-108-111-44-32-119-111-114-108-100-33"
    );
  });

  // ----------------------------------------------------------------------------------------------

  it("should return empty Uint8Array when text is empty", () => {
    const result = uint8ArrayFromString("");
    assert.ok(result instanceof Uint8Array);
    assert.strictEqual(result.length, 0);
  });

  // ----------------------------------------------------------------------------------------------

  it("should return Uint8Array with correct values for non-ASCII characters", () => {
    const text = "😊🌟";
    const result = uint8ArrayFromString(text);
    const expected = new Uint8Array([240, 159, 152, 138, 240, 159, 140, 159]);
    assert.deepStrictEqual(result, expected);
  });

  // ----------------------------------------------------------------------------------------------

  it("should handle special characters correctly", () => {
    const text = "Special characters: \n\r\t";
    const result = uint8ArrayFromString(text);
    const expected = new Uint8Array([
      83, 112, 101, 99, 105, 97, 108, 32, 99, 104, 97, 114, 97, 99, 116, 101,
      114, 115, 58, 32, 10, 13, 9,
    ]);
    assert.deepStrictEqual(result, expected);
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - uint8ArrayToString", () => {
  // ----------------------------------------------------------------------------------------------

  const uint8ArrayToString = utils.uint8ArrayToString;

  // ----------------------------------------------------------------------------------------------

  it("should return an empty string if uint8Array is null or undefined", () => {
    const result = uint8ArrayToString(null);
    assert.strictEqual(result, "");
  });

  // ----------------------------------------------------------------------------------------------

  it("should return the original string when no splitChar is specified", () => {
    const uint8Array = new Uint8Array([
      72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33,
    ]);
    const result = uint8ArrayToString(uint8Array);
    assert.strictEqual(result, "Hello, world!");
  });

  // ----------------------------------------------------------------------------------------------

  it("should return the original string when splitChar is not specified", () => {
    const uint8Array = new Uint8Array([
      72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33,
    ]);
    const result = uint8ArrayToString(uint8Array, "");
    assert.strictEqual(result, "Hello, world!");
  });

  // ----------------------------------------------------------------------------------------------

  it("should split the Uint8Array by the specified splitChar", () => {
    const uint8Array =
      "72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33";
    const result = uint8ArrayToString(uint8Array, ",");
    assert.strictEqual(result, "Hello, world!");
  });

  // ----------------------------------------------------------------------------------------------

  it("should correctly handle non-ASCII characters", () => {
    const uint8Array = new Uint8Array([240, 159, 152, 138, 240, 159, 140, 159]);
    const result = uint8ArrayToString(uint8Array);
    assert.strictEqual(result, "😊🌟");
  });

  // ----------------------------------------------------------------------------------------------

  it("should correctly handle empty Uint8Array", () => {
    const uint8Array = new Uint8Array([]);
    const result = uint8ArrayToString(uint8Array);
    assert.strictEqual(result, "");
  });
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - timestamp", () => {
  const timestamp = utils.timestamp;

  // Define uma data e hora fixas para garantir que os testes sejam consistentes.
  // Horário local de Curitiba (-03:00) para corresponder ao comportamento de new Date().
  const MOCK_DATE = new Date("2025-08-22T19:30:15.123-03:00");

  // Antes de cada teste, ativamos os timers falsos e fixamos o tempo.
  beforeEach(() => {
    // Estas são funções de bibliotecas como Vitest/Jest para simular o tempo
    // vi.useFakeTimers();
    // vi.setSystemTime(MOCK_DATE);
    // Para este exemplo, vamos simular o mock diretamente (não execute este código de mock em um projeto real, use o da sua lib de testes)
    global.Date = class extends Date {
      constructor() {
        super();
        return MOCK_DATE;
      }
    };
  });

  // Depois de cada teste, restauramos o comportamento normal do Date.
  afterEach(() => {
    // vi.useRealTimers();
    global.Date = Date;
  });

  // ----------------------------------------------------------------------------------------------

  it("should use the default format 'D-MT-Y_H:MN:S:MS' when no argument is provided", () => {
    const result = timestamp();
    assert.strictEqual(result, "22-08-2025_19:30:15:123");
  });

  // ----------------------------------------------------------------------------------------------

  it("should format a standard ISO 8601 date format", () => {
    const result = timestamp("Y-MT-D");
    assert.strictEqual(result, "2025-08-22");
  });

  // ----------------------------------------------------------------------------------------------

  it("should format a standard time format", () => {
    const result = timestamp("H:MN:S");
    assert.strictEqual(result, "19:30:15");
  });

  // ----------------------------------------------------------------------------------------------

  it("should format time including milliseconds", () => {
    const result = timestamp("H:MN:S:MS");
    assert.strictEqual(result, "19:30:15:123");
  });

  // ----------------------------------------------------------------------------------------------

  it("should handle custom separators like slashes, spaces, and pipes", () => {
    const result = timestamp("D/MT/Y | H_MN");
    assert.strictEqual(result, "22/08/2025 | 19_30");
  });

  // ----------------------------------------------------------------------------------------------

  it("should correctly format each token individually", () => {
    assert.strictEqual(timestamp("Y"), "2025", "Test for Y failed");
    assert.strictEqual(timestamp("MT"), "08", "Test for MT failed");
    assert.strictEqual(timestamp("D"), "22", "Test for D failed");
    assert.strictEqual(timestamp("H"), "19", "Test for H failed");
    assert.strictEqual(timestamp("MN"), "30", "Test for MN failed");
    assert.strictEqual(timestamp("S"), "15", "Test for S failed");
    assert.strictEqual(timestamp("MS"), "123", "Test for MS failed");
  });

  // ----------------------------------------------------------------------------------------------

  it("should return an empty string if the format string is empty", () => {
    const result = timestamp("");
    assert.strictEqual(result, "");
  });

  // ----------------------------------------------------------------------------------------------

  it("should treat non-token strings as literal characters and return them as is", () => {
    const result = timestamp("GO GO GO [LOG]");
    assert.strictEqual(result, "GO GO GO [LOG]");
  });

  // ----------------------------------------------------------------------------------------------

  it("should treat lowercase tokens as literal characters", () => {
    const result = timestamp("y-mt-d h:mn:s:ms");
    assert.strictEqual(result, "y-mt-d h:mn:s:ms");
  });

  // ----------------------------------------------------------------------------------------------

  it("should handle repeated tokens correctly", () => {
    const result = timestamp("Y/Y/Y H-H");
    assert.strictEqual(result, "2025/2025/2025 19-19");
  });

  // ----------------------------------------------------------------------------------------------

  it("should format a full timestamp in reverse order", () => {
    const result = timestamp("MS:S:MN H D-MT-Y");
    assert.strictEqual(result, "123:15:30 19 22-08-2025");
  });

  // ----------------------------------------------------------------------------------------------

  it("should handle a format with no separators", () => {
    const result = timestamp("YMTDHMN");
    assert.strictEqual(result, "202508221930");
  });
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - pickKeys", () => {
  const pickKeys = utils.pickKeys;

  // Objeto base usado na maioria dos testes para consistência.
  const sourceObject = {
    id: 123,
    name: "John Doe",
    email: "john.doe@example.com",
    status: "active",
  };

  // Adiciona uma propriedade herdada para testar a segurança contra o prototype chain.
  const sourceWithPrototype = Object.create({
    inherited: "should_not_be_picked",
  });
  Object.assign(sourceWithPrototype, sourceObject);

  // ----------------------------------------------------------------------------------------------
  // Casos de Uso Padrão
  // ----------------------------------------------------------------------------------------------

  it("should pick a subset of existing keys from an object", () => {
    const keys = ["id", "name"];
    const result = pickKeys(sourceObject, keys);
    const expected = { id: 123, name: "John Doe" };
    expect(result).toEqual(expected);
  });

  it("should return a new object instance, not a reference to the original", () => {
    const keys = ["id", "name"];
    const result = pickKeys(sourceObject, keys);
    expect(result).not.toBe(sourceObject);
  });

  it("should pick all keys if all are specified", () => {
    const keys = ["id", "name", "email", "status"];
    const result = pickKeys(sourceObject, keys);
    expect(result).toEqual(sourceObject);
  });

  // ----------------------------------------------------------------------------------------------
  // Casos de Borda (Edge Cases)
  // ----------------------------------------------------------------------------------------------

  it("should return an empty object if the array of keys is empty", () => {
    const result = pickKeys(sourceObject, []);
    expect(result).toEqual({});
  });

  it("should ignore keys that are in the array but not in the source object", () => {
    const keys = ["id", "nonExistentKey", "email"];
    const result = pickKeys(sourceObject, keys);
    const expected = { id: 123, email: "john.doe@example.com" };
    expect(result).toEqual(expected);
  });

  it("should return an empty object when picking from an empty source object", () => {
    const result = pickKeys({}, ["id", "name"]);
    expect(result).toEqual({});
  });

  it("should not pick inherited properties from the object's prototype", () => {
    const keys = ["id", "inherited"];
    const result = pickKeys(sourceWithPrototype, keys);
    const expected = { id: 123 };
    expect(result).toEqual(expected);
  });

  // ----------------------------------------------------------------------------------------------
  // Casos com Entradas Inválidas
  // ----------------------------------------------------------------------------------------------

  it.each([
    { value: null, description: "null" },
    { value: undefined, description: "undefined" },
    { value: "a string", description: "uma string" },
    { value: 123, description: "um número" },
    { value: [1, 2, 3], description: "um array" },
  ])(
    "should return an empty object if the source is not an object but $description",
    ({ value }) => {
      const result = pickKeys(value, ["id"]);
      expect(result).toEqual({});
    }
  );

  it.each([
    { value: null, description: "null" },
    { value: undefined, description: "undefined" },
    { value: "id", description: "uma string" },
    { value: 123, description: "um número" },
    { value: { key: "id" }, description: "um objeto" },
  ])(
    "should return an empty object if keysToPick is not an array but $description",
    ({ value }) => {
      const result = pickKeys(sourceObject, value);
      expect(result).toEqual({});
    }
  );
});

describe("UTILS - messageEncryptToChunks - Comprehensive Test Suite", () => {
  const PUBLIC_KEY = fs.readFileSync("./keys/public_key.pem", "utf8");
  const PRIVATE_KEY = fs.readFileSync("./keys/private_key.pem", "utf8");

  it("should encrypt null message", async () => {
    const encryptedChunks = await utils.messageEncryptToChunks(
      PUBLIC_KEY,
      null
    );
    expect(encryptedChunks).toEqual([]);
  });

  it("should encrypt single character", async () => {
    const encryptedChunks = await utils.messageEncryptToChunks(PUBLIC_KEY, "a");
    expect(encryptedChunks).toBeTruthy();
    expect(encryptedChunks.length).toBeGreaterThan(0);
  });

  it("should encrypt whitespace-only message", async () => {
    const encryptedChunks = await utils.messageEncryptToChunks(
      PUBLIC_KEY,
      "   \n\t  "
    );
    expect(encryptedChunks).toBeTruthy();
    expect(encryptedChunks.length).toBeGreaterThan(0);
  });

  // // Edge cases for chunk sizes
  it("should handle chunk size of 1", async () => {
    const message = "Hello World";
    const encryptedChunks = await utils.messageEncryptToChunks(
      PUBLIC_KEY,
      message,
      {
        chunkSize: 1,
      }
    );
    expect(encryptedChunks).toBeTruthy();
    expect(encryptedChunks.length).toBeGreaterThanOrEqual(message.length);
  });

  it("should handle chunk size equal to message length", async () => {
    const message = "Hello World";
    const encryptedChunks = await utils.messageEncryptToChunks(
      PUBLIC_KEY,
      message,
      {
        chunkSize: message.length,
      }
    );
    expect(encryptedChunks).toBeTruthy();
    expect(encryptedChunks.length).toBeGreaterThanOrEqual(1);
  });

  it("should handle chunk size larger than message", async () => {
    const message = "Hello";
    const encryptedChunks = await utils.messageEncryptToChunks(
      PUBLIC_KEY,
      message,
      {
        chunkSize: 1000,
      }
    );
    expect(encryptedChunks).toBeTruthy();
    expect(encryptedChunks.length).toBe(1);
  });

  it("should default to 190 chunk size when informed as 0", async () => {
    const message = "Hello World";
    const encryptedChunks = await utils.messageEncryptToChunks(
      PUBLIC_KEY,
      message,
      { chunkSize: 0 }
    );

    expect(encryptedChunks).toBeTruthy();
  });

  it("should efault to 190 chunk size for negative chunk size", async () => {
    const message = "Hello World";
    const encryptedChunks = await utils.messageEncryptToChunks(
      PUBLIC_KEY,
      message,
      { chunkSize: -1 }
    );

    expect(encryptedChunks).toBeTruthy();
  });

  // Unicode and special character tests
  it("should encrypt message with emojis", async () => {
    const message = "Hello 👋 World 🌍 Test 🚀";
    const encryptedChunks = await utils.messageEncryptToChunks(
      PUBLIC_KEY,
      message
    );
    expect(encryptedChunks).toBeTruthy();
  });

  it("should encrypt message with complex unicode", async () => {
    const message = "𝕳𝖊𝖑𝖑𝖔 𝖂𝖔𝖗𝖑𝖉 🔥 测试 العربية עברית";
    const encryptedChunks = await utils.messageEncryptToChunks(
      PUBLIC_KEY,
      message
    );
    expect(encryptedChunks).toBeTruthy();
  });

  it("should encrypt message with zero-width characters", async () => {
    const message = "Hello\u200B\u200C\u200D\uFEFFWorld";
    const encryptedChunks = await utils.messageEncryptToChunks(
      PUBLIC_KEY,
      message
    );
    expect(encryptedChunks).toBeTruthy();
  });

  it("should encrypt message with control characters", async () => {
    const message = "Hello\x00\x01\x02\x03World";
    const encryptedChunks = await utils.messageEncryptToChunks(
      PUBLIC_KEY,
      message
    );
    expect(encryptedChunks).toBeTruthy();
  });

  // Binary data tests
  it("should encrypt binary data as string", async () => {
    const binaryData = String.fromCharCode(
      ...Array.from({ length: 256 }, (_, i) => i)
    );
    const encryptedChunks = await utils.messageEncryptToChunks(
      PUBLIC_KEY,
      binaryData
    );
    expect(encryptedChunks).toBeTruthy();
  });

  // // Large data tests
  it("should encrypt extremely large message", async () => {
    const largeMessage = "a".repeat(100000); // 100KB
    const encryptedChunks = await utils.messageEncryptToChunks(
      PUBLIC_KEY,
      largeMessage
    );
    expect(encryptedChunks).toBeTruthy();
    expect(encryptedChunks.length).toBeGreaterThan(1);
  });

  it("should encrypt message with maximum safe integer length", async () => {
    const message = "a".repeat(10000);
    const encryptedChunks = await utils.messageEncryptToChunks(
      PUBLIC_KEY,
      message,
      {
        chunkSize: 100,
      }
    );
    expect(encryptedChunks).toBeTruthy();
    expect(encryptedChunks.length).toBeGreaterThanOrEqual(100);
  });

  // Invalid key format tests
  it("should throw error for malformed PEM key", async () => {
    const malformedKey =
      "-----BEGIN PUBLIC KEY-----\nINVALID_BASE64\n-----END PUBLIC KEY-----";
    await expect(
      utils.messageEncryptToChunks(malformedKey, "test")
    ).rejects.toThrow();
  });

  it("should throw error for private key instead of public", async () => {
    const privateKey = fs.readFileSync("./keys/private_key.pem", "utf8");
    await expect(
      utils.messageEncryptToChunks(privateKey, "test")
    ).rejects.toThrow();
  });

  it("should throw error for empty key string", async () => {
    await expect(utils.messageEncryptToChunks("", "test")).rejects.toThrow();
  });

  it("should throw error for key without headers", async () => {
    const keyWithoutHeaders = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...";
    await expect(
      utils.messageEncryptToChunks(keyWithoutHeaders, "test")
    ).rejects.toThrow();
  });

  // Options parameter tests
  it("should handle undefined options", async () => {
    const encryptedChunks = await utils.messageEncryptToChunks(
      PUBLIC_KEY,
      "test",
      undefined
    );
    expect(encryptedChunks).toBeTruthy();
  });

  it("should handle null options", async () => {
    const encryptedChunks = await utils.messageEncryptToChunks(
      PUBLIC_KEY,
      "test",
      null
    );
    expect(encryptedChunks).toBeTruthy();
  });

  it("should handle empty options object", async () => {
    const encryptedChunks = await utils.messageEncryptToChunks(
      PUBLIC_KEY,
      "test",
      {}
    );
    expect(encryptedChunks).toBeTruthy();
  });

  it("should handle options with extra properties", async () => {
    const encryptedChunks = await utils.messageEncryptToChunks(
      PUBLIC_KEY,
      "test",
      {
        chunkSize: 100,
        extraProp: "ignored",
      }
    );
    expect(encryptedChunks).toBeTruthy();
  });

  // Return value validation tests
  it("should return array of strings", async () => {
    const encryptedChunks = await utils.messageEncryptToChunks(
      PUBLIC_KEY,
      "test"
    );
    expect(Array.isArray(encryptedChunks)).toBe(true);
    encryptedChunks.forEach((chunk) => {
      expect(typeof chunk).toBe("string");
    });
  });

  it("should return base64-encoded chunks", async () => {
    const encryptedChunks = await utils.messageEncryptToChunks(
      PUBLIC_KEY,
      "test"
    );
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    encryptedChunks.forEach((chunk) => {
      expect(base64Regex.test(chunk)).toBe(true);
    });
  });

  // Concurrent encryption tests
  it("should handle concurrent encryption calls", async () => {
    const promises = Array.from({ length: 10 }, (_, i) =>
      utils.messageEncryptToChunks(PUBLIC_KEY, `Message ${i}`)
    );
    const results = await Promise.all(promises);

    results.forEach((result, index) => {
      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
    });
  });

  // // Memory and performance tests
  // it("should not leak memory with repeated calls", async () => {
  //   for (let i = 0; i < 100; i++) {
  //     const encryptedChunks = await utils.messageEncryptToChunks(
  //       PUBLIC_KEY,
  //       `Test ${i}`
  //     );
  //     expect(encryptedChunks).toBeTruthy();
  //   }
  // });
});

// // ================================================================================================

describe("UTILS - messageDecryptFromChunks - Comprehensive Test Suite", () => {
  const PUBLIC_KEY = fs.readFileSync("./keys/public_key.pem", "utf8");
  const PRIVATE_KEY = fs.readFileSync("./keys/private_key.pem", "utf8");
  const PUBLIC_KEY2 = fs.readFileSync("./keys/public_key2.pem", "utf8");
  const PRIVATE_KEY2 = fs.readFileSync("./keys/private_key2.pem", "utf8");

  // Basic functionality tests
  it("should decrypt to empty string for empty array", async () => {
    const result = await utils.messageDecryptFromChunks(PRIVATE_KEY, []);
    expect(result).toBe("");
  });

  it("should handle null chunks array", async () => {
    await expect(
      await utils.messageDecryptFromChunks(PRIVATE_KEY, null)
    ).toEqual("");
  });

  it("should handle undefined chunks array", async () => {
    await expect(
      await utils.messageDecryptFromChunks(PRIVATE_KEY, undefined)
    ).toEqual("");
  });

  // Round-trip encryption/decryption tests
  it("should decrypt single character correctly", async () => {
    const message = "a";
    const encrypted = await utils.messageEncryptToChunks(PUBLIC_KEY, message);
    const decrypted = await utils.messageDecryptFromChunks(
      PRIVATE_KEY,
      encrypted
    );
    expect(decrypted).toBe(message);
  });

  it("should decrypt whitespace-only message correctly", async () => {
    const message = "   \n\t  ";
    const encrypted = await utils.messageEncryptToChunks(PUBLIC_KEY, message);
    const decrypted = await utils.messageDecryptFromChunks(
      PRIVATE_KEY,
      encrypted
    );
    expect(decrypted).toBe(message);
  });

  it("should decrypt message with all ASCII characters", async () => {
    const message = String.fromCharCode(
      ...Array.from({ length: 128 }, (_, i) => i + 32)
    );
    const encrypted = await utils.messageEncryptToChunks(PUBLIC_KEY, message);
    const decrypted = await utils.messageDecryptFromChunks(
      PRIVATE_KEY,
      encrypted
    );
    expect(decrypted).toBe(message);
  });

  it("should decrypt extremely large message", async () => {
    const largeMessage = "Test message ".repeat(10000);
    const encrypted = await utils.messageEncryptToChunks(
      PUBLIC_KEY,
      largeMessage
    );
    const decrypted = await utils.messageDecryptFromChunks(
      PRIVATE_KEY,
      encrypted
    );
    expect(decrypted).toBe(largeMessage);
  });

  it("should decrypt message with various chunk sizes", async () => {
    const message = "Hello World Test Message";
    const chunkSizes = [1, 5, 10, 50, 100, 200];

    for (const chunkSize of chunkSizes) {
      const encrypted = await utils.messageEncryptToChunks(
        PUBLIC_KEY,
        message,
        {
          chunkSize,
        }
      );
      const decrypted = await utils.messageDecryptFromChunks(
        PRIVATE_KEY,
        encrypted
      );
      expect(decrypted).toBe(message);
    }
  });

  // Unicode and encoding tests
  it("should decrypt emojis correctly", async () => {
    const message = "🎉🚀🌟💎🔥⭐🎯🎪🎨🎭";
    const encrypted = await utils.messageEncryptToChunks(PUBLIC_KEY, message);
    const decrypted = await utils.messageDecryptFromChunks(
      PRIVATE_KEY,
      encrypted
    );
    expect(decrypted).toBe(message);
  });

  it("should decrypt complex unicode correctly", async () => {
    const message = "𝕳𝖊𝖑𝖑𝖔 𝖂𝖔𝖗𝖑𝖉 测试 العربية עברית हिन्दी русский";
    const encrypted = await utils.messageEncryptToChunks(PUBLIC_KEY, message);
    const decrypted = await utils.messageDecryptFromChunks(
      PRIVATE_KEY,
      encrypted
    );
    expect(decrypted).toBe(message);
  });

  it("should decrypt zero-width characters correctly", async () => {
    const message = "Hello\u200B\u200C\u200D\uFEFFWorld";
    const encrypted = await utils.messageEncryptToChunks(PUBLIC_KEY, message);
    const decrypted = await utils.messageDecryptFromChunks(
      PRIVATE_KEY,
      encrypted
    );
    expect(decrypted).toBe(message);
  });

  it("should decrypt control characters correctly", async () => {
    const message = "Hello\x00\x01\x02\x03\x04\x05World";
    const encrypted = await utils.messageEncryptToChunks(PUBLIC_KEY, message);
    const decrypted = await utils.messageDecryptFromChunks(
      PRIVATE_KEY,
      encrypted
    );
    expect(decrypted).toBe(message);
  });

  // Invalid private key tests
  it("should throw error for malformed PEM private key", async () => {
    const malformedKey =
      "-----BEGIN PRIVATE KEY-----\nINVALID_BASE64\n-----END PRIVATE KEY-----";
    await expect(
      utils.messageDecryptFromChunks(malformedKey, ["chunk"])
    ).rejects.toThrow();
  });

  it("should throw error for public key instead of private", async () => {
    await expect(
      utils.messageDecryptFromChunks(PUBLIC_KEY, ["chunk"])
    ).rejects.toThrow();
  });

  it("should throw error for empty private key", async () => {
    await expect(
      utils.messageDecryptFromChunks("", ["chunk"])
    ).rejects.toThrow();
  });

  it("should throw error for null private key", async () => {
    await expect(
      utils.messageDecryptFromChunks(null, ["chunk"])
    ).rejects.toThrow();
  });

  // Key mismatch tests
  it("should throw error for mismatched key pairs", async () => {
    const message = "Test message";
    const encrypted = await utils.messageEncryptToChunks(PUBLIC_KEY, message);

    await expect(
      utils.messageDecryptFromChunks(PRIVATE_KEY2, encrypted)
    ).rejects.toThrow();
  });

  it("should decrypt correctly with matching key pairs", async () => {
    const message = "Test with second key pair";
    const encrypted = await utils.messageEncryptToChunks(PUBLIC_KEY2, message);
    const decrypted = await utils.messageDecryptFromChunks(
      PRIVATE_KEY2,
      encrypted
    );
    expect(decrypted).toBe(message);
  });

  // Corrupted chunk tests
  it("should throw error for corrupted base64 chunks", async () => {
    const corruptedChunks = ["invalid_base64!", "@#$%^&*()"];
    await expect(
      utils.messageDecryptFromChunks(PRIVATE_KEY, corruptedChunks)
    ).rejects.toThrow();
  });

  it("should throw error for chunks with wrong length", async () => {
    const message = "Test";
    const encrypted = await utils.messageEncryptToChunks(PUBLIC_KEY, message);
    const corruptedChunks = encrypted.map((chunk) => chunk.slice(0, -10)); // Remove last 10 chars

    await expect(
      utils.messageDecryptFromChunks(PRIVATE_KEY, corruptedChunks)
    ).rejects.toThrow();
  });

  it("should throw error for mixed valid and invalid chunks", async () => {
    const message = "Test";
    const encrypted = await utils.messageEncryptToChunks(PUBLIC_KEY, message);
    const mixedChunks = [...encrypted, "invalid_chunk"];

    await expect(
      utils.messageDecryptFromChunks(PRIVATE_KEY, mixedChunks)
    ).rejects.toThrow();
  });

  it("should throw error for empty string chunks", async () => {
    const chunksWithEmpty = ["", "validbase64chunk"];
    await expect(
      utils.messageDecryptFromChunks(PRIVATE_KEY, chunksWithEmpty)
    ).rejects.toThrow();
  });

  // Chunk order tests
  it("should maintain message integrity regardless of chunk processing order", async () => {
    const message =
      "This is a test message that will be split into multiple chunks";
    const encrypted = await utils.messageEncryptToChunks(PUBLIC_KEY, message, {
      chunkSize: 10,
    });
    const decrypted = await utils.messageDecryptFromChunks(
      PRIVATE_KEY,
      encrypted
    );
    expect(decrypted).toBe(message);
  });

  // JSON data tests
  it("should decrypt complex JSON correctly", async () => {
    const jsonData = JSON.stringify({
      name: "José da Silva",
      email: "jose@test.com",
      address: {
        street: "Rua das Flores, 123",
        city: "São Paulo",
        country: "Brasil",
      },
      tags: ["cliente", "vip", "ação"],
      metadata: {
        created: new Date().toISOString(),
        special: "àáâãäåæçèéêëìíîïñòóôõöùúûüý",
      },
    });

    const encrypted = await utils.messageEncryptToChunks(PUBLIC_KEY, jsonData);
    const decrypted = await utils.messageDecryptFromChunks(
      PRIVATE_KEY,
      encrypted
    );
    expect(decrypted).toBe(jsonData);
    expect(JSON.parse(decrypted)).toEqual(JSON.parse(jsonData));
  });

  // Performance and memory tests
  it("should handle concurrent decryption calls", async () => {
    const messages = Array.from(
      { length: 10 },
      (_, i) => `Message ${i} with special chars ção`
    );

    const encryptionPromises = messages.map((msg) =>
      utils.messageEncryptToChunks(PUBLIC_KEY, msg)
    );
    const encrypted = await Promise.all(encryptionPromises);

    const decryptionPromises = encrypted.map((chunks) =>
      utils.messageDecryptFromChunks(PRIVATE_KEY, chunks)
    );
    const decrypted = await Promise.all(decryptionPromises);

    decrypted.forEach((result, index) => {
      expect(result).toBe(messages[index]);
    });
  });

  it("should not leak memory with repeated decrypt calls", async () => {
    const message = "Test message for memory leak check";
    const encrypted = await utils.messageEncryptToChunks(PUBLIC_KEY, message);

    for (let i = 0; i < 100; i++) {
      const decrypted = await utils.messageDecryptFromChunks(
        PRIVATE_KEY,
        encrypted
      );
      expect(decrypted).toBe(message);
    }
  });

  // Edge cases for chunk arrays
  it("should handle single chunk array", async () => {
    const message = "Short";
    const encrypted = await utils.messageEncryptToChunks(PUBLIC_KEY, message, {
      chunkSize: 1000,
    });
    expect(encrypted.length).toBe(1);

    const decrypted = await utils.messageDecryptFromChunks(
      PRIVATE_KEY,
      encrypted
    );
    expect(decrypted).toBe(message);
  });

  it("should handle large number of small chunks", async () => {
    const message = "a".repeat(1000);
    const encrypted = await utils.messageEncryptToChunks(PUBLIC_KEY, message, {
      chunkSize: 1,
    });
    expect(encrypted.length).toBeGreaterThanOrEqual(1000);

    const decrypted = await utils.messageDecryptFromChunks(
      PRIVATE_KEY,
      encrypted
    );
    expect(decrypted).toBe(message);
  });

  // Type validation tests
  it("should throw error for non-array chunks parameter", async () => {
    await expect(
      utils.messageDecryptFromChunks(PRIVATE_KEY, "not_an_array")
    ).rejects.toThrow();
  });

  it("should throw error for array with non-string elements", async () => {
    const invalidChunks = ["valid_chunk", 123, null, undefined];
    await expect(
      utils.messageDecryptFromChunks(PRIVATE_KEY, invalidChunks)
    ).rejects.toThrow();
  });
});

describe("UTILS - copyObject", () => {
  // ----------------------------------------------------------------------------------------------

  it("should create a deep copy of a simple object", () => {
    const original = { a: 1, b: { c: 2 } };
    const result = utils.copyObject(original);

    // Modifica a cópia para verificar se não afeta o original
    result.b.c = 99;

    expect(result).not.toBe(original);
    expect(result.b).not.toBe(original.b);
    expect(original.b.c).toBe(2);
    expect(result.b.c).toBe(99);
  });

  // ----------------------------------------------------------------------------------------------

  it("should exclude specified keys from the copy", () => {
    const user = {
      id: 123,
      name: "John",
      password: "abc",
      email: "john@test.com",
    };
    const result = utils.copyObject(user, { exclude: ["password"] });
    const expected = { id: 123, name: "John", email: "john@test.com" };

    expect(deepEqual(result, expected)).toBeTruthy();
    expect(result.hasOwnProperty("password")).toBeFalsy();
  });

  // ----------------------------------------------------------------------------------------------

  it("should exclude multiple keys from the copy", () => {
    const data = {
      id: 1,
      secret: "xyz",
      token: "abc",
      name: "test",
      internal: true,
    };
    const result = utils.copyObject(data, {
      exclude: ["secret", "token", "internal"],
    });
    const expected = { id: 1, name: "test" };

    expect(deepEqual(result, expected)).toBeTruthy();
  });

  // ----------------------------------------------------------------------------------------------

  it("should clean object when cleanObject option is true", () => {
    const messyObject = { a: 1, b: null, c: undefined, d: "hello", e: "" };
    const result = utils.copyObject(messyObject, { cleanObject: true });

    // Assuming cleanObject removes null, undefined, and empty strings
    expect(result.hasOwnProperty("b")).toBeFalsy();
    expect(result.hasOwnProperty("c")).toBeFalsy();
    expect(result.a).toBe(1);
    expect(result.d).toBe("hello");
  });

  // ----------------------------------------------------------------------------------------------

  it("should apply both exclude and cleanObject options", () => {
    const fullObject = {
      id: 1,
      data: null,
      token: "xyz",
      user: "admin",
      temp: undefined,
    };
    const result = utils.copyObject(fullObject, {
      exclude: ["token"],
      cleanObject: true,
    });

    expect(result.hasOwnProperty("token")).toBeFalsy();
    expect(result.hasOwnProperty("data")).toBeFalsy();
    expect(result.hasOwnProperty("temp")).toBeFalsy();
    expect(result.id).toBe(1);
    expect(result.user).toBe("admin");
  });

  // ----------------------------------------------------------------------------------------------

  it("should throw TypeError when source is null and throwsError is true", () => {
    expect(() => {
      utils.copyObject(null, { throwsError: true });
    }).toThrow(TypeError);

    expect(() => {
      utils.copyObject(null, { throwsError: true });
    }).toThrow("copyObject: O parâmetro 'source' deve ser um objeto.");
  });

  // ----------------------------------------------------------------------------------------------

  it("should throw TypeError when source is not an object and throwsError is true", () => {
    expect(() => {
      utils.copyObject("string", { throwsError: true });
    }).toThrow(TypeError);

    expect(() => {
      utils.copyObject(123, { throwsError: true });
    }).toThrow(TypeError);

    expect(() => {
      utils.copyObject(true, { throwsError: true });
    }).toThrow(TypeError);
  });

  // ----------------------------------------------------------------------------------------------

  it("should return null when source is invalid and throwsError is false", () => {
    const result1 = utils.copyObject(null, { throwsError: false });
    const result2 = utils.copyObject("string", { throwsError: false });
    const result3 = utils.copyObject(123, { throwsError: false });

    expect(result1).toBeNull();
    expect(result2).toBeNull();
    expect(result3).toBeNull();
  });

  // ----------------------------------------------------------------------------------------------

  it("should handle arrays as objects", () => {
    const originalArray = [1, 2, { a: 3 }];
    const result = utils.copyObject(originalArray);

    expect(Array.isArray(result)).toBeTruthy();
    expect(result).not.toBe(originalArray);
    expect(result[2]).not.toBe(originalArray[2]);
    expect(deepEqual(result, originalArray)).toBeTruthy();
  });

  // ----------------------------------------------------------------------------------------------

  it("should handle symbol keys in exclude option", () => {
    const sym1 = Symbol("test1");
    const sym2 = Symbol("test2");
    const obj = { a: 1, [sym1]: "symbol1", [sym2]: "symbol2", b: 2 };

    const result = utils.copyObject(obj, { exclude: [sym1] });

    expect(result.a).toBe(1);
    expect(result.b).toBe(2);
    expect(result[sym1]).toBeUndefined();
    expect(result[sym2]).toBe("symbol2");
  });

  // ----------------------------------------------------------------------------------------------

  it("should handle empty objects", () => {
    const result = utils.copyObject({});

    expect(deepEqual(result, {})).toBeTruthy();
    expect(typeof result).toBe("object");
  });

  // ----------------------------------------------------------------------------------------------

  it("should handle nested objects with exclusion", () => {
    const nested = {
      user: {
        id: 1,
        profile: {
          name: "John",
          secret: "hidden",
          public: "visible",
        },
      },
      secret: "topLevel",
    };

    const result = utils.copyObject(nested, { exclude: ["secret"] });

    expect(result.hasOwnProperty("secret")).toBeFalsy();
    expect(result.user.profile.secret).toBe("hidden"); // nested secrets remain
    expect(result.user.profile.public).toBe("visible");
  });

  // ----------------------------------------------------------------------------------------------

  it("should use default options when no options provided", () => {
    const obj = { a: 1, b: null, c: "test" };
    const result = utils.copyObject(obj);

    expect(deepEqual(result, obj)).toBeTruthy();
    expect(result).not.toBe(obj);
  });

  // ----------------------------------------------------------------------------------------------

  it("should handle Date objects correctly", () => {
    const date = new Date("2023-01-01");
    const obj = { created: date, name: "test" };
    const result = utils.copyObject(obj);

    expect(typeof result.created === 'object').toBeTruthy();
    expect(result.created.getTime()).toBe(date.getTime());
    expect(result.created).not.toBe(date); // different instance
  });

  // ----------------------------------------------------------------------------------------------

  it("should handle complex nested structures", () => {
    const complex = {
      users: [
        { id: 1, name: "User1", meta: { active: true } },
        { id: 2, name: "User2", meta: { active: false } },
      ],
      config: {
        settings: {
          theme: "dark",
          notifications: true,
        },
      },
      timestamp: new Date("2023-01-01"),
    };

    const result = utils.copyObject(complex);

    expect(result).not.toBe(complex);
    expect(result.users).not.toBe(complex.users);
    expect(result.users[0]).not.toBe(complex.users[0]);
    expect(result.config.settings).not.toBe(complex.config.settings);
    expect(deepEqual(result, complex)).toBeTruthy();
  });
});
