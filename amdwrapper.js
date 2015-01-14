/* jshint browser:true */
(function () {

var define, requireModule, require, requirejs;

(function() {

	var _isArray;
	if (!Array.isArray) {
		_isArray = function (x) {
			return Object.prototype.toString.call(x) === '[object Array]';
		};
	} else {
		_isArray = Array.isArray;
	}

	var registry = {}, seen = {};
	var FAILED = false;

	var uuid = 0;

	function tryFinally(tryable, finalizer) {
		try {
			return tryable();
		} finally {
			finalizer();
		}
	}


	function Module(name, deps, callback, exports) {
		var defaultDeps = ['require', 'exports', 'module'];

		this.id       = uuid++;
		this.name     = name;
		this.deps     = !deps.length && callback.length ? defaultDeps : deps;
		this.exports  = exports || { };
		this.callback = callback;
		this.state    = undefined;
	}

	define = function(name, deps, callback) {
		if (!_isArray(deps)) {
			callback = deps;
			deps     =  [];
		}

		registry[name] = new Module(name, deps, callback);
	};

	define.amd = {};

	function reify(mod, name, seen) {
		var deps = mod.deps;
		var length = deps.length;
		var reified = new Array(length);
		var dep;
		// TODO: new Module
		// TODO: seen refactor
		var module = { };

		/* jshint loopfunc:true */
		for (var i = 0, l = length; i < l; i++) {
			dep = deps[i];
			if (dep === 'exports') {
				module.exports = reified[i] = seen;
			} else if (dep === 'require') {
				reified[i] = function requireDep(dep) {
					return require(resolve(dep, name));
				};
			} else if (dep === 'module') {
				mod.exports = seen;
				module = reified[i] = mod;
			} else {
				reified[i] = require(resolve(dep, name));
			}
		}

		return {
			deps: reified,
			module: module
		};
	}

	requirejs = require = requireModule = function (name) {
		var mod = registry[name];
		if (!mod) {
			throw new Error('Could not find module ' + name);
		}

		if (mod.state !== FAILED &&
				seen.hasOwnProperty(name)) {
			return seen[name];
		}

		var reified;
		var module;
		var loaded = false;

		seen[name] = { }; // placeholder for run-time cycles

		tryFinally(function() {
			reified = reify(mod, name, seen[name]);
			module = mod.callback.apply(this, reified.deps);
			loaded = true;
		}, function() {
			if (!loaded) {
				mod.state = FAILED;
			}
		});

		var obj;
		if (module === undefined && reified.module.exports) {
			obj = reified.module.exports;
		} else {
			obj = seen[name] = module;
		}

		if (obj !== null &&
				(typeof obj === 'object' || typeof obj === 'function') &&
				obj['default'] === undefined) {
			obj['default'] = obj;
		}

		return (seen[name] = obj);
	};

	function resolve(child, name) {
		if (child.charAt(0) !== '.') { return child; }

		var parts = child.split('/');
		var nameParts = name.split('/');
		var parentBase = nameParts.slice(0, -1);

		for (var i = 0, l = parts.length; i < l; i++) {
			var part = parts[i];

			if (part === '..') { parentBase.pop(); }
			else if (part === '.') { continue; }
			else { parentBase.push(part); }
		}

		return parentBase.join('/');
	}

	requirejs.entries = requirejs._eak_seen = registry;
	requirejs.clear = function(){
		requirejs.entries = requirejs._eak_seen = registry = {};
		seen = state = {};
	};

})();

<%= contents %>

window.linkify = require('linkifyjs/linkify');

})();
})();
