function createTokenClass() {
	return function (value) {
		if (value) {
			this.v = value;
		}
	};
}

export {createTokenClass};
