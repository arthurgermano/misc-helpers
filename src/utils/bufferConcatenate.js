/**
 * Concatenates two ArrayBuffer objects.
 * @param {ArrayBuffer} buffer1 - The first ArrayBuffer.
 * @param {ArrayBuffer} buffer2 - The second ArrayBuffer.
 * @returns {ArrayBuffer} The concatenated ArrayBuffer.
 */
function bufferConcatenate(buffer1, buffer2) {
  if (!buffer1 || !buffer2) {
    return null;
  }
  // Create Uint8Arrays from the buffers
  const array1 = new Uint8Array(buffer1);
  const array2 = new Uint8Array(buffer2);

  // Create a new Uint8Array with a length equal to the sum of the lengths of the input arrays
  const concatenatedArray = new Uint8Array(array1.length + array2.length);

  // Copy the contents of the input arrays into the concatenated array
  concatenatedArray.set(array1);
  concatenatedArray.set(array2, array1.length);

  // Convert the concatenated Uint8Array back to an ArrayBuffer
  return concatenatedArray.buffer;
}

// ------------------------------------------------------------------------------------------------

module.exports = bufferConcatenate;

// ------------------------------------------------------------------------------------------------
