REACT_VERSION=0.14.0
JQUERY_VERSION=1.11.0

# If the node version is 10 (the newest) install the latest versions
if [ "$1" == "16.x" ]; then
	REACT_VERSION=16.0.0
	JQUERY_VERSION=3.0.0
fi

echo "Installing jquery ${JQUERY_VERSION} and react ${REACT_VERSION}"
exec npm install --force jquery@~$JQUERY_VERSION react-dom@~$REACT_VERSION react@~$REACT_VERSION
