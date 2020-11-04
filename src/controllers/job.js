const createJob = createjob => {
	return async (req, res) => {
		const data = await createjob(req.body, { ...req.user, ...req.query });
		if (data.error === true) {
			return res.is.badRequest({
				error: data.message
			});
		}
		return res.is.ok({
			message: 'Job Created Successfully',
			data
		});
	};
};

const changeJobStatus = createjob => {
	return async (req, res) => {
		const data = await createjob(req.params.jobId, req.body.status);
		return res.is.ok({
			message: 'Job Updated Successfully',
			data
		});
	};
};

const fetchJobsByTalent = fetchjobs => {
	return async (req, res) => {
		let search = {};
		if (req.query.search) {
			search = { text: req.query.search };
		}
		const data = await fetchjobs(
			{ status: 'open', visibility: true, ...search },
			{
				role: req.user.role || 'talent',
				pageNo: req.query.pageNo,
				size: req.query.size,
				_id: req.user._id
			}
		);
		return res.is.ok({
			message: 'Jobs Fetched Successfully',
			data
		});
	};
};

const fetchJobsByCompany = fetchjobs => {
	return async (req, res) => {
		let search = {};
		let status = {};
		if (req.query.search) {
			search = { text: req.query.search };
		}
		if (req.query.status) {
			status = { status: req.query.status };
		}
		const data = await fetchjobs(
			{
				userId: req.user ? req.user._id : req.params.company,
				...search,
				...status
			},
			{
				role: 'company',
				pageNo: req.query.pageNo,
				size: req.query.size
			}
		);
		return res.is.ok({
			message: 'Jobs Fetched Successfully',
			data
		});
	};
};

const fetchJobsByAgency = fetchjobs => {
	return async (req, res) => {
		let query = { userId: req.user ? req.user._id : req.params.company };
		if (req.query.companyId) {
			query = { companyId: req.query.companyId };
		}
		let search = {};
		let status = {};
		if (req.query.search) {
			search = { text: req.query.search };
		}
		if (req.query.status) {
			status = { status: req.query.status };
		}
		const data = await fetchjobs(
			{ ...query, ...search, ...status },
			{
				role: 'agency',
				pageNo: req.query.pageNo,
				size: req.query.size
			}
		);
		return res.is.ok({
			message: 'Jobs Fetched Successfully',
			data
		});
	};
};

const fetchJobsByAdmin = fetchjobs => {
	return async (req, res) => {
		let search = {};
		let status = {};
		if (req.query.search) {
			search = { text: req.query.search };
		}
		if (req.query.status) {
			status = { status: req.query.status };
		}
		const data = await fetchjobs(
			{ ...search, ...status },
			{
				role: req.user.role,
				pageNo: req.query.pageNo,
				size: req.query.size
			}
		);
		return res.is.ok({
			message: 'Jobs Fetched Successfully',
			data
		});
	};
};

const fetchJob = fetchjob => {
	return async (req, res) => {
		const data = await fetchjob(
			{ _id: req.params.jobId },
			{ user: req.user }
		);
		return res.is.ok({
			message: 'Job Fetched Successfully',
			data
		});
	};
};

const updateJob = updatejob => {
	return async (req, res) => {
		const data = await updatejob(req.body, {
			...req.user,
			...req.query,
			jobId: req.params.id
		});
		return res.is.ok({
			message: 'Job Updated Successfully',
			data
		});
	};
};

const fetchIframeJob = fetchjob => {
	return async (req, res) => {
		const data = await fetchjob({ _id: req.params.jobId });
		return res.is.ok({
			message: 'Job Fetched Successfully',
			data
		});
	};
};

const fetchingJobIds = fetchjob => {
	return async (req, res) => {
		const data = await fetchjob();
		return res.is.ok({
			message: 'Jobids Fetched Successfully',
			data
		});
	};
};

const fetchIframeJobs = fetchjobs => {
	return async (req, res) => {
		const data = await fetchjobs(
			{ status: 'open', userId: req.params.companyId },
			{ pageNo: req.query.pageNo, size: req.query.size }
		);
		return res.is.ok({
			message: 'Jobs Fetched Successfully',
			data
		});
	};
};

const createJobQuestions = create => {
	return async (req, res) => {
		await create(req.body, { user: req.user });
		return res.is.ok({
			message: 'Questions Created Successfully'
		});
	};
};

const updateJobQuestion = create => {
	return async (req, res) => {
		await create(req.body, { questionId: req.params.questionId });
		return res.is.ok({
			message: 'Question Updated Successfully'
		});
	};
};

const deleteJobQuestion = create => {
	return async (req, res) => {
		await create({ questionId: req.params.questionId });
		return res.is.ok({
			message: 'Question Deleted Successfully'
		});
	};
};

const fetchJobQuestions = create => {
	return async (req, res) => {
		const questions = await create({ jobId: req.query.jobId });
		return res.is.ok({
			message: 'Question Fetched Successfully',
			questions
		});
	};
};

export {
	createJob,
	changeJobStatus,
	updateJob,
	fetchIframeJob,
	fetchIframeJobs,
	fetchJobsByTalent,
	fetchingJobIds,
	fetchJobsByCompany,
	fetchJobsByAgency,
	fetchJobsByAdmin,
	fetchJob,
	createJobQuestions,
	updateJobQuestion,
	deleteJobQuestion,
	fetchJobQuestions
};
