import { describe, it } from "vitest";
import { validators } from "../index.js";

// ------------------------------------------------------------------------------------------------

describe("VALIDATORS - validateCPF", () => {
  // ----------------------------------------------------------------------------------------------

  it("validateCPF should return true for a valid CPF", () => {
    const validCPF = "123.456.789-09";
    expect(validators.validateCPF(validCPF)).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("validateCPF should return false for an invalid CPF with all the same digits", () => {
    const invalidCPF = "111.111.111-11";
    expect(validators.validateCPF(invalidCPF)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("validateCPF should return false for an invalid CPF with incorrect check digits", () => {
    const invalidCPF = "123.456.789-01";
    expect(validators.validateCPF(invalidCPF)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("validateCPF should return false for an empty string", () => {
    const emptyCPF = "";
    expect(validators.validateCPF(emptyCPF)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("validateCPF should return true for a correct number input", () => {
    const nonStringInput = 85067122030;
    expect(validators.validateCPF(nonStringInput)).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("validateCPF should return false for an incorrect number input", () => {
    const nonStringInput = 25067122030;
    expect(validators.validateCPF(nonStringInput)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("validateCPF should return false for a CPF with non-numeric characters", () => {
    const invalidCharactersCPF = "A12.345.678-B9";
    expect(validators.validateCPF(invalidCharactersCPF)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("validateCPF should return true for a CPF with less than 11 digits but is correct", () => {
    const shortCPF = "850.671.220-30";
    expect(validators.validateCPF(shortCPF)).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("validateCPF should return false for a CPF with less than 11 digits but is incorrect", () => {
    const shortCPF = "250.671.220-30";
    expect(validators.validateCPF(shortCPF)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("validateCPF should return false for a CPF with more than 11 digits", () => {
    const longCPF = "123.456.789-09876";
    expect(validators.validateCPF(longCPF)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("VALIDATORS - validateCNPJ", () => {
  // ----------------------------------------------------------------------------------------------

  it("validateCNPJ should return true for a valid CNPJ", () => {
    const validCNPJ = "57.276.750/0001-08";
    expect(validators.validateCNPJ(validCNPJ)).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("validateCNPJ should return false for an invalid CNPJ with all the same digits", () => {
    const invalidCNPJ = "11.111.111/1111-11";
    expect(validators.validateCNPJ(invalidCNPJ)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("validateCNPJ should return false for an invalid CNPJ with incorrect check digits", () => {
    const invalidCNPJ = "12.345.678/0001-91";
    expect(validators.validateCNPJ(invalidCNPJ)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("validateCNPJ should return false for an empty string", () => {
    const emptyCNPJ = "";
    expect(validators.validateCNPJ(emptyCNPJ)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("validateCNPJ should return true for a correct number input", () => {
    const nonStringInput = 57276750000108;
    expect(validators.validateCNPJ(nonStringInput)).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("validateCNPJ should return false for an incorrect number input", () => {
    const nonStringInput = 27276750000108;
    expect(validators.validateCNPJ(nonStringInput)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("validateCNPJ should return false for a CNPJ with non-numeric characters", () => {
    const invalidCharactersCNPJ = "A7.276.750/0001-089";
    expect(validators.validateCNPJ(invalidCharactersCNPJ)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("validateCNPJ should return true for a CNPJ with less than 11 digits but is correct", () => {
    const shortCNPJ = "57.276.750/0001-08";
    expect(validators.validateCNPJ(shortCNPJ)).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("validateCNPJ should return false for a CNPJ with less than 11 digits but is incorrect", () => {
    const shortCNPJ = "27.276.750/0001-08";
    expect(validators.validateCNPJ(shortCNPJ)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("validateCNPJ should return false for a CNPJ with more than 11 digits", () => {
    const longCNPJ = "57.276.750/0001-0876";
    expect(validators.validateCNPJ(longCNPJ)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("VALIDATORS - validateCNPJ (Alphanumeric)", () => {
  // ----------------------------------------------------------------------------------------------

  it("validateCNPJ should return true for a valid alphanumeric CNPJ", () => {
    const validAlphanumericCNPJ = "12.ABC.345/01DE-35";
    expect(validators.validateCNPJ(validAlphanumericCNPJ)).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("validateCNPJ should return false for an alphanumeric CNPJ with invalid check digits", () => {
    const invalidCheckDigitsCNPJ = "12.ABC.345/01DE-26";
    expect(validators.validateCNPJ(invalidCheckDigitsCNPJ)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("validateCNPJ should return false for an alphanumeric CNPJ with lowercase letters", () => {
    const lowercaseCNPJ = "a7.2b6.c50/0001-08";
    expect(validators.validateCNPJ(lowercaseCNPJ)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("validateCNPJ should return false for an alphanumeric CNPJ with special characters", () => {
    const specialCharsCNPJ = "1$.ABC.345/01DE-26";
    expect(validators.validateCNPJ(specialCharsCNPJ)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("validateCNPJ should return false for an alphanumeric CNPJ with spaces", () => {
    const spacedCNPJ = "12.ABC .345/01DE-26";
    expect(validators.validateCNPJ(spacedCNPJ)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("validateCNPJ should return false for an alphanumeric CNPJ with incorrect length", () => {
    const shortCNPJ = "12.ABC.345/01DE-262";
    expect(validators.validateCNPJ(shortCNPJ)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("validateCNPJ should return false for an alphanumeric CNPJ with all identical characters", () => {
    const identicalCNPJ = "AAAAAAAAAAAAA-00";
    expect(validators.validateCNPJ(identicalCNPJ)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("validateCNPJ should return true for a valid alphanumeric CNPJ in numeric format", () => {
    const validAlphanumericNumericCNPJ = "12ABC34501DE35";
    expect(validators.validateCNPJ(validAlphanumericNumericCNPJ)).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("VALIDATORS - validateCNPJ (With Additional Options)", () => {
  // ----------------------------------------------------------------------------------------------

  it("validateCNPJ should return true for a valid CNPJ with padding ignored", () => {
    const cnpjWithPaddingIgnored = "12.ABC.345/01DE-35";
    const options = { ignorePadding: false };
    expect(validators.validateCNPJ(cnpjWithPaddingIgnored, options)).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("validateCNPJ should return false for an invalid CNPJ with padding ignored", () => {
    const invalidCNPJWithPaddingIgnored = "12.ABC.345/01DE-26";
    const options = { ignorePadding: true };
    expect(
      validators.validateCNPJ(invalidCNPJWithPaddingIgnored, options)
    ).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("validateCNPJ should return false for an invalid CNPJ with custom weights", () => {
    const invalidCNPJWithCustomWeights = "12.ABC.345/01DE-26";
    const customWeights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 1];
    const options = { weights: customWeights };
    expect(validators.validateCNPJ(invalidCNPJWithCustomWeights, options)).toBe(
      false
    );
  });

  // ----------------------------------------------------------------------------------------------

  it("validateCNPJ should return false for a valid CNPJ with case ignored", () => {
    const cnpjWithCaseIgnored = "a7.2b6.c50/0001-08";
    const options = { ignoreToUpperCase: true };
    expect(validators.validateCNPJ(cnpjWithCaseIgnored, options)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("validateCNPJ should return false for an alphanumeric CNPJ with lowercase letters and case not ignored", () => {
    const cnpjWithLowercaseAndCaseNotIgnored = "a7.2b6.c50/0001-08";
    const options = { ignoreToUpperCase: false };
    expect(
      validators.validateCNPJ(cnpjWithLowercaseAndCaseNotIgnored, options)
    ).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("validateCNPJ should return false for a CNPJ with incorrect length when padding is ignored", () => {
    const invalidCNPJWithIgnorePadding = "12.ABC.345/01DE-262";
    const options = { ignorePadding: true };
    expect(validators.validateCNPJ(invalidCNPJWithIgnorePadding, options)).toBe(
      false
    );
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("VALIDATORS - validateCADICMSPR", () => {
  // ----------------------------------------------------------------------------------------------

  it("validateCADICMSPR should return true for a valid CADICMSPR", () => {
    const validCADICMSPR = "90456375-70";
    expect(validators.validateCADICMSPR(validCADICMSPR)).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("validateCADICMSPR should return false for an invalid CADICMSPR with all the same digits", () => {
    const invalidCADICMSPR = "11111111-11";
    expect(validators.validateCADICMSPR(invalidCADICMSPR)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("validateCADICMSPR should return false for an invalid CADICMSPR with incorrect check digits", () => {
    const invalidCADICMSPR = "90456375-71";
    expect(validators.validateCADICMSPR(invalidCADICMSPR)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("validateCADICMSPR should return false for an empty string", () => {
    const emptyCADICMSPR = "";
    expect(validators.validateCADICMSPR(emptyCADICMSPR)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("validateCADICMSPR should return true for a correct number input", () => {
    const nonStringInput = 9045637570;
    expect(validators.validateCADICMSPR(nonStringInput)).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("validateCADICMSPR should return false for an incorrect number input", () => {
    const nonStringInput = 2045637570;
    expect(validators.validateCADICMSPR(nonStringInput)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("validateCADICMSPR should return false for a CADICMSPR with non-numeric characters", () => {
    const invalidCharactersCADICMSPR = "A7.276.750/0001-089";
    expect(validators.validateCADICMSPR(invalidCharactersCADICMSPR)).toBe(
      false
    );
  });

  // ----------------------------------------------------------------------------------------------

  it("validateCADICMSPR should return true for a CADICMSPR with less than 11 digits but is correct", () => {
    const shortCADICMSPR = "90456375-70";
    expect(validators.validateCADICMSPR(shortCADICMSPR)).toBe(true);
  });

  // ----------------------------------------------------------------------------------------------

  it("validateCADICMSPR should return false for a CADICMSPR with less than 11 digits but is incorrect", () => {
    const shortCADICMSPR = "30456375-70";
    expect(validators.validateCADICMSPR(shortCADICMSPR)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("validateCADICMSPR should return false for a CADICMSPR with more than 11 digits", () => {
    const longCADICMSPR = "90456375-706";
    expect(validators.validateCADICMSPR(longCADICMSPR)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("VALIDATORS - validators.validateEmail", () => {
  // ----------------------------------------------------------------------------------------------

  it("validateEmail - Valid email formats", () => {
    // Valid email addresses
    expect(validators.validateEmail("test@example.com")).toBe(true);
    expect(validators.validateEmail("john.doe@example.co.uk")).toBe(true);
    expect(validators.validateEmail("user1234@test-mail.com")).toBe(true);
  });

  it("validateEmail - Invalid email formats", () => {
    // Invalid email addresses
    expect(validators.validateEmail("notanemail")).toBe(false);
    expect(validators.validateEmail("invalidemail@")).toBe(false);
    expect(validators.validateEmail("invalid@@email.com")).toBe(false);
    expect(validators.validateEmail("invalid.email.com")).toBe(false);
    expect(validators.validateEmail("invalid@.com")).toBe(false);
    expect(validators.validateEmail("")).toBe(false); // Empty string should return false
  });

  it("validateEmail - Edge cases", () => {
    // Edge cases
    expect(validators.validateEmail()).toBe(false); // No argument provided should return false
    expect(validators.validateEmail(null)).toBe(false); // Null should return false
    expect(validators.validateEmail(123)).toBe(false); // Non-string input should return false
  });
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - validateCEP", () => {
  // ----------------------------------------------------------------------------------------------

  const validateCEP = validators.validateCEP;

  // ----------------------------------------------------------------------------------------------

  // Testes de casos válidos (devem retornar true)
  it("deve retornar true para um CEP válido com máscara (hífen)", () => {
    expect(validateCEP("80730-000")).toBe(true);
  });

  it("deve retornar true para um CEP válido como string de 8 dígitos", () => {
    expect(validateCEP("01001000")).toBe(true);
  });

  it("deve retornar true para um CEP válido como número", () => {
    // A função deve converter o número para string e validar
    expect(validateCEP(80730000)).toBe(true);
  });

  it("deve retornar true para um CEP válido com caracteres de máscara extras e espaços", () => {
    expect(validateCEP(" 80.730-000 ")).toBe(true);
    expect(validateCEP("CEP: 01001-000 / SP")).toBe(true);
  });

  it("deve lidar corretamente com CEPs que começam com zero (como string)", () => {
    expect(validateCEP("01001-001")).toBe(true);
    expect(validateCEP("05424020")).toBe(true);
  });

  // Testes de casos inválidos (devem retornar false)
  it("deve retornar false para um CEP com menos de 8 dígitos", () => {
    expect(validateCEP("12345-67")).toBe(false);
    expect(validateCEP("1234567")).toBe(false);
  });

  it("deve retornar false para um CEP com mais de 8 dígitos", () => {
    expect(validateCEP("12345-6789")).toBe(false);
    expect(validateCEP("123456789")).toBe(false);
  });

  it("deve retornar false para uma string contendo letras entre os dígitos", () => {
    expect(validateCEP("12345-ABC")).toBe(false);
  });

  it("deve retornar false para uma string vazia", () => {
    expect(validateCEP("")).toBe(false);
  });

  it("deve retornar false para entradas nulas ou indefinidas", () => {
    expect(validateCEP(null)).toBe(false);
    expect(validateCEP(undefined)).toBe(false);
  });

  it("deve retornar false para outros tipos de dados como objetos ou arrays", () => {
    expect(validateCEP({})).toBe(false);
    expect(validateCEP([])).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - validateChavePix", () => {
  // ----------------------------------------------------------------------------------------------

  const validateChavePix = validators.validateChavePix;

  // ----------------------------------------------------------------------------------------------

  describe("Chave Aleatória (UUID v4)", () => {
    it("deve retornar true para uma chave aleatória válida", () => {
      expect(validateChavePix("f8c3de3d-1fea-4d7c-a8b0-29f63c4c3454")).toBe(
        true
      );
    });

    it("deve retornar false para um UUID com formato inválido ou versão incorreta", () => {
      expect(validateChavePix("f8c3de3d-1fea-1d7c-a8b0-29f63c4c3454")).toBe(
        false
      ); // UUID v1
      expect(validateChavePix("nao-e-um-uuid-valido")).toBe(false);
    });
  });

  describe("Chave de Telefone", () => {
    it("deve retornar true para um telefone E.164 válido (celular e fixo)", () => {
      // Testa um celular com 11 dígitos após o +55
      expect(validateChavePix("+5511987654321")).toBe(true);
      // Testa um telefone fixo com 10 dígitos após o +55
      expect(validateChavePix("+554133334444")).toBe(true);
    });

    it("deve retornar false para telefones em formato inválido", () => {
      // Inválido por não ter o código do país
      expect(validateChavePix("11987654321")).toBe(false);
      // Inválido por conter espaços e máscara
      expect(validateChavePix("+55 11 98765-4321")).toBe(false);
      // Inválido por ser curto demais (9 dígitos)
      expect(validateChavePix("+55111234567")).toBe(false);
      // Inválido por ser longo demais (12 dígitos)
      expect(validateChavePix("+55111234567890")).toBe(false);
    });
  });

  describe("Chave de E-mail", () => {
    it("deve retornar true para um e-mail válido", () => {
      expect(validateChavePix("contato.empresa@email.com.br")).toBe(true);
    });

    it("deve retornar false para um e-mail inválido", () => {
      expect(validateChavePix("contato@empresa")).toBe(false);
      expect(validateChavePix("contato.empresa.com")).toBe(false);
    });
  });

  describe("Chave de CPF", () => {
    it("deve retornar true para um CPF matematicamente válido (com ou sem máscara)", () => {
      // CPF válido gerado para testes
      expect(validateChavePix("41047583020")).toBe(true);
      expect(validateChavePix("410.475.830-20")).toBe(true);
    });

    it("deve retornar false para um CPF matematicamente inválido", () => {
      expect(validateChavePix("11111111111")).toBe(false); // Dígitos repetidos
      expect(validateChavePix("142.399.988-31")).toBe(false); // Dígito verificador incorreto
    });
  });

  describe("Chave de CNPJ", () => {
    it("deve retornar true para um CNPJ matematicamente válido (com ou sem máscara)", () => {
      // CNPJ válido gerado para testes
      expect(validateChavePix("57276750000108")).toBe(true);
      expect(validateChavePix("57.276.750/0001-08")).toBe(true);
    });

    it("deve retornar false para um CNPJ matematicamente inválido", () => {
      expect(validateChavePix("11111111111111")).toBe(false); // Dígitos repetidos
      expect(validateChavePix("86.505.857/0001-23")).toBe(false); // Dígito verificador incorreto
    });
  });

  describe("Casos de Borda e Entradas Inválidas", () => {
    it("deve retornar false para uma string vazia, nula ou indefinida", () => {
      expect(validateChavePix("")).toBe(false);
      expect(validateChavePix(null)).toBe(false);
      expect(validateChavePix(undefined)).toBe(false);
    });

    it("deve retornar false para chaves que não se encaixam em nenhum dos formatos válidos", () => {
      expect(validateChavePix("uma-chave-qualquer")).toBe(false);
      expect(validateChavePix("123456789")).toBe(false); // 9 dígitos
      expect(validateChavePix("123456789012")).toBe(false); // 12 dígitos
      expect(validateChavePix("123456789012345")).toBe(false); // 15 dígitos
    });
  });
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - validateCNH", () => {
  // ----------------------------------------------------------------------------------------------

  const validateCNH = validators.validateCNH;

  // ----------------------------------------------------------------------------------------------

  describe("CNHs Válidas", () => {
    it("deve retornar true para um número de CNH matematicamente válido", () => {
      // CNHs geradas para serem válidas de acordo com o algoritmo da função
      expect(validateCNH("23661211173")).toBe(true);
      expect(validateCNH("09646730299")).toBe(true);
      expect(validateCNH("94749741975")).toBe(true);
    });

    it("deve retornar true para uma CNH válida formatada como número", () => {
      expect(validateCNH(10400578720)).toBe(true);
    });

    it("deve retornar true para uma CNH válida com caracteres de máscara (espaços)", () => {
      // A função deve limpar a máscara antes de validar
      expect(validateCNH("872 067 927 70")).toBe(true);
    });
  });

  describe("CNHs Inválidas", () => {
    it("deve retornar false para CNHs com comprimento incorreto", () => {
      expect(validateCNH("1234567890")).toBe(false); // 10 dígitos
      expect(validateCNH("123456789001")).toBe(false); // 12 dígitos
    });

    it("deve retornar false para CNHs com todos os dígitos repetidos", () => {
      expect(validateCNH("11111111111")).toBe(false);
      expect(validateCNH("22222222222")).toBe(false);
      expect(validateCNH("00000000000")).toBe(false);
    });

    it("deve retornar false para uma CNH com o primeiro dígito verificador incorreto", () => {
      // Base '123456789', DV1 correto é 0, testando com 1
      expect(validateCNH("12345678910")).toBe(false);
    });

    it("deve retornar false para uma CNH com o segundo dígito verificador incorreto", () => {
      // Base '123456789', DV1=0, DV2 correto é 0, testando com 1
      expect(validateCNH("12345678901")).toBe(false);
    });

    it("deve retornar false para uma string contendo letras", () => {
      // O replace deve limpar as letras, resultando em um comprimento inválido
      expect(validateCNH("123456789AB")).toBe(false);
    });
  });

  describe("Casos de Borda", () => {
    it("deve retornar false para entradas nulas, indefinidas ou vazias", () => {
      expect(validateCNH(null)).toBe(false);
      expect(validateCNH(undefined)).toBe(false);
      expect(validateCNH("")).toBe(false);
    });

    it("deve retornar false para outros tipos de dados como objetos ou arrays", () => {
      expect(validateCNH({})).toBe(false);
      expect(validateCNH([])).toBe(false);
    });
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - validatePISPASEPNIT", () => {
  // ----------------------------------------------------------------------------------------------

  const validatePISPASEPNIT = validators.validatePISPASEPNIT;

  // ----------------------------------------------------------------------------------------------

  describe("PIS/PASEP/NIT Válidos", () => {
    it("deve retornar true para um número de PIS matematicamente válido", () => {
      // Números gerados para serem válidos de acordo com o algoritmo da função
      expect(validatePISPASEPNIT("60352845132")).toBe(true);
      expect(validatePISPASEPNIT("24936791290")).toBe(true);
    });

    it("deve retornar true para um PIS válido com máscara", () => {
      // A função deve limpar a máscara antes de validar
      expect(validatePISPASEPNIT("533.06835.42-9")).toBe(true);
    });

    it("deve retornar true para um PIS válido formatado como número", () => {
      expect(validatePISPASEPNIT(12083210826)).toBe(true);
    });
  });

  describe("PIS/PASEP/NIT Inválidos", () => {
    it("deve retornar false para números com comprimento incorreto", () => {
      expect(validatePISPASEPNIT("1234567890")).toBe(false); // 10 dígitos
      expect(validatePISPASEPNIT("123456789001")).toBe(false); // 12 dígitos
    });

    it("deve retornar false para números com todos os dígitos repetidos", () => {
      expect(validatePISPASEPNIT("11111111111")).toBe(false);
      expect(validatePISPASEPNIT("22222222222")).toBe(false);
    });

    it("deve retornar false para um PIS com o dígito verificador incorreto", () => {
      // A base '1203613769' tem o dígito verificador 0, mas aqui testamos com 1
      expect(validatePISPASEPNIT("12036137691")).toBe(false);
    });

    it("deve retornar false para uma string contendo letras", () => {
      // O replace deve limpar as letras, resultando em um comprimento inválido
      expect(validatePISPASEPNIT("120.36137.69-A")).toBe(false);
    });
  });

  describe("Casos de Borda", () => {
    it("deve retornar false para entradas nulas, indefinidas ou vazias", () => {
      expect(validatePISPASEPNIT(null)).toBe(false);
      expect(validatePISPASEPNIT(undefined)).toBe(false);
      expect(validatePISPASEPNIT("")).toBe(false);
    });

    it("deve retornar false para outros tipos de dados como objetos ou arrays", () => {
      expect(validatePISPASEPNIT({})).toBe(false);
      expect(validatePISPASEPNIT([])).toBe(false);
    });
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - validateRenavam", () => {
  // ----------------------------------------------------------------------------------------------

  const validateRenavam = validators.validateRenavam;

  // ----------------------------------------------------------------------------------------------

  describe("RENAVAMs Válidos", () => {
    it("deve retornar true para um RENAVAM de 11 dígitos matematicamente válido", () => {
      // RENAVAMs gerados para serem válidos de acordo com o algoritmo da função
      expect(validateRenavam("70118814630")).toBe(true);
      expect(validateRenavam("05047902630")).toBe(true);
    });

    it("deve retornar true para um RENAVAM com menos de 11 dígitos (que será preenchido com zeros)", () => {
      // A string '123456789' será preenchida para '00123456789', que é um RENAVAM válido
      expect(validateRenavam("123456789")).toBe(true);
      expect(validateRenavam(123456789)).toBe(true);
    });

    it("deve retornar true para um RENAVAM válido com caracteres de máscara", () => {
      // A função deve limpar a máscara antes de validar
      expect(validateRenavam("123.4567890-0")).toBe(true);
    });
  });

  describe("RENAVAMs Inválidos", () => {
    it("deve retornar false para RENAVAMs com mais de 11 dígitos (após limpeza)", () => {
      expect(validateRenavam("123456789001")).toBe(false);
    });

    it("deve retornar false para RENAVAMs com todos os dígitos repetidos", () => {
      expect(validateRenavam("11111111111")).toBe(false);
      expect(validateRenavam("00000000000")).toBe(false);
    });

    it("deve retornar false para um RENAVAM com o dígito verificador incorreto", () => {
      // A base '1234567890' tem o dígito verificador 0, mas aqui testamos com 1
      expect(validateRenavam("12345678901")).toBe(false);
    });

    it("deve retornar false para um RENAVAM curto que se torna inválido após o preenchimento", () => {
      // '987654321' será preenchido para '00987654321', que é inválido
      expect(validateRenavam("987654321")).toBe(false);
    });

    it("deve retornar false para uma string contendo letras", () => {
      // Após a limpeza, a string '1234567890' será preenchida para '01234567890', que é inválido.
      expect(validateRenavam("1234567890A")).toBe(false);
    });
  });

  describe("Casos de Borda", () => {
    it("deve retornar false para entradas nulas, indefinidas ou vazias", () => {
      // String vazia é preenchida para '00000000000', que é inválido pela regra de repetição.
      expect(validateRenavam("")).toBe(false);
      expect(validateRenavam(null)).toBe(false);
      expect(validateRenavam(undefined)).toBe(false);
    });

    it("deve retornar false para outros tipos de dados como objetos ou arrays", () => {
      expect(validateRenavam({})).toBe(false);
      expect(validateRenavam([])).toBe(false);
    });
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - validateTituloEleitor", () => {
  // ----------------------------------------------------------------------------------------------

  const validateTituloEleitor = validators.validateTituloEleitor;

  // ----------------------------------------------------------------------------------------------

  describe("Títulos de Eleitor Válidos", () => {
    it("deve retornar true para um título válido de um estado comum (ex: RJ, Cód 03)", () => {
      // Título gerado para ser válido com a lógica da função: 123456780322
      expect(validateTituloEleitor("574341750370")).toBe(true);
    });

    it("deve retornar true para um título válido de São Paulo (SP, Cód 01) que usa a regra especial", () => {
      // Título gerado para ser válido com a lógica de SP (soma % 11 === 0 -> DV = 1): 103099950115
      expect(validateTituloEleitor("072888610108")).toBe(true);
    });

    it("deve retornar true para um título válido com menos de 12 dígitos que é preenchido com zeros", () => {
      const validShortTitle = "005114141147"
      expect(validateTituloEleitor(validShortTitle)).toBe(true);
    });

    it("deve retornar true para um Título válido com caracteres de máscara", () => {
      // A função deve limpar a máscara antes de validar
      expect(validateTituloEleitor("6444 3466 06 04")).toBe(true);
    });
  });

  describe("Títulos de Eleitor Inválidos", () => {
    it("deve retornar false para títulos com mais de 12 dígitos", () => {
      expect(validateTituloEleitor("1234567803221")).toBe(false);
    });

    it("deve retornar false para títulos com código de estado inválido (00 ou >28)", () => {
      expect(validateTituloEleitor("123456780011")).toBe(false); // Cód 00
      expect(validateTituloEleitor("123456782911")).toBe(false); // Cód 29
    });

    it("deve retornar false para um título com o primeiro dígito verificador incorreto", () => {
      // Base '12345678', Cód '03', DV1 correto é 2. Testando com 3.
      expect(validateTituloEleitor("123456780332")).toBe(false);
    });

    it("deve retornar false para um título com o segundo dígito verificador incorreto", () => {
      // Base '12345678', Cód '03', DV1=2, DV2 correto é 2. Testando com 3.
      expect(validateTituloEleitor("123456780323")).toBe(false);
    });

    it("deve retornar false para um título de SP (Cód 01) que falha na regra especial", () => {
      // Base '10309995' (soma % 11 = 0), Cód '01'. DV1 correto é 1. Testando com 0.
      expect(validateTituloEleitor("103099950105")).toBe(false);
    });
  });

  describe("Casos de Borda", () => {
    it("deve retornar false para entradas nulas, indefinidas ou vazias", () => {
      // String vazia é preenchida para '000000000000', que tem cód de estado 00 -> inválido.
      expect(validateTituloEleitor("")).toBe(false);
      expect(validateTituloEleitor(null)).toBe(false);
      expect(validateTituloEleitor(undefined)).toBe(false);
    });

    it("deve retornar false para outros tipos de dados como objetos ou arrays", () => {
      expect(validateTituloEleitor({})).toBe(false);
      expect(validateTituloEleitor([])).toBe(false);
    });
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------

describe("UTILS - validateRG", () => {
  // ----------------------------------------------------------------------------------------------

  const validateRG = validators.validateRG; // Ajuste conforme sua estrutura de importação

  // ----------------------------------------------------------------------------------------------

  describe("RGs Válidos", () => {
    it("deve retornar true para RG válido com dígito verificador numérico", () => {
      // Exemplo do algoritmo: 24.678.131-4
      expect(validateRG("149920283")).toBe(true);
      expect(validateRG("14.992.028-3")).toBe(true);
    });

    it("deve retornar true para RG válido com dígito verificador 'X'", () => {
      // Caso especial onde o cálculo resulta em 10 -> 'X'
      expect(validateRG("376063356")).toBe(false); // Testando se realmente precisa ser X
      expect(validateRG("37606335X")).toBe(true);
      expect(validateRG("37.606.335-X")).toBe(true);
    });

    it("deve retornar true para RG válido com dígito verificador '0'", () => {
      // Caso onde o complemento é 11 -> dígito 0
      expect(validateRG("457275030")).toBe(true);
      expect(validateRG("45.727.503-0")).toBe(true);
    });

    it("deve aceitar RG em diferentes formatos de entrada", () => {
      const validRG = "192510745";
      expect(validateRG(validRG)).toBe(true);
      expect(validateRG("19.251.074-5")).toBe(true);
      expect(validateRG("19 251 074 5")).toBe(true);
      expect(validateRG("19-251-074-5")).toBe(true);
    });

    it("deve tratar entrada como número", () => {
      expect(validateRG(316744529)).toBe(true);
    });
  });

  describe("RGs Inválidos", () => {
    it("deve retornar false para RGs com tamanho incorreto", () => {
      expect(validateRG("12345678")).toBe(false); // 8 dígitos (sem verificador)
      expect(validateRG("1234567890")).toBe(false); // 10 dígitos
      expect(validateRG("123")).toBe(false); // Muito curto
    });

    it("deve retornar false para RG com dígito verificador incorreto", () => {
      expect(validateRG("246781315")).toBe(false); // DV correto seria 4, não 5
      expect(validateRG("24.678.131-5")).toBe(false);
    });

    it("deve retornar false para RG com todos os dígitos iguais", () => {
      expect(validateRG("111111111")).toBe(false);
      expect(validateRG("00000000X")).toBe(false);
      expect(validateRG("22.222.222-2")).toBe(false);
    });

    it("deve retornar false para RG com caracteres inválidos na base", () => {
      expect(validateRG("2467813A4")).toBe(false);
      expect(validateRG("24.67B.131-4")).toBe(false);
    });

    it("deve retornar false para RG com dígito verificador inválido", () => {
      expect(validateRG("24678131Y")).toBe(false); // Letra que não seja X
      expect(validateRG("24678131-")).toBe(false); // Caractere especial
    });

    it("deve retornar false quando X está na posição errada", () => {
      expect(validateRG("37606356X")).toBe(false); // X no lugar correto seria dígito numérico
    });
  });

  describe("Casos de Borda", () => {
    it("deve retornar false para entradas nulas, indefinidas ou vazias", () => {
      expect(validateRG("")).toBe(false);
      expect(validateRG(null)).toBe(false);
      expect(validateRG(undefined)).toBe(false);
    });

    it("deve retornar false para outros tipos de dados", () => {
      expect(validateRG({})).toBe(false);
      expect(validateRG([])).toBe(false);
      expect(validateRG(true)).toBe(false);
    });

    it("deve tratar letras minúsculas corretamente", () => {
      expect(validateRG("37606335x")).toBe(true); // 'x' minúsculo deve ser aceito
      expect(validateRG("37.606.335-x")).toBe(true);
    });

    it("deve remover formatação complexa", () => {
      expect(validateRG("33..881..333-0")).toBe(true);
      expect(validateRG("33  881  333  0")).toBe(true);
      expect(validateRG("(33) 881-333.0")).toBe(true);
    });
  });

  describe("Casos Específicos de Validação do Algoritmo", () => {
    it("deve validar corretamente quando o resto da divisão resulta em diferentes complementos", () => {
      // Testes específicos para diferentes resultados do módulo 11
      
      // Caso onde resto = 1, complemento = 10 -> X
      expect(validateRG("37606335X")).toBe(true);
      
      // Caso onde resto = 0, complemento = 11 -> 0  
      expect(validateRG("457275030")).toBe(true);
      
      // Caso normal onde complemento < 10
      expect(validateRG("405447954")).toBe(true);
    });
  });

  // ----------------------------------------------------------------------------------------------
});

// ------------------------------------------------------------------------------------------------
