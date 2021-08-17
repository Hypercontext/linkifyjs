#!/usr/bin/env bash
set -e

# Run complete test suite only these conditions hold
# * SauceLabs credentials are defined
# * The node version is 14.*
# * The jQuery version is 1.*
#	- so only a single member machine in the matrix calls sauce

if [[ "$BROWSERSTACK_ACCESS_KEY" != "" && "$BROWSERSTACK_USERNAME" != "" && "$1" == "16.x" ]]; then
	# Run build, basic tests and SauceLabs tests
	echo "Running complete test suite..."
	npm test
	npm run dist:ci
	npm run test:ci
	sleep 3  # Wait for threads to exit?
else
	# Run basic tests
	echo "Running basic tests..."
	npm test
	sleep 3  # Wait for threads to exit?
fi
