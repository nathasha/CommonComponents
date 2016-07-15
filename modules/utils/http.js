/**
 * Http helper module. Contains the http method for making api calls. Returns a promise. Addapted from MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise#Example_using_new_XMLHttpRequest()
 * @module 'http'
 * @author ephipps
 */

// auto polyfill es6 Promise for unsupported browsers
require('es6-promise').polyfill();

/**
 * Promise for making basic http api calls.
 * @param {string} url - the api's url
 * @returns {Object} - http adapter methods ('GET', 'POST', 'PUT', 'DELETE')
 */
module.exports = function (url) {
	'use strict';

	/**
	 * Sets up the Promise for making api calls.
	 * @param  {string} method The request type. Accepted values are 'GET', 'POST', 'PUT', 'DELETE'
	 * @param  {string} url    The api's url
	 * @param  {object} args   The data arguments to be passed with the call
	 * @return {promise}       The Promise for the call
	 */
	function ajax(method, url, args) {

		/**
		 * Retrieve something from an api call
		 * @returns {Promise.<object|Error>} The data received from the api call, or an error if something goes wrong
		 */
		var promise = new Promise(function (resolve, reject) {
			var client,
				uri,
				argcount,
				key;

			// Instantiates the XMLHttpRequest
			client = new XMLHttpRequest();
			uri = url;

			if (args && (method === 'POST' || method === 'PUT')) {
				uri += '?';
				argcount = 0;

				for (key in args) {
					if (args.hasOwnProperty(key)) {
						if (argcount++) {
							uri += '&';
						}
						uri += encodeURIComponent(key) + '=' + encodeURIComponent(args[key]);
					}
				}
			}

			client.open(method, uri);
			client.send();

			client.onload = function () {

				if (this.status === 200) {

					resolve(this.response);

				} else {
					// Performs the function "reject" when this.status is different than 200
					reject(this.statusText);
				}
			};

			client.onerror = function () {
				reject(this.statusText);
			};

		});

		// Return the promise
		return promise;
	}

	/** The return object's adapters for making requests via the specific type required. */
	return {
		/**
		 * 'get' type of XMLHttpRequest
		 * @param {object} [args] - Data package for get
		 * @returns {promise}
		 */
		'get' : function (args) {
			return ajax('GET', url, args);
		},
		/**
		 * 'post' type of XMLHttpRequest
		 * @param {object} [args] - Data package for post
		 * @returns {promise}
		 */
		'post' : function (args) {
			return ajax('POST', url, args);
		},
		/**
		 * 'put' type of XMLHttpRequest
		 * @param {object} [args] - Data package for put
		 * @returns {promise}
		 */
		'put' : function (args) {
			return ajax('PUT', url, args);
		},
		/**
		 * 'delete' type of XMLHttpRequest
		 * @param {object} [args] - Data package for delete
		 * @returns {promise}
		 */
		'delete' : function (args) {
			return ajax('DELETE', url, args);
		}
	};
};
