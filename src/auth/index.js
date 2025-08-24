import webauthn from "./webauthn/index.js";

// Re-export todas as funções WebAuthn individualmente
export * from "./webauthn/index.js";

// Named export do módulo webauthn
export { webauthn };

// Default export para compatibilidade com estrutura principal
export default {
  webAuthn: webauthn, // Mantém consistência com index principal
};