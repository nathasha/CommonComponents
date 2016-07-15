/**
 * Shuttles click events that bubble up to <body> to the appropriate namespace via PubSub.
 * @module 'eventShuttle'
 * @author ephipps
 *
 * @requires pubsub-js
 *
 * @returns {function} on - Turns on the body tag event listener
 * @returns {function} off - Turns off the body tag event listener, via handler
 *
 * @description
 __Add an event data attribute and/or some associated data:__
 ```html
 <button type="button" data-event-name="some.event.name" data-event-data="some specific event data">Event!</button>
 ```

 __Subscribe to the event via the events.js module (wrapper of PubSubJS):__

 ```javascript
 // require eventShuttle once in the main app
 require('utils/eventShuttle');
 // require events if subscribing or publishing from the current module
 var ps = require('utils/events');

 ps.subscribe('some.event.name', function(name, data) {
	console.log(name, data); // 'some.event.name', 'some specific event data'
});
 ```
 */

var ps = require('utils/events');

/**
 * The event handler.
 * @param {object} e - The event object.
 */
function shuttleEvents(e) {
	var eventName = e.target.dataset.eventName;

	// check if the event name data attribute on the clicked element has been populated
	if (eventName) {
		// publish the event, including the data, if any (if none, will publish undefined)
		ps.publish(eventName, e.target.dataset.eventData);
	}
}

/**
 * Function for assigning the event handler to the body tag.
 * @name on
 * @public
 */
function addBodyListener() {
	// remove a handler, if it exists
	removeBodyListener();
	document.body.addEventListener('click', shuttleEvents);
}

/**
 * Function for removing the assigned event handler.
 * @name off
 * @public
 */
function removeBodyListener() {
	document.body.removeEventListener('click', shuttleEvents);
}

module.exports = {
	on: addBodyListener,
	off: removeBodyListener
};


