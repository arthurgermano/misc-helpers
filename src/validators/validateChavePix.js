/**
 * @fileoverview Fornece uma função para validar Chaves PIX.
 * @author Seu Nome <seu.email@example.com>
 * @version 2.5.0
 */

const validateCNPJ = require("./validateCNPJ");
const validateCPF = require("./validateCPF");
const validateEmail = require("./validateEmail");

/**
 * Regex para validar um UUID v4 (formato da Chave Aleatória PIX).
 * @private
 */
const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Regex para validar um número de telefone brasileiro no formato PIX (+55DDXXXXXXXXX).
 * @private
 */
// Versão Oficial: Aceita 10 (fixo) ou 11 (celular) dígitos após o +55.
const PIX_PHONE_REGEX = /^\+55\d{10,11}$/;

/**
 * @summary Valida uma Chave PIX de qualquer tipo, incluindo CNPJ alfanumérico.
 * @description
 * A função verifica se a chave fornecida corresponde a um dos cinco formatos
 * válidos de Chave PIX, delegando a validação de CPF, CNPJ e E-mail para as
 * funções correspondentes.
 *
 * @param {string} [chave=""] - A Chave PIX a ser validada.
 * @returns {boolean} Retorna `true` se a chave for válida, e `false` caso contrário.
 *
 * @example
 * validateChavePix("meu.email@valido.com"); // true
 * validateChavePix("11122233344");         // true (se for um CPF válido)
 * validateChavePix("+5511987654321");      // true (celular)
 * validateChavePix("+554133334444");       // true (fixo)
 */
function validateChavePix(chave = "") {
  // Converte a entrada para string e remove espaços das pontas.
  const keyAsString = String(chave || "").trim();

  // Uma chave PIX não pode ser vazia.
  if (keyAsString === "") {
    return false;
  }

  // A ordem de verificação é importante para performance e para evitar ambiguidades.
  if (UUID_V4_REGEX.test(keyAsString)) return true;
  if (PIX_PHONE_REGEX.test(keyAsString)) return true;
  if (keyAsString.includes("@")) return validateEmail(keyAsString);
  
  // Para os formatos restantes (CPF/CNPJ), delega a validação.
  if (validateCPF(keyAsString)) {
    return true;
  }
  
  if (validateCNPJ(keyAsString)) {
    return true;
  }

  // Se não se encaixou em nenhum formato, é inválida.
  return false;
}

// ------------------------------------------------------------------------------------------------
module.exports = validateChavePix;