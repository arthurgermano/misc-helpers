import toString from "./toString.js";
import regexDigitsOnly from "./regexDigitsOnly";
import { STRING_FORMAT_CNPJ } from "../constants.js";

// ------------------------------------------------------------------------------------------------

/**
 * @file Utilitário para aplicar máscaras de formatação a strings.
 */

/**
 * @summary Aplica uma máscara de formatação a uma string ou valor.
 *
 * @description
 * Esta função formata uma string de entrada de acordo com um padrão (máscara).
 * Os caracteres `#` no padrão são substituídos sequencialmente pelos caracteres
 * da string de entrada. A função pode opcionalmente limpar a entrada para conter
 * apenas dígitos, e também lida com o preenchimento e truncamento da entrada
 * para que ela se ajuste perfeitamente à máscara.
 *
 * @param {*} [text] - O valor a ser formatado. Será convertido para string.
 * @param {string} [pattern=STRING_FORMAT_CNPJ] - A máscara de formatação, onde `#` é um placeholder.
 * @param {object} [options={}] - Opções para customizar o comportamento.
 * @param {boolean} [options.digitsOnly=false] - Se `true`, a string de entrada será primeiro limpa para conter apenas dígitos.
 * @param {string} [options.paddingChar='0'] - O caractere a ser usado para preencher a entrada à esquerda se ela for menor que o necessário.
 *
 * @returns {string} A string formatada com a máscara.
 *
 * @example
 * // Formatar um CNPJ (com limpeza de dígitos)
 * const cnpj = '12.345.678/0001-90';
 * stringToFormat(cnpj, '##.###.###/####-##', { digitsOnly: true });
 * // Retorna: "12.345.678/0001-90"
 *
 * // Formatar um valor com preenchimento à esquerda
 * stringToFormat('123', 'ID-######', { paddingChar: '0' });
 * // Retorna: "ID-000123"
 */
function stringToFormat(
  text,
  pattern = STRING_FORMAT_CNPJ,
  options = {}
) {
  // 1. Define e mescla as opções para um manuseio robusto de parâmetros.
  const finalOptions = {
    digitsOnly: false,
    paddingChar: "0",
    ...options
  };

  let processedText = toString(text);

  // 2. Aplica a limpeza de dígitos opcionalmente.
  if (finalOptions.digitsOnly) {
    processedText = regexDigitsOnly(processedText);
  }

  // 3. Calcula o tamanho necessário com base nos placeholders '#' no padrão.
  const requiredSize = (pattern.match(/#/g) || []).length;
  if (requiredSize === 0) {
      return pattern; // Se não houver placeholders, retorna o padrão literal.
  }

  // 4. Garante que o texto tenha o tamanho exato: trunca se for longo, preenche se for curto.
  processedText = processedText.slice(0, requiredSize).padStart(requiredSize, finalOptions.paddingChar);

  // 5. Aplica a máscara de forma funcional.
  // A cada ocorrência de '#', a função de callback fornece o próximo
  // caractere do texto processado para a substituição.
  let charIndex = 0;
  return pattern.replace(/#/g, () => processedText[charIndex++]);
}

// ------------------------------------------------------------------------------------------------

export default stringToFormat;