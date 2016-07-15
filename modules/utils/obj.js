/**
 * Object helper module. Deprecated! Use Lodash assign/extend instead.
 * @module 'obj'
 */

/**
 * Method to extend an object
 * @param {Object} target
 * @param {Object} source
 * @return {Object}
 */
exports.extend = function (target, source) {
	var key;

	for (key in source) {
		if (source.hasOwnProperty(key)) {
			target[key] = source[key];
		}
	}
	return target;
};
