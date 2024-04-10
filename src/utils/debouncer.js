// ------------------------------------------------------------------------------------------------

/**
 * @summary. Debounce a function until it is the right moment to execute
 * @param {Function} callback - The function to be executed when timeout
 * @param {Integer} timeout - The timeout in milliseconds
 */
function debouncer(callback, timeout = 1000) {
  try {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        try {
          await callback.apply(this, args);
        } catch (error) {
          throw error;
        }
      }, timeout);
    };
  } catch (error) {
    throw error;
  }
}

// ------------------------------------------------------------------------------------------------

module.exports = debouncer;

// ------------------------------------------------------------------------------------------------
