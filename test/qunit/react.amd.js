// React expects to be loaded asynchronously by AMD
define('react', ['base/node_modules/react/dist/react', 'exports'], function (React, exports) {
	return exports.React = React;
});
define('react-dom', ['base/node_modules/react-dom/dist/react-dom', 'exports'], function (ReactDOM, exports) {
	return exports.ReactDOM = ReactDOM;
});
