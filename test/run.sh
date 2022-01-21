#!/usr/bin/env bash
set -e

# Run complete test suite only these conditions hold
if [[ "$1" == "--dist" ]]; then
	echo "Running complete test suite..."
	npm run lint
	npm run test:coverage
	npm run dist:ci
	npm run test:ci
	sleep 3  # Wait for threads to exit?
else
	# Run basic tests
	echo "Running basic tests..."
	npm test
	sleep 3  # Wait for threads to exit?
fi
