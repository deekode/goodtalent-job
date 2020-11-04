/* eslint-disable require-jsdoc */
/* eslint-disable require-jsdoc */
function createInterview({ validateInput }) {
	return async function(body) {
		const data = await validateInput(body);
		return Object.freeze({
			...data
		});
	};
}

export { createInterview };
