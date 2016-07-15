/**
 * Load More component for fetching and injecting content back into the DOM
 * @module 'loadMoreContentStream.1.0.0'
 * @version 1.0.0
 * @fires 'loadMoreContentStream.initialize'
 * @fires 'loadMoreContentStream.click.loadMore'
 * @fires 'loadMoreContentStream.incomingItemsAddedToDom'
 * @fires 'messaging.generic.error'
 */

/**
 * The incomingItemsCallback is passed in to init(config.options.incomingItemsCallback). The callback executes after the apiUrl call has been made and the returned html string has been converted to nodes in a document fragment. It expects the document fragment to be returned.
 * @callback incomingItemsCallback
 * @param {DocumentFragment} docFragment  - a document fragment containing the response html string returned from the apiUrl
 * @param {object} props - the module's props object
 */

var ps = require('utils/events'),
	assign = require('lodash/object/assign'),
	http = require('utils/http.1.0.0'),
	template = require('lodash/string/template'),
	_unescape = require('lodash/string/unescape'),
	getFrag = require('utils/htmlStringToDocFragment.1.0.0'),
	dom = {}, // holds cached dom items
	callbacks = {},
	props = {
		pageNumber: 0,
		apiUrl: '',
		cssName: 'LoadMore',
		cssClassLoadMoreAnimation: 'LoadMore-animation',
		cssClassLoadMore: 'js-loadmore',
		cssClassItemList: 'js-itemList',
		apiData: {}
	};

/**
 * Handles processing module config coming in during initialization. Also kicks off event handlers.
 * @param {object} config - A module configuration object
 * @param {object} config.container - A node, most likely from the dom
 * @param {object} config.options - A hash of options, to be merged with local props
 * @param {object} config.options.pageNumber - the initial pageNumber, usually 1
 * @param {object} config.options.apiUrl - the load more api url, can contain tokens in this format: ${tokenName}
 * @param {object} [config.options.apiData] - the data for parsing the apiUrl, if the apiUrl has been tokenized
 * @param {string} [config.options.cssName] - The module's class name
 * @param {string} [config.options.cssClassLoadMoreAnimation] - The Load More button's animation class name
 * @param {object} [config.options.cssClassLoadMore=js-loadmore] - the load more button's js hook class name
 * @param {object} [config.options.cssClassItemList=js-itemList] - the item list's js hook class name
 * @param {function} [config.options.incomingItemsCallback] - the callback fired when content is ready for injection into the dom
 */
exports.init = function (config) {
	// cache the container element
	dom.container = config.container;

	dom.itemList = dom.container.querySelector('.' + props.cssClassItemList);
	dom.loadMore = dom.container.querySelector('.' + props.cssClassLoadMore);

	// if props incoming in config.options
	if (config.options) {
		assign(props, config.options);
	}

	// if configurations incoming on data attribute
	if (dom.container.dataset.options) {
		// extend the internal props object with configuration coming from data attribute
		assign(props, JSON.parse(dom.container.dataset.options));
	}

	// if callbacks, add to callbacks object
	if (config.callbacks) {
		callbacks = config.callbacks;
	}

	// delegate events
	dom.container.addEventListener('click', handleLoadMore);

	/**
	 * The module initialization event
	 * @event 'loadMoreContentStream.initialize'
	 * @type {object}
	 * @property {object} props - the module's props object. this contains incoming properties passed in config and via the container data-options attribute.
	 * @property {object} dom - the dom object.
	 */
	ps.publish('loadMoreContentStream.initialize', {
		props: props,
		dom: dom
	});

};


/**
 * Handles clicks on the Load More button
 * @param {Object} event
 * @private
 */
function handleLoadMore(event) {
	if (event.target.classList.contains(props.cssClassLoadMore)) {
		props.pageNumber = props.pageNumber + 1;

		/**
		 * The module initialization event
		 * @event 'loadMoreContentStream.click.loadMore'
		 * @type {object}
		 * @property {object} props - the module's props object. this contains incoming properties passed in config and via the container data-options attribute.
		 * @property {object} dom - the dom object.
		 */
		ps.publish('loadMoreContentStream.click.loadMore', {
			props: props,
			dom: dom
		});

		dom.container.classList.add(props.cssName + '--loading');

		disableLoadMore();
		dom.loadMore.innerHTML = '<span class="' + props.cssClassLoadMoreAnimation + '"></span>';

		getNextPage();
	}
}

/**
 * Gets the next page's content from the apiUrl
 * @private
 */
function getNextPage() {
	var callback;

	callback = {
		success : function (response) {
			var data = response.data;

			if (data.isLastPage) {
				props.lastPageReached = true; // flag needed so the button doesn't get re-enabled
				disableLoadMore();
			}

			addToDomList(data.listHtml.trim());
		},
		error : function () {
			//var message = err.messages[0].text;
			/**
			 * The generic messaging error event. No data is passed.
			 * @event 'messaging.generic.error'
			 */
			ps.publish('messaging.generic.error');
		}
	};

	http(parseApiTemplate())
		.get()
		.then(callback.success)
		.catch(callback.error);
}

/**
 * Adds the response's html to the dom
 * @param {string} htmlString
 * @private
 */
function addToDomList(htmlString) {
	var unescaped,
		docFragment;

	unescaped = _unescape(htmlString).replace(/&#034;/g, '"').replace(/&#039;/g, '\'');

	docFragment = getFrag(unescaped);

	// expose the nodes to a callback for any outside manipulations
	if (typeof callbacks.incomingItemsCallback === 'function') {
		docFragment = callbacks.incomingItemsCallback(props, docFragment);
	}

	dom.itemList.appendChild(docFragment);

	/**
	 * The module initialization event
	 * @event 'loadMoreContentStream.click.loadMore'
	 * @type {object}
	 * @property {object} props - the module's props object. this contains incoming properties passed in config and via the container data-options attribute.
	 * @property {object} dom - the dom object.
	 */
	ps.publish('loadMoreContentStream.incomingItemsAddedToDom', {
		props: props,
		dom: dom
	});

	dom.container.classList.remove(props.cssName + '--loading');

	if (!props.lastPageReached) {
		enableLoadMore();
	}

	dom.loadMore.innerHTML = 'Load More';
}

/**
 * Disables the Load More button (for when the isLastPage is true)
 * @private
 */
function disableLoadMore() {
	dom.loadMore.setAttribute('disabled', 'disabled');
}

/**
 * Enables the Load More button
 * @private
 */
function enableLoadMore() {
	dom.loadMore.removeAttribute('disabled');
}

/**
 * Parses the api template string with props.apiData
 * @private
 * @returns {string} - parsed with props.apiData
 */
function parseApiTemplate() {
	var compiled,
		hasTokens = props.apiUrl.indexOf('${') !== -1;

	// if apiUrl has ES style tokens, parse with lodash template
	if (hasTokens) {

		// add the current page number to the apiData props object
		props.apiData.pageNumber = props.pageNumber;

		compiled = template(props.apiUrl);
		compiled = compiled(props.apiData);
	}

	return !!compiled ? compiled : props.apiUrl;
}
