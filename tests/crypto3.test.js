// tests/crypto3.test.js
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { getCrypto, setCrypto } from "../src/index.js";

// ------------------------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------------------------

/**
 * Builds a minimal mock crypto object that satisfies both the Web Crypto API
 * and Node.js native crypto surfaces expected by getCrypto consumers.
 */
function buildMockCrypto(overrides = {}) {
  return {
    subtle: {
      encrypt: vi.fn(),
      decrypt: vi.fn(),
      digest: vi.fn(),
      importKey: vi.fn(),
      exportKey: vi.fn(),
      generateKey: vi.fn(),
      sign: vi.fn(),
      verify: vi.fn(),
    },
    getRandomValues: vi.fn(),
    createHash: vi.fn(), // Node.js surface — used to assert correct module was returned
    ...overrides,
  };
}

// ------------------------------------------------------------------------------------------------

describe("setCrypto - input validation", () => {
  // Always reset injection before and after every test to avoid state leaking between suites.
  // _injectedCrypto is module-level shared state — isolation is critical here.
  beforeEach(() => setCrypto(null));
  afterEach(() => setCrypto(null));

  // --------------------------------------------------------------------------------------------
  // Valid inputs

  it("should accept a valid object without throwing", () => {
    const mockCrypto = buildMockCrypto();
    expect(() => setCrypto(mockCrypto)).not.toThrow();
  });

  it("should accept null explicitly (reset intent)", () => {
    expect(() => setCrypto(null)).not.toThrow();
  });

  it("should accept a plain empty object (minimal valid shape)", () => {
    expect(() => setCrypto({})).not.toThrow();
  });

  it("should accept a deeply nested object", () => {
    const deepObject = { subtle: { nested: { fn: vi.fn() } } };
    expect(() => setCrypto(deepObject)).not.toThrow();
  });

  it("should accept arrays (typeof object) without throwing", () => {
    // Arrays pass the typeof === 'object' check — behaviour is intentional per implementation
    expect(() => setCrypto([])).not.toThrow();
  });

  // --------------------------------------------------------------------------------------------
  // Primitive rejection — every non-null primitive must throw

  it("should throw when receiving a string", () => {
    expect(() => setCrypto("crypto")).toThrow(
      /expected a crypto module object or null/i,
    );
  });

  it("should throw when receiving a number", () => {
    expect(() => setCrypto(42)).toThrow(
      /expected a crypto module object or null/i,
    );
  });

  it("should throw when receiving zero", () => {
    expect(() => setCrypto(0)).toThrow(
      /expected a crypto module object or null/i,
    );
  });

  it("should throw when receiving boolean true", () => {
    expect(() => setCrypto(true)).toThrow(
      /expected a crypto module object or null/i,
    );
  });

  it("should throw when receiving boolean false", () => {
    expect(() => setCrypto(false)).toThrow(
      /expected a crypto module object or null/i,
    );
  });

  it("should throw when receiving a Symbol", () => {
    expect(() => setCrypto(Symbol("crypto"))).toThrow(
      /expected a crypto module object or null/i,
    );
  });

  it("should throw when receiving undefined", () => {
    // undefined is typeof "undefined" — neither a non-null object nor null
    expect(() => setCrypto(undefined)).toThrow(
      /expected a crypto module object or null/i,
    );
  });

  it("should throw when receiving a BigInt", () => {
    expect(() => setCrypto(BigInt(1))).toThrow(
      /expected a crypto module object or null/i,
    );
  });

  it("should throw when receiving a function", () => {
    // typeof function !== "object" — must be rejected
    expect(() => setCrypto(() => {})).toThrow(
      /expected a crypto module object or null/i,
    );
  });
});

// ------------------------------------------------------------------------------------------------

describe("setCrypto - error message contract", () => {
  beforeEach(() => setCrypto(null));
  afterEach(() => setCrypto(null));

  it("error message must mention 'crypto module object or null'", () => {
    expect(() => setCrypto("bad")).toThrow(/crypto module object or null/i);
  });

  it("error message must include the received type for string", () => {
    expect(() => setCrypto("bad")).toThrow(/string/i);
  });

  it("error message must include the received type for number", () => {
    expect(() => setCrypto(99)).toThrow(/number/i);
  });

  it("error message must include the received type for boolean", () => {
    expect(() => setCrypto(true)).toThrow(/boolean/i);
  });

  it("thrown value must be an instance of Error", () => {
    let caught;
    try {
      setCrypto("invalid");
    } catch (err) {
      caught = err;
    }
    expect(caught).toBeInstanceOf(Error);
  });
});

// ------------------------------------------------------------------------------------------------

describe("setCrypto - injection lifecycle", () => {
  beforeEach(() => setCrypto(null));
  afterEach(() => setCrypto(null));

  // --------------------------------------------------------------------------------------------

  it("should make getCrypto return the injected module immediately after setCrypto", () => {
    const mockCrypto = buildMockCrypto();
    setCrypto(mockCrypto);
    expect(getCrypto()).toBe(mockCrypto);
  });

  it("should override a previous injection with a new one", () => {
    const first = buildMockCrypto({ id: "first" });
    const second = buildMockCrypto({ id: "second" });

    setCrypto(first);
    expect(getCrypto()).toBe(first);

    setCrypto(second);
    expect(getCrypto()).toBe(second);
  });

  it("should allow the same module to be injected multiple times idempotently", () => {
    const mockCrypto = buildMockCrypto();

    setCrypto(mockCrypto);
    setCrypto(mockCrypto);

    expect(getCrypto()).toBe(mockCrypto);
  });

  it("should restore automatic detection after setCrypto(null)", () => {
    const mockCrypto = buildMockCrypto();

    setCrypto(mockCrypto);
    expect(getCrypto()).toBe(mockCrypto);

    setCrypto(null);

    // After reset, getCrypto must NOT return the old mock anymore
    expect(getCrypto()).not.toBe(mockCrypto);
  });

  it("should allow re-injection after a null reset", () => {
    const first = buildMockCrypto({ label: "first" });
    const second = buildMockCrypto({ label: "second" });

    setCrypto(first);
    setCrypto(null);
    setCrypto(second);

    expect(getCrypto()).toBe(second);
  });

  it("should not retain reference to cleared module after null reset", () => {
    const mockCrypto = buildMockCrypto();

    setCrypto(mockCrypto);
    setCrypto(null);

    const result = getCrypto();

    expect(result).not.toBe(mockCrypto);
    expect(result).toBeDefined(); // Must still resolve to something (Node.js native)
  });
});

// ------------------------------------------------------------------------------------------------

describe("_injectedCrypto priority — injected vs environment detection", () => {
  let originalWindow;

  beforeEach(() => {
    originalWindow = global.window;
    setCrypto(null);
  });

  afterEach(() => {
    global.window = originalWindow;
    setCrypto(null);
  });

  // --------------------------------------------------------------------------------------------

  it("should return injected module even when window.crypto is present (injection wins)", () => {
    const injected = buildMockCrypto({ source: "injected" });
    const browserCrypto = buildMockCrypto({ source: "window" });

    global.window = { crypto: browserCrypto };
    setCrypto(injected);

    const result = getCrypto();

    expect(result).toBe(injected);
    expect(result).not.toBe(browserCrypto);
  });

  it("should return injected module even when window.crypto has subtle defined", () => {
    const injected = buildMockCrypto();

    global.window = {
      crypto: {
        subtle: { digest: vi.fn() },
        getRandomValues: vi.fn(),
      },
    };

    setCrypto(injected);

    expect(getCrypto()).toBe(injected);
  });

  it("should fall through to window.crypto when injection is null and window exists", () => {
    const browserCrypto = buildMockCrypto({ source: "window" });
    global.window = { crypto: browserCrypto };

    setCrypto(null); // ensure no injection

    expect(getCrypto()).toBe(browserCrypto);
  });

  it("should fall through to Node.js module when injection is null and window is absent", () => {
    delete global.window;

    setCrypto(null);

    const result = getCrypto();

    // Node.js native crypto exposes createHash
    expect(result.createHash).toBeDefined();
  });

  it("should return injected module with priority over Node.js crypto when window is absent", () => {
    delete global.window;

    const injected = buildMockCrypto({ source: "injected" });
    setCrypto(injected);

    expect(getCrypto()).toBe(injected);
    expect(getCrypto().source).toBe("injected");
  });

  it("injected module should expose expected Web Crypto interface (subtle)", () => {
    const injected = buildMockCrypto();
    setCrypto(injected);

    const result = getCrypto();

    expect(result.subtle).toBeDefined();
    expect(result.subtle.encrypt).toBeInstanceOf(Function);
    expect(result.subtle.digest).toBeInstanceOf(Function);
  });

  it("injected module should expose expected Node.js interface (createHash)", () => {
    const injected = buildMockCrypto();
    setCrypto(injected);

    const result = getCrypto();

    expect(result.createHash).toBeInstanceOf(Function);
  });
});

// ------------------------------------------------------------------------------------------------

describe("getCrypto - referential stability with injection", () => {
  beforeEach(() => setCrypto(null));
  afterEach(() => setCrypto(null));

  it("should return the exact same reference on consecutive calls with injection", () => {
    const mockCrypto = buildMockCrypto();
    setCrypto(mockCrypto);

    const call1 = getCrypto();
    const call2 = getCrypto();
    const call3 = getCrypto();

    expect(call1).toBe(call2);
    expect(call2).toBe(call3);
  });

  it("should return different reference after changing injection", () => {
    const first = buildMockCrypto();
    const second = buildMockCrypto();

    setCrypto(first);
    const resultFirst = getCrypto();

    setCrypto(second);
    const resultSecond = getCrypto();

    expect(resultFirst).toBe(first);
    expect(resultSecond).toBe(second);
    expect(resultFirst).not.toBe(resultSecond);
  });
});

// ------------------------------------------------------------------------------------------------

describe("setCrypto + getCrypto - sequential safety", () => {
  beforeEach(() => setCrypto(null));
  afterEach(() => setCrypto(null));

  it("should handle rapid sequential inject/reset cycles without errors", () => {
    const mockCrypto = buildMockCrypto();

    expect(() => {
      for (let i = 0; i < 100; i++) {
        setCrypto(mockCrypto);
        setCrypto(null);
      }
    }).not.toThrow();
  });

  it("should reflect only the final state after multiple rapid injections", () => {
    const modules = Array.from({ length: 5 }, (_, i) =>
      buildMockCrypto({ index: i }),
    );

    modules.forEach((mod) => setCrypto(mod));

    // Only the last injected module should survive
    expect(getCrypto()).toBe(modules[modules.length - 1]);
  });

  it("should handle interleaved inject/getCrypto calls correctly", () => {
    const a = buildMockCrypto({ id: "a" });
    const b = buildMockCrypto({ id: "b" });

    setCrypto(a);
    expect(getCrypto()).toBe(a);

    setCrypto(b);
    expect(getCrypto()).toBe(b);

    setCrypto(null);
    const afterReset = getCrypto();
    expect(afterReset).not.toBe(a);
    expect(afterReset).not.toBe(b);

    setCrypto(a);
    expect(getCrypto()).toBe(a);
  });
});

// ------------------------------------------------------------------------------------------------