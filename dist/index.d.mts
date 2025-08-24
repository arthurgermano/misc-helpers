// src/index.js (Versão Final e Explícita)

// 1. Importa todas as suas sub-bibliotecas
const auth = { webAuthn: require("./auth/webauthn/index.js") };
const constants = require("./constants.js");
const crypto = require("./crypto/index.js");
const helpers = require("./helpers/index.js");
const utils = require("./utils/index.js");
const validators = require("./validators/index.js");
const custom = {
  db: {
    sequelize: {
      setConditionBetweenDates: require("./custom/db/sequelize/setConditionsBetweenDates.js"),
      setConditionBetweenValues: require("./custom/db/sequelize/setConditionsBetweenValues.js"),
      setConditionStringLike: require("./custom/db/sequelize/setConditionStringLike.js"),
    },
  },
  waitPlugin: require("./custom/waitPlugin"),
  bulkProcessor: require("./custom/bulkProcessor.js"),
};

// 2. Exporta um único objeto que contém TUDO
// As funções de nível superior são espalhadas (spread) aqui,
// o que torna explícito para o `tsup` que elas são exportações nomeadas.
module.exports = {
  // Funções de acesso direto
  ...helpers,
  ...utils,
  ...validators,
  ...crypto,
  bulkProcessor: custom.bulkProcessor,
  waitPlugin: custom.waitPlugin,

  // Estrutura aninhada para acesso organizado
  auth,
  constants,
  crypto,
  custom,
  helpers,
  utils,
  validators,
};
