// ------------------------------------------------------------------------------------------------

/**
 * @summary. Returns the between conditions in an object format
 * @param {Object} object - the object with the values
 * @param {String} key - The key name that holds the value object
 * @param {String} beforeKey - The key name that holds the until value object
 * @param {String} afterKey - The key name that holds the from value object
 * @returns {Object} - Returns the between conditions in an object format
 */
function setConditionBetweenValues(
  object,
  key = "value",
  beforeKey = "value_until",
  afterKey = "value_from"
) {
  if (!object || (!object[afterKey] && !object[beforeKey])) {
		return;
	}
	if (object[afterKey]) {
		object[key] = {
			$and: [
				{
					$gte: object[afterKey],
				},
			],
		};
	}
	if (object[beforeKey]) {
		if (object[key]) {
			object[key].$and.push({
				$lte: object[beforeKey],
			});
		} else {
			object[key] = {
				$and: [
					{
						$lte: object[beforeKey],
					},
				],
			};
		}
	}
  return object;
}

// ------------------------------------------------------------------------------------------------

module.exports = setConditionBetweenValues;

// ------------------------------------------------------------------------------------------------
