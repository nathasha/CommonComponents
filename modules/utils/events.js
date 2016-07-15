/**
 * Wrapper for PubSubJS.
 * @module 'eventsWrapper'
 * @author ephipps
 * @requires pubsub-js
 * @returns {function} publish - Method to publish events via PubSubJS
 * @returns {function} subscribe - Method to subscribe to events published by PubSubJS
 * @returns {function} clearAllSubscriptions - Method to clear all PubSubJS subscriptions
 * @returns {function} unsubscribe - Method to unsubscribe from a PubSubJS event subscription
 */

var ps = require('pubsub-js');

/**
 * Method to publish events via PubSubJS.
 * @param {string} name - The event name.
 * @param {*} data - The event data package. Can be any type.
 * @public
 */
function publish(name, data) {
	ps.publish(name, data);
	// window.console.log('published: ', name, data, 'timestamp: ' + Math.round(new Date() / 1000));
}

/**
 * Method to subscribe to events published by PubSubJS.
 * @param {string} name - The event name.
 * @param {function} handler - The event handler function.
 * @public
 */
function subscribe(name, handler) {
	ps.subscribe(name, handler);
}

/**
 * Method to clear all PubSubJS subscriptions.
 * @public
 */
function clearAllSubscriptions() {
	ps.clearAllSubscriptions();
}

/**
 * Method to unsubscribe from a PubSubJS event subscription
 * @param {string|object} tokenOrName - The event name or a cached token of the event listener.
 * @public
 */
function unsubscribe(tokenOrName) {
	ps.unsubscribe(tokenOrName);
}

module.exports = {
	publish : publish,
	subscribe : subscribe,
	clearAllSubscriptions : clearAllSubscriptions,
	unsubscribe : unsubscribe
};
