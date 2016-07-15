/**
 * Relays messages from a child iframe, to the api and back to the child using postMessage.
 * @author ephipps
 * @version  1.0
 * @module intrazonGameRelayParent
 * @returns {{init:function}} - Public initialization method
 */

var assign = require('lodash/object/assign'),
	http = require('utils/http'),
	events = require('utils/events'),
	state = {};

/**
 * Initialize method for an intrazonGameRelayParent instance.
 * @memberOf intrazonGameRelayParent
 * @param {object} config - Configuration object for initialization
 * @param {object} config.childFrame - The contentWindow of the iframe node
 * @param {string} config.authJwt - the JWT authentication string. An empty string if not logged in
 * @param {boolean} config.isLoggedIn
 * @param {string} config.targetOrigin - The domain sending the postMessage communication
 * @public
 */
function init(config) {

	// override any state present in the incoming configuration
	state = assign(state, config);

	// if no targetOrigin is passed in with config, construct the target origin from the iframe src
	if (!state.targetOrigin) {
		state.targetOrigin = state.childFrame.src.split(':')[0] + '://' + state.childFrame.src.split('/')[2];
	}

	// bind the event listeners and handlers
	window.addEventListener('message', incomingMessageHandler);

	events.subscribe('login.success', loginHandler);

	// on init, send token (if logged in) down to the childFrame, after page load has completed to ensure the child
	// iframe module postMessage 'message' listener is listening
	if (state.authJwt) {
		window.addEventListener('load', pageLoadHandler);
	}
}

/**
 * Handles login event
 * @param {object} event - the pubsub event
 * @param {string} authJwt - an active authJwt
 */
function loginHandler(event, authJwt) {

	// set the state to authJwt coming from login.success event
	state.authJwt = authJwt;

	// send down to childFrame without param
	sendAuthJwtToIframe();

}

/**
 * Sends the active authJwt to the child iframe OR sends an error message if one has occurred
 * @param {object} [obj] - the object that gets passed down to the child iframe
 * @param {string} [obj.authJwt] - the active authJwt token
 * @param {string} [obj.error] - an error message, if one has occurred
 */
function sendAuthJwtToIframe(obj) {
	var messageObj = {
		intrazon : !!obj ? obj : {} // if no obj is passed in, set the intrazon prop to an empty object
	};

	// if no obj is passed, get the authJwt token from state
	if (!obj) {
		messageObj.intrazon.authJwt = state.authJwt;
	}

	state.childFrame.contentWindow.postMessage(messageObj,  state.targetOrigin);
}

/**
 * Handles the 'load' event. Sends the authJwt token to the childFrame.
 */
function pageLoadHandler() {

	sendAuthJwtToIframe({
		authJwt : state.authJwt
	});

	// remove the listener event as it is no longer needed
	window.removeEventListener('load', pageLoadHandler);
}


/**
 * Handles incoming 'message' events from the child iframe. Validates that the message is from the expected iframe,
 * and handles calling the appropriate functions based on the incoming event name.
 * @param event
 */
function incomingMessageHandler(event) {

	// if the message does not come from an expected source, bail
	if (event.origin !==  state.targetOrigin) {
		return;
	}

	// make sure this is an authJwt token request message
	if (event.data === 'authJwt.request') {

		// if not logged in, request that the user log in
		if (ag.loggedIn) {
			// Validate the current authJwt token
			validateAuthJwtToken();
		} else {
			events.publish('login.request');
		}
	}
}

/**
 * Authenticates the token and gives the token to sendAuthJwtToIframe() to send down to the game iframe.
 */
function validateAuthJwtToken() {
	var api,
		callback = {},
		intrazonObj = {};

	// set the api url
	api = '/user/validateAuthJwt.jsp?authJwt=' + state.authJwt;

	// add methods to the callback object for success and error
	callback.success = function (response) {

		if (response === 'Invalid : General' || response === 'Invalid : Malformed JWT') {
			intrazonObj.error = 'invalid';
		} else {
			intrazonObj.authJwt = response;

			// set the internally cached authJwt token to the value coming back from the server
			state.authJwt = intrazonObj.authJwt;
		}

		// send the authJwt token back to the childFrame
		sendAuthJwtToIframe(intrazonObj);
	};

	callback.error = function (error) {
		intrazonObj.error = error;

		sendAuthJwtToIframe(intrazonObj);
	};

	// Executes the method call and passing true to use the module's default error display
	http(api)
		.get(ADG.globals.authJwt)
		.then(callback.success)
		.catch(callback.error);
}

exports.init = init;
