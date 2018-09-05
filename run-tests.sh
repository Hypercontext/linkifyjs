node_v=$(node --version)

# Run complete test suite only these conditions hold
# * SauceLabs credentials are defined
# * The node version is 6.*
# * The jQuery version is 1.*
#	- so only a single member machine in the matrix calls sauce

if [[ $(echo $SAUCE_USERNAME) != "" && $(echo $node_v) == v8.* && $(echo $JQUERY_VERSION) == 1.* ]]; then
	# Run basic and SauceLabs tests
	echo "Running complete test suite..."
	npx gulp test || exit 1
	npx karma start test/ci.conf.js || exit 1
else
	# Run basic tests
	echo "Running basic tests..."
	npx gulp test || exit 1
fi
