const createMessage = createMessage => {
	return async (req, res) => {
		const data = await createMessage(req.body, req.user);
		if (data) {
			return res.is.ok({
				message: 'Message Added Successfully'
			});
		}
	};
};

const updateMessage = updateMessage => {
	return async (req, res) => {
		const data = await updateMessage(req.body, {
			_id: req.params.messageId
		});
		if (data) {
			return res.is.ok({
				message: 'Message Updated Successfully'
			});
		}
	};
};

const fetchMessgaes = fetchMessgaes => {
	return async (req, res) => {
		const data = await fetchMessgaes(req.user);

		return res.is.ok({
			message: 'Messages Fetched Successfully',
			data
		});
	};
};

const fetchMessage = fetchMessgae => {
	return async (req, res) => {
		const data = await fetchMessgae(req.params);

		return res.is.ok({
			message: 'Messages Fetched Successfully',
			data
		});
	};
};

const deleteMessage = deleteMessage => {
	return async (req, res) => {
		await deleteMessage(req.params);

		return res.is.ok({
			message: 'Messages Deleted Successfully'
		});
	};
};

const sendMessage = sendMessage => {
	return async (req, res) => {
		await sendMessage(req.body);

		return res.is.ok({
			message: 'Messages sent Successfully'
		});
	};
};

export {
	createMessage,
	updateMessage,
	fetchMessgaes,
	fetchMessage,
	deleteMessage,
	sendMessage
};
