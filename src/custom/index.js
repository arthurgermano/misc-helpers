module.exports = {
  db: require("./db/sequelize/"),
  waitPlugin: require("./waitPlugin.js"),
  bulkProcessor: require("./bulkProcessor.js"),
};
