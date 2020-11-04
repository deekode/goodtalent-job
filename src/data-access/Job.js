/* eslint-disable require-jsdoc */
import _ from 'lodash';

export default function jobDb(Job) {
	const fetchJobById = jobId => Job.findById(jobId);

	const fetchJob = (query, options = {}) => Job.findOne(query, options);

	const createJob = jobDetails => Job.create(jobDetails);

	const updateJob = (job, jobDetails, options = {}) =>
		Job.findByIdAndUpdate(
			job,
			{
				$set: jobDetails
			},
			options
		);

	const fetchJobs = (query, options = {}, populate = '') => {
		if (query.text) {
			return Job.search(query.text, _.omit(query, ['text']), {
				...options,
				populate
			});
		} else {
			return Job.find(query, {}, { ...options, populate });
		}
	};

	const countJobs = query => Job.countDocuments(query);

	const deleteJob = query => Job.findOneAndDelete(query);

	return {
		fetchJobById,
		fetchJob,
		createJob,
		updateJob,
		fetchJobs,
		deleteJob,
		countJobs
	};
}
