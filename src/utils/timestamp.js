/**
 * @description Gera uma string de timestamp altamente customizável e formatada com base em um padrão fornecido.
 * A função é otimizada para calcular apenas os componentes de data/hora necessários para o formato solicitado.
 *
 * @param {string} [format='D-MT-Y_H:MN:S:MS'] A string de formato que define a estrutura da saída.
 * Os seguintes tokens serão substituídos pelos seus respectivos valores:
 * - `Y`: Ano com 4 dígitos (ex: 2025)
 * - `MT`: Mês com 2 dígitos (01-12)
 * - `D`: Dia com 2 dígitos (01-31)
 * - `H`: Hora com 2 dígitos, formato 24h (00-23)
 * - `MN`: Minuto com 2 dígitos (00-59)
 * - `S`: Segundo com 2 dígitos (00-59)
 * - `MS`: Milissegundo com 3 dígitos (000-999)
 *
 * Qualquer outro caractere na string de formato (ex: '-', ':', '_', '/') será mantido como um separador literal.
 *
 * @returns {string} Uma string representando o timestamp formatado de acordo com o padrão.
 *
 * @example
 * // Chamada sem parâmetros, usa o formato padrão.
 * // Retorna algo como: "22-08-2025_19:37:33:456"
 * getFormattedTimestamp();
 *
 * @example
 * // Formato de hora customizado com underscores, como solicitado.
 * // Retorna algo como: "19_37_33_456"
 * getFormattedTimestamp('H_MN_S_MS');
 *
 * @example
 * // Formato de hora simples, como solicitado.
 * // Retorna algo como: "19:37:33"
 * getFormattedTimestamp('H:MN:S');
 *
 * @example
 * // Formato de data para logs (padrão ISO 8601).
 * // Retorna algo como: "2025-08-22"
 * getFormattedTimestamp('Y-MT-D');
 */
function timestamp(format = 'D-MT-Y_H:MN:S:MS') {
  const now = new Date();

  // Mapeamento dos tokens para suas funções de obtenção e formatação.
  // A avaliação é "lazy" (preguiçosa): a função só é executada quando o token correspondente
  // é encontrado na string de formato, melhorando a performance.
  const tokens = {
    // Ano com 4 dígitos
    Y: () => now.getFullYear(),
    // Mês com 2 dígitos (getMonth() é 0-indexado)
    MT: () => String(now.getMonth() + 1).padStart(2, '0'),
    // Dia com 2 dígitos
    D: () => String(now.getDate()).padStart(2, '0'),
    // Hora com 2 dígitos (formato 24h)
    H: () => String(now.getHours()).padStart(2, '0'),
    // Minuto com 2 dígitos
    MN: () => String(now.getMinutes()).padStart(2, '0'),
    // Segundo com 2 dígitos
    S: () => String(now.getSeconds()).padStart(2, '0'),
    // Milissegundo com 3 dígitos
    MS: () => String(now.getMilliseconds()).padStart(3, '0'),
  };

  // Usa uma expressão regular para encontrar e substituir todos os tokens de uma só vez.
  // A flag 'g' (global) garante que todas as ocorrências de tokens sejam substituídas,
  // não apenas a primeira.
  // Para cada token encontrado, a função correspondente no objeto 'tokens' é chamada.
  return format.replace(/Y|MT|D|H|MN|S|MS/g, (token) => tokens[token]());
}

// ------------------------------------------------------------------------------------------------

module.exports = timestamp;
