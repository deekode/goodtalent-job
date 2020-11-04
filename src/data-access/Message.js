/* eslint-disable require-jsdoc */

export default function messageDb(Message) {
	const fetchMessageById = jobId => Message.findById(jobId);

	const fetchMessage = (query, options = {}) =>
		Message.findOne(query, {}, options);

	const createMessage = jobDetails => Message.create(jobDetails);

	const updateMessage = (job, jobDetails, options = {}) =>
		Message.findByIdAndUpdate(
			job,
			{
				$set: jobDetails
			},
			options
		);

	const fetchMessages = (query, options = {}, join = '') =>
		Message.find(query, {}, options).populate(join);

	const countMessages = query => Message.countDocuments(query);

	const deleteMessage = query => Message.findOneAndDelete(query);

	return Object.freeze({
		fetchMessageById,
		fetchMessage,
		createMessage,
		updateMessage,
		fetchMessages,
		countMessages,
		deleteMessage
	});
}
