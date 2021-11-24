const assign = Object.assign || ((target, properties) => {
	for (const key in properties) {
		target[key] = properties[key];
	}
});

export default assign;
