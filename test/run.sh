#!/usr/bin/env bash
set -e

# Run complete test suite only these conditions hold
if [[ "$1" == "--dist" ]]; then
	echo "Running complete test suite..."
	# npm run lint  # Causes segfault, pause for now
	npm run test:coverage
	npm run build:ci
	npm run copy
	if [[ "${BROWSERSTACK_USERNAME}" != "" ]] && [[ "${BROWSERSTACK_ACCESS_KEY}" != "" ]]; then
		npm run test:ci
		sleep 3  # Wait for threads to exit?
	fi
else
	# Run basic tests
	echo "Running basic tests..."
	npm test
	sleep 3  # Wait for threads to exit?
fi
