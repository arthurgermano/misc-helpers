import bufferConcatenate from "../../utils/bufferConcatenate";

// ------------------------------------------------------------------------------------------------

/**
 * Converts an ECDSA signature from ASN.1/DER format to concatenated r|s format.
 * 
 * The function expects an ASN.1 SEQUENCE containing exactly two INTEGER elements (r and s).
 * Both r and s components are normalized to be multiples of 128 bits (16 bytes) by:
 * - Removing leading zero bytes used for two's complement padding
 * - Adding zero padding when components are 15 bytes (one byte short of 16-byte boundary)
 *
 * @param {Uint8Array} asn1Signature - The input signature in ASN.1/DER format
 * @returns {Uint8Array} The signature in concatenated r|s format where both r and s are 128-bit aligned
 * @throws {Error} If the input doesn't contain exactly 2 ASN.1 sequence elements
 * @throws {Error} If r or s components have unexpected lengths after normalization
 */
function convertECDSAASN1Signature(asn1Signature) {
  const elements = readASN1IntegerSequence(asn1Signature);
  
  if (elements.length !== 2) {
    throw new Error("Expected 2 ASN.1 sequence elements");
  }
  
  let [r, s] = elements;

  // Normalize r component to 128-bit boundary
  r = normalizeECDSAComponent(r);
  
  // Normalize s component to 128-bit boundary  
  s = normalizeECDSAComponent(s);

  // Concatenate normalized r and s components
  return bufferConcatenate(r, s);
}

// ------------------------------------------------------------------------------------------------

/**
 * Normalizes an ECDSA signature component (r or s) to be a multiple of 128 bits (16 bytes).
 * 
 * This function handles two cases:
 * 1. Removes leading zero byte if present for two's complement and length is 16n+1
 * 2. Adds leading zero byte padding if length is 16n-1 (15 bytes)
 *
 * @param {Uint8Array} component - The signature component to normalize
 * @returns {Uint8Array} The normalized component aligned to 128-bit boundary
 * @throws {Error} If the component length is not a multiple of 16 bytes after normalization
 */
function normalizeECDSAComponent(component) {
  const length = component.byteLength;
  let normalized = component;
  
  // Remove leading zero byte used for two's complement if length is 16n+1
  if (component[0] === 0 && length % 16 === 1) {
    normalized = component.slice(1);
  }
  // Add leading zero byte padding if length is 16n-1 (15 bytes)
  else if (length % 16 === 15) {
    const padding = new Uint8Array([0]);
    normalized = new Uint8Array(bufferConcatenate(padding, component));
  }

  // Validate that the component is now properly aligned to 128-bit boundary
  if (normalized.byteLength % 16 !== 0) {
    throw new Error("unknown ECDSA sig r length error");
  }

  return normalized;
}

// ------------------------------------------------------------------------------------------------

/**
 * Parses an ASN.1/DER encoded sequence and extracts all INTEGER elements.
 * 
 * This function performs basic ASN.1 parsing by:
 * 1. Validating the input starts with SEQUENCE tag (0x30)
 * 2. Reading the sequence length from the second byte
 * 3. Iterating through elements, ensuring each is an INTEGER (0x02)
 * 4. Extracting the value portion of each INTEGER element
 *
 * @param {Uint8Array} input - The ASN.1/DER encoded sequence
 * @returns {Array<Uint8Array>} Array of INTEGER values as Uint8Array buffers
 * @throws {Error} If input is not a valid ASN.1 SEQUENCE
 * @throws {Error} If any sequence element is not an ASN.1 INTEGER
 */
function readASN1IntegerSequence(input) {
  // Validate ASN.1 SEQUENCE tag
  if (input[0] !== 0x30) {
    throw new Error("Input is not an ASN.1 sequence");
  }

  // Extract sequence length from second byte
  const sequenceLength = input[1];
  const elements = [];
  
  // Get sequence content, skipping tag and length bytes
  let position = 2;
  const sequenceEnd = position + sequenceLength;

  // Parse all elements within the sequence
  while (position < sequenceEnd) {
    const tag = input[position];
    
    // Validate INTEGER tag
    if (tag !== 0x02) {
      throw new Error("Expected ASN.1 sequence element to be an INTEGER");
    }

    // Read element length
    const elementLength = input[position + 1];
    
    // Extract element value, skipping tag and length bytes
    const elementValue = input.slice(position + 2, position + 2 + elementLength);
    elements.push(elementValue);
    
    // Advance position to next element
    position += 2 + elementLength;
  }

  return elements;
}

// ------------------------------------------------------------------------------------------------

export default convertECDSAASN1Signature;

// ------------------------------------------------------------------------------------------------