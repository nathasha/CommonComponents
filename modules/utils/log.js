/**
 * Customized log method
 * @module 'utils/log'
 * @TODO Find a better way to test the existence of DFY namespace/globals
 * @example
 * NAMESPACE.utils.log = require('utils/log');
 * NAMESPACE.utils.log('Hello World : ', document);
 */
var log = function () {};

if (typeof DFY !== 'undefined' && typeof DFY.globals !== 'undefined' && typeof DFY.globals.DEBUG !== 'undefined' && DFY.globals.DEBUG === true) {
	if (Function.prototype.bind) {
		try {
			log = Function.prototype.bind.call(console.log, console);
		} catch (ee) {
			log = function () {
				Function.prototype.apply.call(console.log, console, arguments);
			};
		}
	} else {
		log = function () {
			Function.prototype.apply.call(console.log, console, arguments);
		};
	}
}

module.exports = log;
