/**
 * Cookie utility for setting, getting, verifying and setting expiration values
 * @module 'cookie.1.0.0'
 * @description
 * A complete cookies reader/writer framework with full unicode support.
 *
 * Revision #1 - September 4, 2014
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
 * https://developer.mozilla.org/User:fusionchess
 *
 * This framework is released under the GNU Public License, version 3 or later.
 * http://www.gnu.org/licenses/gpl-3.0-standalone.html
 *
 * Examples:
 *
 * * cookie.setItem(name, value[, end[, path[, domain[, secure]]]])
 * * cookie.getItem(name)
 * * cookie.removeItem(name[, path[, domain]])
 * * cookie.hasItem(name)
 * * cookie.getKeys()
 *
 */
module.exports = {
	/**
	 * Gets value by key
	 * @param  {string} sKey
	 * @return {string|null} the decoded string
	 */
	getItem: function (sKey) {
		if (!sKey) {
			return null;
		}
		return decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null;
	},
	/**
	 * Sets a cookie
	 * @param {string} sKey - the cookie's name
	 * @param {string} sValue - the cookie's value
	 * @param {string} [vEnd] - The max-age in seconds (e.g. 31536e3 for a year, Infinity for a never-expires cookie), or the expires date in GMTString format or as Date object; if not specified the cookie will expire at the end of session (number – finite or Infinity – string, Date object or null).
	 * @param {string} [sPath] - The path from where the cookie will be readable. E.g., "/", "/mydir"; if not specified, defaults to the current path of the current document location (string or null). The path must be absolute (see RFC 2965). For more information on how to use relative paths in this argument, see this paragraph.
	 * @param {string} [sDomain] - The domain from where the cookie will be readable. E.g., "example.com", ".example.com" (includes all subdomains) or "subdomain.example.com"; if not specified, defaults to the host portion of the current document location (string or null).
	 * @param {Boolean|null} [bSecure] - The cookie will be transmitted only over secure protocol as https (boolean or null).
	 */
	setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
		var sExpires;

		if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
			return false;
		}
		sExpires = '';

		if (vEnd) {
			switch (vEnd.constructor) {
				case Number:
					sExpires = vEnd === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '; max-age=' + vEnd;
					break;
				case String:
					sExpires = '; expires=' + vEnd;
					break;
				case Date:
					sExpires = '; expires=' + vEnd.toUTCString();
					break;
			}
		}
		document.cookie = encodeURIComponent(sKey) + '=' + encodeURIComponent(sValue) + sExpires + (sDomain ? '; domain=' + sDomain : '') + (sPath ? '; path=' + sPath : '') + (bSecure ? '; secure' : '');
		return true;
	},
	/**
	 * Removes the cookie
	 * @param  {string} sKey - the cookie's name
	 * @param  {string} [sPath] - The path from where the cookie will be readable.
	 * @param  {string} [sDomain] - The domain from where the cookie will be readable.
	 * @return {Boolean} - Returns true if successfully removed, false if the cookie key is not present
	 */
	removeItem: function (sKey, sPath, sDomain) {
		if (!this.hasItem(sKey)) {
			return false;
		}
		document.cookie = encodeURIComponent(sKey) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' + (sDomain ? '; domain=' + sDomain : '') + (sPath ? '; path=' + sPath : '');
		return true;
	},
	/**
	 * Checks if a cookie is present
	 * @param  {string}  sKey - the cookie's name
	 * @return {Boolean}
	 */
	hasItem: function (sKey) {
		if (!sKey) {
			return false;
		}
		return (new RegExp('(?:^|;\\s*)' + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=')).test(document.cookie);
	},
	/**
	 * Returns an array of all readable cookies from this location.
	 * @return {array}
	 */
	getKeys: function () {
		var nLen,
			aKeys;

		aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '').split(/\s*(?:\=[^;]*)?;\s*/);
		for (nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
			aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
		}
		return aKeys;
	}
};