var glob = require('glob');
global.__base = __dirname.replace(/test$/, '');
require('chai').should(); // Initialize should assertions

// Require test files
glob.sync('./spec/**/*.js', {cwd: __dirname}).map(require);
