/**
 * Gets the absolute height of a dom element.
 * @module 'getAbsoluteHeight'
 * @author ephipps
 * @version 1.0.0
 */

/**
 * Gets the absolute height of an element
 * param {object} el - The element to get the absolute height
 */
module.exports = function (el) {
	var styles,
		margin;

	// Get the DOM Node if you pass in a string
	el = (typeof el === 'string') ? document.querySelector(el) : el;

	// Get all the styles of the element
	styles = window.getComputedStyle(el);

	// Calculate the top and bottom margin
	margin = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);

	// return the height + margin
	return Math.ceil(el.offsetHeight + margin);
};
