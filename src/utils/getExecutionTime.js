// ------------------------------------------------------------------------------------------------

/**
 * @summary. Return the time passed in milliseconds of a given time
 * @param {BigInteger} time - The time in milliseconds to be compared
 * @returns {BigInteger} - Returns the milliseconds passed from a given time
 */
function getExecutionTime(time = 0) {
	const NS_PER_SEC = 1e9;
	const MS_PER_NS = 1e-6;
	const diff = process.hrtime(time);
	return (diff[0] * NS_PER_SEC + diff[1] * MS_PER_NS).toFixed(3);
}

// ------------------------------------------------------------------------------------------------

module.exports = getExecutionTime;

// ------------------------------------------------------------------------------------------------