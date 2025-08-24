// 1. Importa tudo que será exportado.
//    Usamos 'import * as' para agrupar as funções do sequelize em um único objeto 'db'.
import * as db from "./db/sequelize/index.js";
import waitPlugin from "./waitPlugin.js";
import bulkProcessor from "./bulkProcessor.js";

// 2. Exporta cada item como uma exportação nomeada.
//    Isso permite o uso de: import { db, waitPlugin } from '...'
export {
  db,
  waitPlugin,
  bulkProcessor
};

// 3. Agrupa tudo em um objeto e exporta como `default`.
//    Isso permite o uso de: import custom from '...'; custom.waitPlugin
export default {
  db,
  waitPlugin,
  bulkProcessor,
};