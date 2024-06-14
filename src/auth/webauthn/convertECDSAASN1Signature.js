const bufferConcatenate = require("../../utils/bufferConcatenate");

// ------------------------------------------------------------------------------------------------
/**
 * Converts an ECDSA signature in ASN.1/DER format to a concatenated r|s format.
 *
 * @param {Uint8Array} asn1Signature - The input signature in ASN.1/DER format.
 * @returns {Uint8Array} - The signature in concatenated r|s format.
 * @throws {Error} - Throws an error if the input does not contain exactly 2 ASN.1 sequence elements or if r or s have an unexpected length.
 */
function convertECDSAASN1Signature(asn1Signature) {
  const elements = readASN1IntegerSequence(asn1Signature);
  if (elements.length !== 2)
    throw new Error("Expected 2 ASN.1 sequence elements");
  let [r, s] = elements;

  // R and S length is assumed multiple of 128bit.
  // If leading is 0 and modulo of length is 1 byte then
  // leading 0 is for two's complement and will be removed.
  if (r[0] === 0 && r.byteLength % 16 == 1) {
    r = r.slice(1);
  }
  if (s[0] === 0 && s.byteLength % 16 == 1) {
    s = s.slice(1);
  }

  // R and S length is assumed multiple of 128bit.
  // If missing a byte then it will be padded by 0.
  if (r.byteLength % 16 == 15) {
    r = new Uint8Array(bufferConcatenate(new Uint8Array([0]), r));
  }
  if (s.byteLength % 16 == 15) {
    s = new Uint8Array(bufferConcatenate(new Uint8Array([0]), s));
  }

  // If R and S length is not still multiple of 128bit,
  // then error
  if (r.byteLength % 16 != 0) throw Error("unknown ECDSA sig r length error");
  if (s.byteLength % 16 != 0) throw Error("unknown ECDSA sig s length error");

  return bufferConcatenate(r, s);
}

// ------------------------------------------------------------------------------------------------

/**
 * Reads and extracts the integer sequence from the ASN.1/DER encoded input.
 *
 * @param {Uint8Array} input - The input ASN.1/DER encoded signature.
 * @returns {Array<Uint8Array>} - An array containing the extracted integer values as Uint8Array.
 * @throws {Error} - Throws an error if the input is not a valid ASN.1 sequence or if the elements are not ASN.1 INTEGERs.
 */
function readASN1IntegerSequence(input) {
  // Check if the input starts with the ASN.1 SEQUENCE tag (0x30)
  if (input[0] !== 0x30) throw new Error("Input is not an ASN.1 sequence");

  // Read the length of the sequence
  const seqLength = input[1];

  // Array to hold the extracted elements
  const elements = [];

  // Slice the input to get the actual sequence content, skipping the first two bytes (tag and length)
  let current = input.slice(2, 2 + seqLength);

  // Loop through the sequence to extract individual elements
  while (current.length > 0) {
    // Read the tag of the current element
    const tag = current[0];

    // Check if the current element is an INTEGER (tag 0x02)
    if (tag !== 0x02) {
      throw new Error("Expected ASN.1 sequence element to be an INTEGER");
    }

    // Read the length of the current element
    const elLength = current[1];

    // Extract the current element and add it to the elements array, skipping the tag and length bytes
    elements.push(current.slice(2, 2 + elLength));

    // Move to the next element in the sequence
    current = current.slice(2 + elLength);
  }
  return elements;
}

// ------------------------------------------------------------------------------------------------

module.exports = convertECDSAASN1Signature;

// ------------------------------------------------------------------------------------------------
