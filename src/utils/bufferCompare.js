/**
 * Compares two ArrayBuffer objects for equality.
 * @param {ArrayBuffer} buffer1 - The first ArrayBuffer.
 * @param {ArrayBuffer} buffer2 - The second ArrayBuffer.
 * @returns {boolean} True if the buffers are equal, false otherwise.
 */
function bufferCompare(buffer1, buffer2) {
  if (!buffer1 || !buffer2 || buffer1.byteLength !== buffer2.byteLength) {
    return false;
  }

  const view1 = new Uint8Array(buffer1);
  const view2 = new Uint8Array(buffer2);
  for (let i = 0; i < view1.length; i++) {
    if (view1[i] !== view2[i]) return false;
  }
  return true;
}

// ------------------------------------------------------------------------------------------------

module.exports = bufferCompare

// ------------------------------------------------------------------------------------------------