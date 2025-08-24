// 1. Define a estrutura aninhada principal, que será a exportação padrão.
const miscHelpers = {
  auth: {
    webAuthn: require("./auth/webauthn/index.js"),
  },
  constants: require("./constants.js"),
  crypto: require("./crypto/index.js"),
  custom: {
    db: {
      sequelize: {
        setConditionBetweenDates: require("./custom/db/sequelize/setConditionsBetweenDates.js"),
        setConditionBetweenValues: require("./custom/db/sequelize/setConditionsBetweenValues.js"),
        setConditionStringLike: require("./custom/db/sequelize/setConditionStringLike.js"),
      },
    },
    waitPlugin: require("./custom/waitPlugin"),
    bulkProcessor: require("./custom/bulkProcessor.js"),
  },
  helpers: require("./helpers/index.js"),
  utils: require("./utils/index.js"),
  validators: require("./validators/index.js"),
};

// 2. Anexa as funções de nível superior ao objeto principal para acesso direto.
Object.assign(miscHelpers, miscHelpers.helpers);
Object.assign(miscHelpers, miscHelpers.utils);
Object.assign(miscHelpers, miscHelpers.validators);
Object.assign(miscHelpers, miscHelpers.crypto);
miscHelpers.bulkProcessor = miscHelpers.custom.bulkProcessor;
miscHelpers.waitPlugin = miscHelpers.custom.waitPlugin;

// Isso copia todas as propriedades de `miscHelpers` para `module.exports`,
// criando tanto as exportações nomeadas quanto a padrão.
Object.assign(module.exports, miscHelpers);
