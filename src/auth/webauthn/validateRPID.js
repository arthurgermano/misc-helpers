/**
 * @file Módulo para validação de RPID (Relying Party ID) usando dependências específicas.
 */

// Importa as utilidades necessárias de outros módulos.
// A responsabilidade pela implementação de baixo nível é delegada a essas funções.
import base64ToBuffer from "../../utils/base64ToBuffer";
import bufferCompare from "../../utils/bufferCompare";
import bufferFromString from "../../utils/bufferFromString";
import getCrypto from "../../crypto/getCrypto.js";

// ------------------------------------------------------------------------------------------------
/**
 * Valida de forma assíncrona que o RPID original corresponde ao RPID de verificação após a aplicação de um hash.
 * Esta função orquestra chamadas a utilitários criptográficos e de buffer para realizar a validação.
 *
 * @param {string} originalRPID - O identificador RPID original (string UTF-8) a ser validado.
 * @param {string} verifyRPID - A representação em Base64 do RPID a ser verificado. Espera-se que contenha o hash do RPID original.
 * @param {string} [algorithm="SHA-256"] - O algoritmo de hash a ser usado. Deve ser compatível com a implementação de `getCrypto`.
 * @returns {Promise<boolean>} Retorna uma promessa que resolve para `true` se os RPIDs corresponderem.
 * @throws {Error} Lança um erro se `originalRPID` ou `verifyRPID` não forem fornecidos, ou se os RPIDs não corresponderem.
 */
async function validateRPID(originalRPID, verifyRPID, algorithm = "SHA-256") {
  // 1. Validação dos Parâmetros de Entrada
  // Garante que os argumentos essenciais foram fornecidos antes de qualquer processamento.
  if (!originalRPID || typeof originalRPID !== "string") {
    throw new Error("originalRPID is required");
  }
  originalRPID = originalRPID.trim();
  if (!originalRPID) {
    throw new Error("originalRPID is required");
  }

  if (!verifyRPID || typeof verifyRPID !== "string") {
    throw new Error("verifyRPID is required");
  }

  verifyRPID = verifyRPID.trim();
  if (!verifyRPID) {
    throw new Error("verifyRPID is required");
  }

  // 2. Preparação para o Hashing
  // Obtém a interface de criptografia do ambiente (Node.js ou navegador) através do utilitário.
  const crypto = getCrypto();
  // Converte a string do RPID original em um formato de buffer, que é o tipo de entrada
  // esperado pela API de criptografia para a operação de digest.
  const originalRPIDBuffer = bufferFromString(originalRPID);

  // 3. Geração do Hash
  // Calcula o hash do buffer do RPID original usando o algoritmo especificado.
  // A operação `digest` é assíncrona e retorna o hash resultante (geralmente como um ArrayBuffer).
  const digestOfOriginalRPID = await crypto.subtle.digest(
    algorithm,
    originalRPIDBuffer
  );

  // 4. Decodificação e Extração do Hash de Verificação
  // Decodifica a string base64 `verifyRPID` para seu formato de buffer correspondente.
  const verifyRPIDBuffer = base64ToBuffer(verifyRPID);
  // Extrai os primeiros 32 bytes do buffer decodificado. Este segmento é assumido
  // como sendo o hash a ser comparado (consistente com o tamanho de um hash SHA-256).
  const digestToVerify = verifyRPIDBuffer.slice(0, 32);

  // 5. Comparação Segura
  // Compara o hash recém-gerado com o hash extraído do parâmetro de verificação.
  // É crucial que `bufferCompare` implemente uma comparação segura contra ataques de temporização.
  const areDigestsEqual = bufferCompare(digestOfOriginalRPID, digestToVerify);

  if (!areDigestsEqual) {
    // Se a comparação falhar, lança um erro específico para indicar a incompatibilidade.
    throw new Error(
      `Registration RPID does not match the authentication RPID.`
    );
  }

  // Se a comparação for bem-sucedida, a validação está completa.
  return true;
}

// ------------------------------------------------------------------------------------------------

/**
 * Exporta a função `validateRPID` para uso em módulos CommonJS (padrão do Node.js).
 */
export default validateRPID;

// ------------------------------------------------------------------------------------------------
