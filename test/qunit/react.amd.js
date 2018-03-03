// React expects to be loaded asynchronously by AMD
define('react', ['base/vendor/react.min', 'exports'], function (React, exports) {
	return exports.React = React;
});
define('react-dom', ['base/vendor/react-dom.min', 'exports'], function (ReactDOM, exports) {
	return exports.ReactDOM = ReactDOM;
});
