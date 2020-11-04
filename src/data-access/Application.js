/* eslint-disable require-jsdoc */

export default function applicationDb(Application) {
	const fetchApplicationById = applicationId =>
		Application.findById(applicationId);

	const fetchApplication = (query, options = {}) =>
		Application.findOne(query, {}, options);

	const createApplication = applicationDetails =>
		Application.create(applicationDetails);

	const updateApplication = (application, applicationDetails, options = {}) =>
		Application.findByIdAndUpdate(
			application,
			{
				$set: applicationDetails
			},
			options
		);

	const update = (query, applicationDetails) =>
		Application.update(query, applicationDetails);

	const createOrUpdateApplication = (
		query,
		applicationDetails,
		options = {}
	) => Application.findOneAndUpdate(query, applicationDetails, options);

	const fetchApplications = (query, options = {}, join = '') =>
		Application.find(query, {}, options).populate(join);

	const countApplications = query => Application.countDocuments(query);

	const deleteApplication = query => Application.findOneAndDelete(query);

	return {
		fetchApplicationById,
		update,
		fetchApplication,
		createApplication,
		countApplications,
		updateApplication,
		fetchApplications,
		deleteApplication,
		createOrUpdateApplication
	};
}
