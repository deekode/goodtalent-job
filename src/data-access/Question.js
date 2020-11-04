/* eslint-disable require-jsdoc */

export default function questionDb(Question) {
	const createQuestions = (query, applicationDetails, options = {}) =>
		Question.findOneAndUpdate(query, applicationDetails, options);

	const updateQuestion = (application, applicationDetails, options = {}) =>
		Question.findByIdAndUpdate(
			application,
			{
				$set: applicationDetails
			},
			options
		);

	const fetchQuestion = (query, options = {}) =>
		Question.findOne(query, options);

	const fetchQuestions = (query, options = {}, join = '') =>
		Question.find(query, {}, options).populate(join);

	const countApplications = query => Question.countDocuments(query);

	const deleteQuestion = query => Question.findOneAndDelete(query);

	return Object.freeze({
		createQuestions,
		countApplications,
		updateQuestion,
		fetchQuestions,
		deleteQuestion,
		fetchQuestion
	});
}
