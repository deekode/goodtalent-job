/* eslint-disable require-jsdoc */

function creatingJob({ jobDb, pick, validateJob, jobStatus, createInterview }) {
	return async function(info, payload) {
		const job = await validateJob(info, payload);
		const obj = await jobDb.createJob({
			...job,
			interviews: [],
			userId: payload._id,
			companyId: payload.companyId,
			status: jobStatus.open
		});
		if (job.interviews.length > 0) {
			const interviews = job.interviews.map(interview => {
				return {
					...interview,
					userId: payload._id,
					companyId: payload.companyId,
					jobId: obj._id
				};
			});
			await createInterview(interviews);
		}
		const data = pick(obj, [...Object.keys(info), '_id']);
		return data;
	};
}

function updatingJob({ jobDb, pick, validateJob, createInterview }) {
	return async function(info, payload) {
		const job = await validateJob(info, payload);

		const obj = await jobDb.updateJob(payload.jobId, job, { new: true });

		if (job.interviews.length > 0) {
			const interviews = job.interviews.map(interview => {
				return {
					...interview,
					userId: payload._id,
					companyId: payload.companyId,
					jobId: obj._id
				};
			});
			await createInterview(interviews);
		}

		const data = pick(obj, [...Object.keys(info), '_id']);
		return data;
	};
}

function jobForTests({ jobDb, applicationDb }) {
	return async function name(payload) {
		if (!payload.jobId || !payload.applicationIds) {
			return {
				error: true,
				message: 'Job id and application ids are required respectiveiy!'
			};
		}
		const job = await jobDb.fetchJob({ _id: payload.jobId });

		if (!job || job.testId) {
			return {
				error: true,
				message:
					'Please update this job there is no tests attached to it!'
			};
		}

		if (payload.applicationIds.length === 0) {
			return {
				error: true,
				message: 'You have not sent in any application id'
			};
		}
		let applicants = await applicationDb.fetchApplications({
			_id: {
				$in: payload.applicationIds
			}
		});
		applicants = await Promise.all(
			applicants.map(async doc => {
				doc.userId = await jobDb.findUser({
					collection: 'users',
					id: doc.userId
				});
			})
		);
		return {
			data: {
				jobId: job._id,
				testId: job.test.testId,
				duration: job.test.duration,
				applicants
			}
		};
	};
}

function fetchingJobs({
	jobDb,
	moment,
	paginate,
	applicationDb,
	bookingDb,
	_testDb
}) {
	return async function(query, payload) {
		const docs = await paginate(
			jobDb.fetchJobs,
			jobDb.countJobs,
			{ ...query },
			{ pageNo: payload.pageNo, size: payload.size }
		);
		const { pageCount, totalCount } = docs.data;
		const jobs = docs.data.docs;
		let data;
		if (payload.role === 'talent') {
			data = jobs.map(async obj => {
				obj.userId = await jobDb.findUser({
					collection: 'users',
					id: obj.userId,
					select: { _id: 1, name: 1, bio: 1, image: 1 }
				});
				return {
					createdAt: moment(obj.createdAt).fromNow(),
					title: obj.title,
					_id: obj._id,
					company: obj.userId.name,
					companyBio: obj.userId.bio,
					companyId: obj.userId._id,
					companyImage: obj.userId.image,
					status: obj.status,
					applied: Boolean(
						await applicationDb.countApplications({
							jobId: obj._id,
							userId: payload._id
						})
					),
					experience: obj.experience,
					skills: obj.skills,
					availability: obj.availability,
					test: obj.test,
					pay: obj.pay,
					location: obj.location
				};
			});
			data = await Promise.all(data);
		}
		if (payload.role === 'company' || payload.role === 'agency') {
			data = jobs.map(async obj => {
				return {
					title: obj.title,
					applicants: await applicationDb.countApplications({
						jobId: obj._id
					}),
					testsTaken: 0,
					hired: 0,
					department: await jobDb.findDepartment({
						collection: 'departments',
						id: obj.departmentId,
						select: { _id: 1, name: 1 }
					}),
					interviewTaken: await bookingDb.countBookings({
						jobId: obj._id
					}),
					createdAt: moment(obj.createdAt).format('Do MMMM YYYY'),
					status: obj.status,
					_id: obj._id
				};
			});

			data = await Promise.all(data);
		}

		if (payload.role === 'superadmin') {
			data = jobs.map(async obj => {
				obj.userId = await jobDb.findUser({
					collection: 'users',
					id: obj.userId,
					select: { _id: 1, name: 1 }
				});
				return {
					title: obj.title,
					applicants: await applicationDb.countApplications({
						jobId: obj._id
					}),
					recruiter: obj.userId.name,
					testsTaken: 0,
					createdAt: moment(obj.createdAt).format('Do MMMM YYYY'),
					status: obj.status,
					_id: obj._id
				};
			});

			data = await Promise.all(data);
		}

		return { docs: data, pageCount, totalCount };
	};
}

function fetchingJob({
	jobDb,
	moment,
	applicationDb,
	fetchInterviews,
	questionDb
}) {
	return async function name(query, payload) {
		const obj = await jobDb.fetchJob(query).lean();
		obj.userId = await jobDb.findUser({
			collection: 'users',
			id: obj.userId,
			select: { _id: 1, name: 1, bio: 1, image: 1 }
		});
		let data;
		if (payload.user.role === 'talent') {
			//fetch questions
			data = {
				createdAt: moment(obj.createdAt).format('Do MMMM YYYY'),
				title: obj.title,
				_id: obj._id,

				questions: await questionDb.fetchQuestion(
					{
						jobId: obj._id
					},
					{ select: { createdAt: 0, updatedAt: 0, jobId: 0, __v: 0 } }
				),
				company: obj.userId.name,
				companyId: obj.userId._id,
				companyBio: obj.userId.bio,
				companyImage: obj.userId.image,
				agencyCompany: obj.companyId,
				department: await jobDb.findDepartment({
					collection: 'departments',
					id: obj.departmentId,
					select: { _id: 1, name: 1 }
				}),
				status: obj.status,
				applied: Boolean(
					await applicationDb.countApplications({
						jobId: obj._id,
						userId: payload.user._id
					})
				),
				experience: obj.experience,
				availability: obj.availability,
				description: obj.description,
				pay: obj.pay,
				location: obj.location
			};
		}
		if (
			payload.user.role === 'company' ||
			payload.user.role === 'superadmin'
		) {
			data = {
				createdAt: moment(obj.createdAt).format('Do MMMM YYYY'),
				title: obj.title,
				_id: obj._id,
				applicants: await applicationDb.countApplications({
					jobId: obj._id
				}),
				skills: obj.skills,
				pay: obj.pay,
				agencyCompany: obj.companyId,
				test: obj.test,
				experience: obj.experience,
				availability: obj.availability,
				visibility: obj.visibility,
				location: obj.location,
				noOfTestsTaken: 0,
				noOfInterviews: 0,
				interviews: await fetchInterviews({ jobId: obj._id }),
				interviewTypes: obj.interviewTypes,
				department: await jobDb.findDepartment({
					collection: 'departments',
					id: obj.departmentId,
					select: { _id: 1, name: 1 }
				}),
				company: obj.userId.name,
				companyId: obj.userId._id,
				companyBio: obj.userId.bio,
				companyImage: obj.userId.image,
				status: obj.status,
				description: obj.description
			};
		}

		return data;
	};
}

function changeJobStatus({ jobDb }) {
	return async function(info, payload) {
		const data = await jobDb.updateJob(
			info,
			{ status: payload },
			{ new: true }
		);
		return data;
	};
}

function fetchingIframeJob({ jobDb, moment }) {
	return async function name(query) {
		const obj = await jobDb.fetchJob(query);

		obj.userId = await jobDb.findUser({
			collection: 'users',
			id: obj.userId,
			select: { _id: 1, name: 1 }
		});

		return {
			createdAt: moment(obj.createdAt).format('Do MMMM YYYY'),
			title: obj.title,
			_id: obj._id,
			company: obj.userId.name,
			companyId: obj.userId._id,
			status: obj.status,
			experience: obj.experience,
			skills: obj.skills,
			availability: obj.availability,
			description: obj.description,
			pay: obj.pay,
			location: obj.location,
			companyBio: obj.userId.bio
		};
	};
}

function fetchingIframeJobs({ jobDb, moment, paginate }) {
	return async function name(query, payload) {
		const docs = await paginate(
			jobDb.fetchJobs,
			jobDb.countJobs,
			{ ...query },
			{ pageNo: payload.pageNo, size: payload.size }
		);
		const { pageCount, totalCount } = docs.data;
		const jobs = docs.data.docs;
		let data;

		data = jobs.map(async obj => {
			obj.userId = await jobDb.findUser({
				collection: 'users',
				id: obj.userId,
				select: { _id: 1, name: 1 }
			});
			return {
				createdAt: moment(obj.createdAt).fromNow(),
				title: obj.title,
				_id: obj._id,
				company: obj.userId.name,
				companyBio: obj.userId.bio,
				companyId: obj.userId._id,
				status: obj.status,
				experience: obj.experience,
				availability: obj.availability,
				skills: obj.skills,
				test: obj.test,
				pay: obj.pay,
				location: obj.location
			};
		});
		data = await Promise.all(data);

		return { docs: data, pageCount, totalCount };
	};
}

function fetchingJobIds({ jobDb }) {
	return async function() {
		const jobs = await jobDb.fetchJobs({}, { projection: { _id: 1 } });
		return jobs;
	};
}

//create knockoutQuestions

function createQuestions({ validateInput, questionDb }) {
	return async function(body, payload) {
		//validate question input
		const data = await validateInput(body);

		//input question to database

		const questions = await questionDb.createQuestions(
			{ jobId: data.jobId },
			{
				...data,
				userId: payload.user._id
			},
			{ upsert: true }
		);
		return questions;
		//send success message
	};
}

function updateQuestions({ validateInput, questionDb }) {
	return async function(body, payload) {
		//validate question input
		const data = await validateInput({
			...body,
			questionId: payload.questionId
		});

		//input question to database

		const questions = await questionDb.updateQuestion(
			payload.questionId,
			data
		);
		return questions;
		//send success message
	};
}

function deleteQuestion({ questionDb }) {
	return async function(payload) {
		const questions = await questionDb.deleteQuestion({
			_id: payload.questionId
		});
		return questions;
		//send success message
	};
}

function fetchQuestions({ questionDb }) {
	return async function(payload) {
		const questions = await questionDb.fetchQuestions(
			{
				jobId: payload.jobId
			},
			{ select: { createdAt: 0, updatedAt: 0, jobId: 0, __v: 0 } }
		);
		return questions;
		//send success message
	};
}

export {
	creatingJob,
	fetchingJobIds,
	updatingJob,
	fetchingJobs,
	fetchingJob,
	jobForTests,
	deleteQuestion,
	createQuestions,
	changeJobStatus,
	fetchingIframeJob,
	fetchingIframeJobs,
	updateQuestions,
	fetchQuestions
};
