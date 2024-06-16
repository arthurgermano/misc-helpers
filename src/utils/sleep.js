/**
 * @summary. Creates a delay for a specified number of milliseconds and optionally returns a value or throws an error.
 * @param {Number} milliseconds - The number of milliseconds to sleep.
 * @param {Any} returnValue - The value to be returned or used in the rejection after the sleep. Default is true.
 * @param {Boolean} throwError - Whether to throw an error after the sleep. Default is false.
 * @returns {Promise<Any>} - A promise that resolves to returnValue after the delay or rejects with returnValue if throwError is true.
 */
function sleep(milliseconds, returnValue = true, throwError = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (throwError) {
        reject(returnValue === true ? new Error("Sleep Error") : returnValue);
      }
      resolve(returnValue);
    }, milliseconds);
  });
}

// ------------------------------------------------------------------------------------------------

module.exports = sleep;

// ------------------------------------------------------------------------------------------------