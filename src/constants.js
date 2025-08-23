/**
 * @fileoverview Centraliza constantes de formatação e padrões para uso geral na aplicação.
 * @description Este módulo exporta formatos de data, máscaras para documentos brasileiros, e
 * expressões regulares (Regex) para validações de formato.
 */
module.exports = {
  // ==============================================================================================
  // SEÇÃO: Formatos de Data (para bibliotecas como date-fns, dayjs, etc.)
  // ==============================================================================================

  // ----------------------------------------------------------------------------------------------
  // Padrões de Data ISO 8601

  /**
   * Formato de data ISO 8601 completo com timezone (UTC/Zulu).
   * @example "2025-08-18T20:49:08.123Z"
   */
  DATE_ISO_FORMAT_TZ: `yyyy-MM-dd'T'HH:mm:ss.SSS'Z'`,

  /**
   * Formato de data ISO 8601 sem informação de timezone.
   * @example "2025-08-18T20:49:08.123"
   */
  DATE_ISO_FORMAT: `yyyy-MM-dd'T'HH:mm:ss.SSS`,

  // ----------------------------------------------------------------------------------------------
  // Padrões de Data Brasileiros

  /**
   * Formato de data brasileiro (dia-mês-ano) separado por hífen.
   * @example "18-08-2025"
   */
  DATE_BR_FORMAT_D: `dd-MM-yyyy`,

  /**
   * Formato de data brasileiro (dia/mês/ano) separado por barra.
   * @example "18/08/2025"
   */
  DATE_BR_FORMAT_FS: `dd/MM/yyyy`,

  /**
   * Formato de data e hora brasileiro separado por hífen.
   * @example "18-08-2025 20:49:08"
   */
  DATE_BR_HOUR_FORMAT_D: `dd-MM-yyyy HH:mm:ss`,

  /**
   * Formato de data e hora brasileiro separado por barra.
   * @example "18/08/2025 20:49:08"
   */
  DATE_BR_HOUR_FORMAT_FS: `dd/MM/yyyy HH:mm:ss`,

  /**
   * Formato de data brasileiro (mês-ano) separado por hífen.
   * @example "08-2025"
   */
  DATE_BR_MONTH_FORMAT_D: `MM-yyyy`,

  /**
   * Formato de data brasileiro (mês/ano) separado por barra.
   * @example "08/2025"
   */
  DATE_BR_MONTH_FORMAT_FS: `MM/yyyy`,

  // ----------------------------------------------------------------------------------------------
  // Padrões de Data Americanos

  /**
   * Formato de data americano (ano-mês-dia) separado por hífen.
   * @example "2025-08-18"
   */
  DATE_EUA_FORMAT_D: `yyyy-MM-dd`,

  /**
   * Formato de data americano (ano/mês/dia) separado por barra.
   * @example "2025/08/18"
   */
  DATE_EUA_FORMAT_FS: `yyyy/MM/dd`,

  /**
   * Formato de data e hora americano separado por hífen.
   * @example "2025-08-18 20:49:08"
   */
  DATE_EUA_HOUR_FORMAT_D: `yyyy-MM-dd HH:mm:ss`,

  /**
   * Formato de data e hora americano separado por barra.
   * @example "2025/08/18 20:49:08"
   */
  DATE_EUA_HOUR_FORMAT_FS: `yyyy/MM/dd HH:mm:ss`,

  /**
   * Formato de data americano (ano-mês) separado por hífen.
   * @example "2025-08"
   */
  DATE_EUA_MONTH_FORMAT_D: `yyyy-MM`,

  /**
   * Formato de data americano (ano/mês) separado por barra.
   * @example "2025/08"
   */
  DATE_EUA_MONTH_FORMAT_FS: `yyyy/MM`,

  // ==============================================================================================
  // SEÇÃO: Máscaras de Formatação (para bibliotecas de input mask)
  // ==============================================================================================

  /**
   * Máscara para CAD/ICMS do estado do Paraná (PR).
   * @example "90312851-11"
   */
  STRING_FORMAT_CADICMSPR: "########-##",

  /**
   * Máscara para CNPJ alfanumérico.
   * 'S' representa um caractere alfanumérico [A-Z0-9] e '#' um dígito [0-9].
   * @example "AB.123.CD4/567E-89"
   */
  STRING_FORMAT_CNPJ: "##.###.###/####-##",

  /**
   * Máscara para CNPJ Raiz alfanumérico.
   * 'S' representa um caractere alfanumérico [A-Z0-9] e '#' um dígito [0-9].
   * @example "AB.123.CD4"
   */
  STRING_FORMAT_CNPJ_RAIZ: "##.###.###",

  /**
   * Máscara para CPF.
   * @example "123.456.789-00"
   */
  STRING_FORMAT_CPF: "###.###.###-##",

  /**
   * Máscara para Protocolo do estado do Paraná (PR).
   * @example "123.456.789.1"
   */
  STRING_FORMAT_PROTOCOLPR: "###.###.###.#",

  /**
   * Máscara para CEP (Código de Endereçamento Postal).
   * @example "80000-000"
   */
  STRING_FORMAT_CEP: "#####-###",

  /**
   * Máscara para Telefone Celular com 9 dígitos + DDD.
   * @example "(41) 98888-8888"
   */
  STRING_FORMAT_PHONE: "(##) # ####-####",

  // ==============================================================================================
  // SEÇÃO: Expressões Regulares (Regex) para Validação de Formato
  // ==============================================================================================

  /**
   * Regex para validar a estrutura de um CNPJ alfanumérico.
   * Verifica 12 caracteres alfanuméricos seguidos de 2 dígitos numéricos. Case-insensitive.
   */
  REGEX_CNPJ_ALPHANUMERIC: /^([A-Z\d]){12}(\d){2}$/i,

  /**
   * Regex para validar um e-mail em formato padrão.
   */
  REGEX_EMAIL:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,

  /**
   * Regex para validar um UUID v4 (usado em Chave Aleatória PIX).
   */
  REGEX_UUID_V4:
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,

  /**
   * Regex para validar um número de telefone brasileiro, com ou sem o código do país (+55).
   * Aceita números de 10 (fixo) ou 11 (celular) dígitos, além do DDI.
   * @example /^(?:\+55)?\d{10,11}$/
   */
  REGEX_PHONE_BR: /^(?:\+55)?\d{10,11}$/,

  // ==============================================================================================
  // SEÇÃO: Dados Geográficos - Brasil
  // ==============================================================================================

  /**
   * Objeto (chave-valor) com as siglas e nomes de todos os estados brasileiros e o Distrito Federal.
   * @example { "PR": "Paraná", "SP": "São Paulo", ... }
   */
  BRAZILIAN_STATES: {
    AC: "Acre",
    AL: "Alagoas",
    AP: "Amapá",
    AM: "Amazonas",
    BA: "Bahia",
    CE: "Ceará",
    DF: "Distrito Federal",
    ES: "Espírito Santo",
    GO: "Goiás",
    MA: "Maranhão",
    MT: "Mato Grosso",
    MS: "Mato Grosso do Sul",
    MG: "Minas Gerais",
    PA: "Pará",
    PB: "Paraíba",
    PR: "Paraná",
    PE: "Pernambuco",
    PI: "Piauí",
    RJ: "Rio de Janeiro",
    RN: "Rio Grande do Norte",
    RS: "Rio Grande do Sul",
    RO: "Rondônia",
    RR: "Roraima",
    SC: "Santa Catarina",
    SP: "São Paulo",
    SE: "Sergipe",
    TO: "Tocantins",
  },

  /**
   * Array com as siglas de todos os estados brasileiros e o Distrito Federal.
   * Útil para popular seletores (dropdowns) ou para validações.
   * @example ["AC", "AL", "AP", ...]
   */
  BRAZILIAN_STATES_ABBR: [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
  ],
};
