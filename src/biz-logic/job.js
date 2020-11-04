/* eslint-disable require-jsdoc */
function createJob({ validateInput }) {
	return async function(body, payload) {
		const data = await validateInput(body);
		return Object.freeze({
			...data,
			payload
		});
	};
}

function createQuestion({ validateInput }) {
	return async function(body) {
		const data = await validateInput(body, 'create');
		return Object.freeze({
			...data
		});
	};
}

function updateQuestion({ validateInput }) {
	return async function(body) {
		const data = await validateInput(body, 'update');
		return Object.freeze({
			...data
		});
	};
}

export { createJob, createQuestion, updateQuestion };
