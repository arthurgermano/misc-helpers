// ------------------------------------------------------------------------------------------------

/**
 * @summary. Push a message into a log object with the time
 * @param {String} logObj - The Log Object
 * @param {Boolean} message - The message to be pushed
 * @param {Any} more_info - More information to be added
 * @returns {String} - Returns the log object with a new message pushed into the array
 */
function pushLogMessage(logObj, message, more_info) {
  if (!Array.isArray(logObj)) {
    logObj = [];
  }
  logObj.push({
    time: new Date().toISOString(),
    message,
    more_info,
  });
  return logObj;
}

// ------------------------------------------------------------------------------------------------

module.exports = pushLogMessage;

// ------------------------------------------------------------------------------------------------
