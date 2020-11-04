const createApplication = createapplication => {
	return async (req, res) => {
		const { exists } = await createapplication(req.body, {
			user: req.user,
			token: req.query.invite_token
		});
		if (exists) {
			return res.is.ok({
				message: 'You have applied for this Job already'
			});
		}
		return res.is.ok({
			message: 'Application Created Successfully'
		});
	};
};

const fetchApplicationsByTalent = fetchapplications => {
	return async (req, res) => {
		const data = await fetchapplications(
			{ userId: req.user._id },
			{
				user: req.user,
				pageNo: req.query.pageNo,
				size: req.query.size
			}
		);

		return res.is.ok({
			message: 'Application Fetched Successfully',
			data
		});
	};
};

const fetchApplications = fetchapplications => {
	return async (req, res) => {
		let query = { jobId: req.params.jobId, current: true };
	
		if (req.query.status) {
			query = {
				status: req.query.status
			};
		}
		if (req.query.stage) {
			query = { ...query, stage: req.query.stage };
		}

		const data = await fetchapplications(
			{ jobId: req.params.jobId, ...query },
			{
				user: req.user,
				pageNo: req.query.pageNo,
				size: req.query.size,
				query
			}
		);

		return res.is.ok({
			message: 'Application Fetched Successfully',
			data
		});
	};
};

const updateApplication = fetchapplication => {
	return async (req, res) => {
		await fetchapplication({
			...req.body
		});

		return res.is.ok({
			message: `${req.body.stage === 'offer' ? 'Offer' : 'Application'} ${
				req.body.status
			} Successfully`
		});
	};
};

const fetchApplication = fetchapplication => {
	return async (req, res) => {
		const data = await fetchapplication({ _id: req.params.applicationId });

		return res.is.ok({
			message: 'Application Fetched Successfully',
			data
		});
	};
};

const inviteApplicants = invite => {
	return async (req, res) => {
		await invite(req.body, { user: req.user });

		return res.is.ok({
			message: 'Applicants Invited Successfully'
		});
	};
};

const addToApplication = add => {
	return async (req, res) => {
		await add({ ...req.body, applicationId: req.params.applicationId });

		return res.is.ok({
			message: 'Application Updated Successfully'
		});
	};
};

const shortlistApplicants = add => {
	return async (req, res) => {
		await add({ ...req.body, applicationId: req.params.applicationId });

		return res.is.ok({
			message: 'Application Updated Successfully'
		});
	};
};

const inviteReviewer = add => {
	return async (req, res) => {
		const name = await add(req.body);

		return res.is.ok({
			message: `An Email has been sent to ${name}`
		});
	};
};

const reviewShortlist = add => {
	return async (req, res) => {
		const token = await add(req.body);
		if (token) {
			return res.is.ok({
				message: 'Shortlist reviewed successfully'
			});
		}
		return res.is.badRequest({
			message: 'You cannot review candidate. Token is expired.'
		});
	};
};

const fetchingShortlists = fetchapplication => {
	return async (req, res) => {
		const data = await fetchapplication({
			token: req.query.token
		});
		if (data) {
			return res.is.ok({
				message: 'Shortlist Fetched Successfully',
				data
			});
		}
		return res.is.badRequest({
			message: 'You cannot view shortlist. Token is expired.'
		});
	};
};

const fetchingShortlistCandidate = fetchapplication => {
	return async (req, res) => {
		const data = await fetchapplication({
			token: req.query.token,
			applicationId: req.params.applicationId
		});
		if (data) {
			return res.is.ok({
				message: 'Shortlist Fetched Successfully',
				data
			});
		}
		return res.is.badRequest({
			message: 'You cannot view shortlist. Token is expired.'
		});
	};
};

export {
	createApplication,
	fetchApplicationsByTalent,
	fetchApplications,
	fetchingShortlists,
	fetchingShortlistCandidate,
	fetchApplication,
	inviteApplicants,
	updateApplication,
	addToApplication,
	shortlistApplicants,
	inviteReviewer,
	reviewShortlist
};
