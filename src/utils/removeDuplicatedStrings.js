const toString = require("./toString.js");

// ------------------------------------------------------------------------------------------------

/**
 * @summary. Return a string with duplicated strings removed
 * @param {String} text - Value to be checked
 * @param {String} splitString - The split string char
 * @returns {String} - Returns a string with duplicated strings removed
 */
function removeDuplicatedStrings(text, splitString = " ") {
	const array = toString(text).toString().trim().split(splitString);
	return [...new Set(array)].join(splitString);
}

// ------------------------------------------------------------------------------------------------

module.exports = removeDuplicatedStrings;

// ------------------------------------------------------------------------------------------------