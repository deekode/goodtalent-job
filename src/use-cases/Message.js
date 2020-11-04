/* eslint-disable require-jsdoc */

function createMessage({ messageDb, validateInput }) {
	return async function(data, payload) {
		await validateInput(data);
		await messageDb.createMessage({ ...data, userId: payload._id });
		return true;
	};
}

function updateMessgae({ messageDb, validateInput }) {
	return async function(data, payload) {
		await validateInput(data);
		await messageDb.updateMessage({ _id: payload._id }, { ...data });
		return true;
	};
}

function fetchMessages({ messageDb }) {
	return async function(data) {
		const messages = await messageDb.fetchMessages(
			{ userId: data._id },
			{ select: { updatedAt: 0, createdAt: 0, __v: 0, userId: 0 } }
		);
		return messages;
	};
}

function fetchMessage({ messageDb }) {
	return async function(data) {
		const message = await messageDb.fetchMessage(
			{ _id: data.messageId },
			{ select: { updatedAt: 0, createdAt: 0, __v: 0, userId: 0 } }
		);
		return message;
	};
}

function deleteMessage({ messageDb }) {
	return async function(data) {
		await messageDb.deleteMessage({ _id: data.messageId });
		return true;
	};
}

function sendMessgaes({ messageDb, formatEmail, notifyClient }) {
	return async function(data) {
		const message = await messageDb.fetchMessage({ _id: data.messageId });

		const promise = data.emails.map(async email => {
			const html = formatEmail('custom', {
				footer: message.footer,
				description: message.description
			});

			notifyClient
				.notifyByEmail({
					htmlMessage: html,
					subject: message.subject,
					recepients: [{ Email: email }]
				})
				.catch(err => {
					console.log(err);
				});
		});

		await Promise.all(promise);

		return true;
	};
}

export {
	createMessage,
	deleteMessage,
	fetchMessages,
	fetchMessage,
	updateMessgae,
	sendMessgaes
};
