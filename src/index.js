// src/index.js

// --- PASSO 1: Exportações Nomeadas para Funções Individuais ---
// Re-exporta todas as funções de cada sub-módulo.
// Isso garante que `import { assign, validateCPF } from 'misc-helpers'` funcione.
export * from "./helpers/index.js";
export * from "./utils/index.js";
export * from "./validators/index.js";
export * from "./crypto/index.js";
export * from "./auth/webauthn/index.js";
export * from "./custom/db/sequelize/index.js";
export { default as bulkProcessor } from "./custom/bulkProcessor.js";
export { default as waitPlugin } from "./custom/waitPlugin.js";

// --- PASSO 2: Exportações Nomeadas para Categorias ---
// Importa cada categoria e a exporta como um objeto nomeado.
// Isso garante que `import { custom, helpers } from 'misc-helpers'` funcione.
import * as authNamespace from "./auth/webauthn/index.js";
import * as constantsNamespace from "./constants.js";
import * as cryptoNamespace from "./crypto/index.js";
import * as customNamespace from "./custom/index.js";
import * as helpersNamespace from "./helpers/index.js";
import * as utilsNamespace from "./utils/index.js";
import * as validatorsNamespace from "./validators/index.js";

export const auth = { webAuthn: authNamespace };
export const constants = constantsNamespace;
export const crypto = cryptoNamespace;
export const custom = {
  db: {
    sequelize: {
      ...customNamespace.db,
    },
  },
  waitPlugin: customNamespace.waitPlugin,
  bulkProcessor: customNamespace.bulkProcessor,
};
export const helpers = helpersNamespace;
export const utils = utilsNamespace;
export const validators = validatorsNamespace;

// --- PASSO 3: Exportação Padrão (Default) ---
// Agrupa tudo em um único objeto para a exportação padrão.
// Isso garante que `import miscHelpers from 'misc-helpers'` funcione.
const miscHelpers = {
  auth: authNamespace,
  constants: constantsNamespace,
  crypto: cryptoNamespace,
  custom: customNamespace,
  helpers: helpersNamespace,
  utils: utilsNamespace,
  validators: validatorsNamespace,
};

export default miscHelpers;