REACT_VERSION=15.0.0
JQUERY_VERSION=1.11.0

# If dist mode, install the latest versions
if [ "$1" == "--dist" ]; then
	REACT_VERSION=17.0.0
	JQUERY_VERSION=3.0.0
fi

echo "Installing jquery ${JQUERY_VERSION} and react ${REACT_VERSION}"
npm install --force jquery@~$JQUERY_VERSION react-dom@~$REACT_VERSION react@~$REACT_VERSION

echo "Linking Node.js modules"
cd node_modules
ln -f -s ../packages/* .
cd ..
