function isIE8() {
	var myNav = navigator.userAgent.toLowerCase();
	return (myNav.indexOf('msie') !== -1) ? parseInt(myNav.split('msie')[1]) === 8 : false;
}

if (!isIE8()) {
	if (typeof define === 'function') {
		// Include shim modules for React to be loaded asynchronously
		document.write('<script src="/base/test/qunit/react.amd.js" crossorigin="anonymous"></script>');
		document.write('<script src="/base/dist/linkify-react.amd.min.js" crossorigin="anonymous"></script>');
	} else {
		// Include React on the page directly
		document.write('<script src="/base/vendor/react.min.js" crossorigin="anonymous"></script>');
		document.write('<script src="/base/vendor/react-dom.min.js" crossorigin="anonymous"></script>');
		document.write('<script src="/base/dist/linkify-react.min.js" crossorigin="anonymous"></script>');
	}
}
