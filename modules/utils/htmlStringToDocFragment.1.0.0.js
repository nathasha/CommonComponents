/**
 * Converts an html string to dom nodes and returns them in a document fragment.
 * @module 'htmlStringToDocFragment'
 * @author ephipps
 */

/**
 * Exports function for converting htmlString to document fragment with child nodes.
 * @param htmlString - must be a string of properly encoded html
 * @returns {DocumentFragment}
 */
module.exports = function (htmlString) {
	var fragment = document.createDocumentFragment(),
		div = document.createElement('div');

	div.innerHTML = htmlString;

	while (div.childNodes.length) {
		fragment.appendChild(div.childNodes[0]);
	}

	return fragment;
};
