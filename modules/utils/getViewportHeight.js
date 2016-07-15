/**
 * Gets the absolute height of the viewport.
 * @module 'getViewportHeight'
 * @author ephipps
 */

/**
 * Gets the actual height of the viewport and returns it
 * @returns {number}
 */
module.exports = function () {
	return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
};
