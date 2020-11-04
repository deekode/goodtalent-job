/* eslint-disable require-jsdoc */
function createMessage({ validateInput }) {
	return async function(body, payload) {
		const data = await validateInput(body);
		return Object.freeze({
			...data,
			payload
		});
	};
}

export { createMessage }