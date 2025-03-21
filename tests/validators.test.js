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
    expect(validators.validateCNPJ(invalidCNPJWithPaddingIgnored, options)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("validateCNPJ should return false for an invalid CNPJ with custom weights", () => {
    const invalidCNPJWithCustomWeights = "12.ABC.345/01DE-26";
    const customWeights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 1];
    const options = { weights: customWeights };
    expect(validators.validateCNPJ(invalidCNPJWithCustomWeights, options)).toBe(false);
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
    expect(validators.validateCNPJ(cnpjWithLowercaseAndCaseNotIgnored, options)).toBe(false);
  });

  // ----------------------------------------------------------------------------------------------

  it("validateCNPJ should return false for a CNPJ with incorrect length when padding is ignored", () => {
    const invalidCNPJWithIgnorePadding = "12.ABC.345/01DE-262";
    const options = { ignorePadding: true };
    expect(validators.validateCNPJ(invalidCNPJWithIgnorePadding, options)).toBe(false);
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
    expect(validators.validateCADICMSPR(invalidCharactersCADICMSPR)).toBe(false);
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


  it('validateEmail - Valid email formats', () => {
    // Valid email addresses
    expect(validators.validateEmail('test@example.com')).toBe(true);
    expect(validators.validateEmail('john.doe@example.co.uk')).toBe(true);
    expect(validators.validateEmail('user1234@test-mail.com')).toBe(true);
  });
  
  it('validateEmail - Invalid email formats', () => {
    // Invalid email addresses
    expect(validators.validateEmail('notanemail')).toBe(false);
    expect(validators.validateEmail('invalidemail@')).toBe(false);
    expect(validators.validateEmail('invalid@@email.com')).toBe(false);
    expect(validators.validateEmail('invalid.email.com')).toBe(false);
    expect(validators.validateEmail('invalid@.com')).toBe(false);
    expect(validators.validateEmail('')).toBe(false); // Empty string should return false
  });
  
  it('validateEmail - Edge cases', () => {
    // Edge cases
    expect(validators.validateEmail()).toBe(false); // No argument provided should return false
    expect(validators.validateEmail(null)).toBe(false); // Null should return false
    expect(validators.validateEmail(123)).toBe(false); // Non-string input should return false
  });

});

// ------------------------------------------------------------------------------------------------