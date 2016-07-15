/**
 * Sitewide message handler. Listens for published events. Currently only displays a generic message, but could be extended to display prettier messages or even to re-route messages.
 * @module 'simpleNotificationHandler.1.0.0'
 */

var ps = require('utils/events'),
	defaults;

defaults = {
	'messages.global.error' : 'An error has occurred.'
};

/**
 * Initializes the message handler.
 */
exports.init = function () {
	ps.subscribe('messaging.generic.error', genericNotificationHandler);
};

/**
 * Handles generic messages by displaying message in an alert. If no message is passed, refers to defaults message object. If no default is available for that particular message, defaults to the global default.
 * @param {string} eventName - the name of the published pubsub event
 * @param {string} [messageString] - the message itself
 */
function genericNotificationHandler(eventName, messageString) {
	var message = !!messageString ? messageString : defaults[eventName];

	// if no default is defined, message will be 'undefined'. set it to the global default
	if (!message) {
		message = defaults['messages.global.error'];
	}

	window.alert(message);
}
