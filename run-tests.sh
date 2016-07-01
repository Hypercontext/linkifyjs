node_v=$(node --version)

# Run complete test suite only these conditions hold
# * We're pushing to the master branch on Travis
# * SauceLabs credentials are defined
# * The node version is 6.*
#	- so only a single member machine in the matrix calls sauce

if [[ $(echo $TRAVIS_BRANCH) = "master" && $(echo $SAUCE_USERNAME) != "" && $(echo $node_v) == v6.* ]]; then
	# Run basic and SauceLabs tests
	echo "Running complete test suite..."
	npm test || exit 1
	npm run test-ci || exit 1
else
	# Run basic tests
	echo "Running basic tests..."
	npm test || exit 1
fi
