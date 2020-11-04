/* eslint-disable require-jsdoc */

function createApplication({ validateInput }) {
	return async function(body, payload) {
		const data = await validateInput(body);
		return Object.freeze({
			...data,
			payload
		});
	};
}

function inviteApplication({ validateInput }) {
	return async function(body) {
		const data = await validateInput(body);
		return Object.freeze({
			...data
		});
	};
}

function validateaddToApplication({ validateInput }) {
	return async function(body) {
		const data = await validateInput(body);
		return Object.freeze({
			...data
		});
	};
}

function validateApplicationStatus({ validateInput }) {
	return async function(body) {
		const data = await validateInput(body);
		return Object.freeze({
			...data
		});
	};
}

function shortlist({ validateInput }) {
	return async function(body) {
		const data = await validateInput(body);
		return Object.freeze({
			...data
		});
	};
}

function inviteReviewer({ validateInput }) {
	return async function(body) {
		const data = await validateInput(body);
		return Object.freeze({
			...data
		});
	};
}

function reviewShortlist({ validateInput }) {
	return async function(body) {
		const data = await validateInput(body);
		return Object.freeze({
			...data
		});
	};
}

export {
	createApplication,
	inviteApplication,
	validateaddToApplication,
	validateApplicationStatus,
	shortlist,
	inviteReviewer,
	reviewShortlist
};
