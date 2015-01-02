var glob = require('glob');
require('chai').should(); // Initialize should assertions

// Require test files
glob.sync('./spec/**/*.js', {cwd: __dirname}).map(require);
