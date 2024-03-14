// ------------------------------------------------------------------------------------------------

/**
 * @summary. Return the time value given the seconds
 * @param {Number} seconds - Value to be string
 * @param {Boolean} add - Whether is to add the seconds or subtract
 * @returns {Number} - Returns the time
 */
function calculateSecondsInTime(seconds, add = true) {
	if (add) {
		return new Date(Date.now() + seconds * 1000).getTime();
	}
	return new Date(Date.now() - seconds * 1000).getTime();
}
// ------------------------------------------------------------------------------------------------

module.exports = calculateSecondsInTime;

// ------------------------------------------------------------------------------------------------
