const glob = require('glob');
require('./init');
global.__base = __dirname.replace(/test$/, 'src/');

// Require test files
beforeEach(() => { require('../src/linkify').reset(); });
glob.sync('./spec/**/*-test.js', {cwd: __dirname}).map(require);
