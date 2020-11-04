/* eslint-disable require-jsdoc */

export default function InterviewDb(Interview) {
	const fetchInterviewById = interviewId => Interview.findById(interviewId);

	const fetchInterview = (query, options = {}) =>
		Interview.findOne(query, options);

	const createInterview = interviewDetails =>
		Interview.create(interviewDetails);

	const updateInterview = (interviewId, interviewDetails, options = {}) =>
		Interview.findByIdAndUpdate(interviewId, interviewDetails, options);

	const updateOrCreate = (query, details, options = {}) =>
		Interview.findOneAndUpdate(
			query,
			{
				$set: details
			},
			options
		);
	const countInterviews = (query = {}) => Interview.countDocuments(query);

	const fetchInterviews = (query, options = {}) =>
		Interview.find(query, {}, options);

	const deleteInterview = query => Interview.delete(query);

	return {
		fetchInterviewById,
		fetchInterview,
		countInterviews,
		updateOrCreate,
		createInterview,
		updateInterview,
		fetchInterviews,
		deleteInterview
	};
}
