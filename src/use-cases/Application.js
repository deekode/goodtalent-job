/* eslint-disable require-jsdoc */

<<<<<<< HEAD
=======
import { object } from 'joi';

>>>>>>> 53af30c5c6be68f7c7df34510e1f74a846b9c0ba
function creatingApplication({
	applicationDb,
	userDb,
	validateApplication,
	applicationTerms,
	jobDb,
	formatEmail,
	notifyClient,
	stageDb
}) {
	return async function(info, payload) {
		const input = await validateApplication(info, payload);
		const job = await jobDb.fetchJob({ _id: info.jobId }).lean();

		job.userId = await jobDb.findUser({
			collection: 'users',
			id: job.userId,
			select: { name: 1, _id: 1, email: 1 }
		});

		const existingApplication = await applicationDb.fetchApplication({
			userId: payload.user._id,
			jobId: info.jobId
		});
		if (existingApplication) {
			return { exists: true };
		}
		//create a stage

		const stage = await stageDb.createStage({
			stage: applicationTerms.stage.initial,
			status: applicationTerms.status.pending,
			knockoutScore: input.questionScore,
			current: true,
			jobId: job._id
		});

		const application = {
			...input,
			userId: payload.user._id,
			stageId: stage._id,
			companyId: job.userId,
			subCompanyId: job.companyId
		};
		//check for token
		let app;
		if (input.token) {
			app = await applicationDb.createOrUpdateApplication(
				{
					token: input.token
				},
				application,
				{ new: true }
			);
		} else {
			app = await applicationDb.createApplication(application);
		}

		await stageDb.createOrUpdateStage(
			{ _id: app.stageId },
			{ applicationId: app._id }
		);

		if (input.status === true) {
			await userDb.updateUser(payload.user._id, { resume: input.resume });
		}
		//delete token if it exists
		const html = formatEmail('application', {
			link: `${process.env.FRONTEND_SERVER}/login`,
			name: job.userId.name
		});

		notifyClient
			.notifyByEmail({
				htmlMessage: html,
				subject: 'New Application',
				recepients: [{ Email: job.userId.email }]
			})
			.catch(err => {
				console.log(err);
			});
		return true;
	};
}

function updatingApplication({ applicationDb, stageDb, validateInput }) {
	return async function(payload) {
		await validateInput(payload);
		const data = payload.applicationIds.map(async doc => {
			const formerStage = await stageDb.createOrUpdateStage(
				{ applicationId: doc, current: true },
				{ current: false }
			);
			let obj = {
				stage: payload.stage,
				type: payload.type || payload.stage,
				applicationId: doc
			};
			if (payload.offer) {
				obj = { ...obj, offer: payload.offer };
				//send mail to candidate
			}
			if (payload.offerId) {
				obj = { _id: payload.offerId };
			}
			const stage = await stageDb.createOrUpdateStage(
				obj,
				{
					...payload,
					current: true,
					jobId: formerStage ? formerStage.jobId : payload.jobId
				},
				{ upsert: true, new: true }
			);

			await applicationDb.updateApplication(
				{ _id: doc },
				{ stageId: stage._id }
			);

			return stage;
			//send mail or not
		});

		const stage = await Promise.all(data);

		return stage;
	};
}

function withdrawApplication({ applicationDb }) {
	return async function(info, payload) {
		const data = await applicationDb.updateApplication(
			payload,
			{ withdrawn: true },
			{ new: true }
		);
		return data;
	};
}

function fetchingApplications({ applicationDb, moment, stageDb, paginate }) {
	return async function(query, payload) {
		const stages = await stageDb.fetchStages(query);
		const stageIds = stages.map(doc => doc.applicationId);
		const docs = await paginate(
			applicationDb.fetchApplications,
			applicationDb.countApplications,
			{ _id: { $in: stageIds } },
			{ pageNo: payload.pageNo, size: payload.size },
			[
				{
					path: 'jobId',
					select: ['title', '_id', 'userId']
				}
			]
		);

		const { pageCount, totalCount } = docs.data;
		const applications = docs.data.docs;

		const promise = applications.map(async obj => {
			obj.userId = await applicationDb.findUser({
				collection: 'users',
				id: obj.userId,
				select: {
					name: 1,
					_id: 1,
					image: 1,
					email: 1,
					phoneNumber: 1
				}
			});
			const latestStage = stages.filter(
				doc =>
					doc.current === true &&
					doc.applicationId.toString() === obj._id.toString()
			);
			return {
				talent: obj.userId.name,
				talentImage: obj.userId.image,
				createdAt: moment(obj.createdAt).format('Do MMMM YYYY'),
				email: obj.userId.email,
				phoneNumber: obj.userId.phoneNumber,
				status: latestStage.length > 0 ? latestStage[0].status : null,
				stage: latestStage.length > 0 ? latestStage[0].stage : null,
				_id: obj._id
			};
		});

		const data = await Promise.all(promise);

		return { docs: data, pageCount, totalCount };
	};
}

function fetchingTalentApplications({
	applicationDb,
	moment,
	stageDb,
	paginate
}) {
	return async function(query, payload) {
		const docs = await paginate(
			applicationDb.fetchApplications,
			applicationDb.countApplications,
			query,
			{ pageNo: payload.pageNo, size: payload.size },
			[
				{
					path: 'jobId',
					select: ['title', '_id', 'userId']
				}
			]
		);

		const { pageCount, totalCount } = docs.data;
		const applications = docs.data.docs;

		const promise = applications.map(async obj => {
			obj.jobId.userId = await applicationDb.findUser({
				collection: 'users',
				id: obj.jobId.userId,
				select: {
					name: 1,
					_id: 1
				}
			});

			const latestStage = await stageDb.fetchStage({
				applicationId: obj._id,
				current: true
			});

			return {
				createdAt: moment(obj.createdAt).format('Do MMMM YYYY'),
				title: obj.jobId.title,
				jobId: obj.jobId._id,
				company: obj.jobId.userId.name,
				companyImage: obj.jobId.userId.image,
				pay: obj.jobId.pay,
				companyId: obj.jobId.userId._id,
				status: latestStage.status,
				stage: latestStage.stage,
				_id: obj._id
			};
		});
		const data = await Promise.all(promise);

		return { docs: data, pageCount, totalCount };
	};
}

function fetchingApplication({
	applicationDb,
	stageDb,
	bookingDb,
	interviewDb
}) {
	return async function(info) {
		const obj = await applicationDb
			.fetchApplication(info)
			.lean()
			.populate({
				path: 'jobId',
				select: ['title', '_id', 'userId', 'pay']
			});
		obj.userId = await applicationDb.findUser({
			collection: 'users',
			id: obj.userId
		});
		obj.companyId = await applicationDb.findUser({
			collection: 'users',
			id: obj.jobId.userId
		});

		const latestStage = await stageDb.fetchStage(
			{ applicationId: obj._id, current: true },
			{ select: { __v: 0, deleted: 0, jobId: 0 } }
		);

		let promise = await stageDb
			.fetchStages(
				{ applicationId: obj._id },
				{
					select: {
						__v: 0,
						deleted: 0,
						jobId: 0,
						createdAt: 0,
						updatedAt: 0
					}
				}
			)
			.lean();

		promise = promise.map(async doc => {
			if (doc.bookingId) {
				const booking = await bookingDb
					.fetchBooking({ _id: doc.bookingId })
					.lean();
				return {
					...doc,
					interviewDate: booking.date
				};
			} else if (doc.interviewId) {
				const interview = await interviewDb
					.fetchInterview({ _id: doc.interviewId })
					.lean();
				return {
					...doc,
					dates: interview.dates
				};
			}
			return doc;
		});

		const stages = await Promise.all(promise);

		const data = {
			talentRole: obj.userId.talentRole,
			talent: obj.userId.name,
			bio: obj.userId.bio,
			talentImage: obj.userId.image,
			email: obj.userId.email,
			phoneNumber: obj.userId.phoneNumber,
			companyName: obj.companyId.name,
			companyImage: obj.companyId.image,
			_id: obj._id,
<<<<<<< HEAD
			notes: obj.notes,
			files: obj.files,
=======
>>>>>>> 53af30c5c6be68f7c7df34510e1f74a846b9c0ba
			resume: obj.resume,
			pay: obj.jobId.pay,
			title: obj.jobId.title,
			porfolioLinks: obj.userId.links,
			status: latestStage.status,
<<<<<<< HEAD
			stage: latestStage.stage,
=======
            stage: latestStage.stage,
            notes: object.notes,
            files: object.files,
>>>>>>> 53af30c5c6be68f7c7df34510e1f74a846b9c0ba
			stages
		};

		return data;
	};
}

function inviteApplicant({
	applicationDb,
	generateToken,
	validateApplicants,
	formatEmail,
	notifyClient
}) {
	return async function(info, payload) {
		const input = await validateApplicants(info);
		let candidates = new Set(input.candidates);
		candidates = [...candidates];

		const promise = candidates.map(async candidate => {
			const doc = await applicationDb.createOrUpdateApplication(
				{
					jobId: input.jobId,
					...candidate
				},
				{
					jobId: input.jobId,
					companyId: payload.user._id,
					...candidate,
					token: await generateToken()
				},
				{ upsert: true, new: true }
			);

			const html = formatEmail('invite', {
				link: `${process.env.FRONTEND_SERVER}/job/${doc._id}?token=${doc.token}`,
				name: doc.name,
				company: payload.user.name
			});

			notifyClient
				.notifyByEmail({
					htmlMessage: html,
					subject: 'Job Invitation',
					recepients: [{ Email: doc.email }]
				})
				.catch(err => {
					console.log(err);
				});
		});

		await Promise.all(promise);
		return info;
	};
}

function addToApplication({ applicationDb, validateInput }) {
	return async function(payload) {
<<<<<<< HEAD
		let input = await validateInput(payload);
		if (input.notes.length > 0) {
			const application = await applicationDb
				.fetchApplicationById(input.applicationId)
				.lean();

			input = {
				notes: [...application.notes, ...input.notes],
				files: [...application.files, ...input.files]
			};
		}

		await applicationDb.updateApplication(payload.applicationId, input, {
			new: true
		});

=======
		const input = await validateInput(payload);
		await applicationDb.updateApplication(input.applicationId, input, {
			new: true
		});
>>>>>>> 53af30c5c6be68f7c7df34510e1f74a846b9c0ba
		return true;
	};
}
// toggle shortlist candidate
function shortlistApplicant({ applicationDb, validateInput }) {
	return async function(input) {
		//check input
		await validateInput(input);

		await applicationDb.updateApplication(input.applicationId, input, {
			new: true
		});

		return true;
	};
}

// invite reviewer
function inviteReviewer({
	applicationDb,
	generateToken,
	formatEmail,
	notifyClient,
	validateInput
}) {
	return async function(input) {
		//check input
		await validateInput(input);
		const token = await generateToken(16);

		await applicationDb.createToken({
			...input,
			token,
			createdAt: new Date()
		});

		const html = formatEmail('review', {
			link: `${process.env.FRONTEND_SERVER}/jobs?token=${token}`,
			name: input.name
		});

		notifyClient
			.notifyByEmail({
				htmlMessage: html,
				subject: 'Review Candidates',
				recepients: [{ Email: input.email }]
			})
			.catch(err => {
				console.log(err);
			});

		return input.name;
	};
}
// review

function reviewShortlist({
	applicationDb,
	validateInput,
	updateApplicationStage
}) {
	return async function(input) {
		await validateInput(input);
		const token = await applicationDb.findToken(input.token);

		if (token) {
			//update status
			await updateApplicationStage({
				applicationIds: [input.applicationId],
				stage: 'shortlist',
				status: input.status,
				jobId: token.jobId
			});

			return true;
		}
		return false;
	};
}

//fetch shortlists

function fetchingShortlists({ applicationDb, moment, paginate, stageDb }) {
	return async function(payload) {
		const token = await applicationDb.findToken(payload.token);

		if (!token) {
			return false;
		}

		const stages = await stageDb.fetchStages({
			jobId: token.jobId,
			stage: 'shortlist'
		});

		const stageIds = stages.map(doc => doc.applicationId);
		const docs = await paginate(
			applicationDb.fetchApplications,
			applicationDb.countApplications,
			{ _id: { $in: stageIds } },
			{ pageNo: payload.pageNo, size: payload.size },
			[
				{
					path: 'jobId',
					select: ['title', '_id', 'userId']
				}
			]
		);

		const { pageCount, totalCount } = docs.data;
		const applications = docs.data.docs;

		const promise = applications.map(async obj => {
			obj.userId = await applicationDb.findUser({
				collection: 'users',
				id: obj.userId,
				select: {
					name: 1,
					_id: 1,
					image: 1,
					email: 1,
					phoneNumber: 1
				}
			});
			const latestStage = stages.filter(
				doc => doc.applicationId.toString() === obj._id.toString()
			);
			return {
				talent: obj.userId.name,
				talentImage: obj.userId.image,
				createdAt: moment(obj.createdAt).format('Do MMMM YYYY'),
				email: obj.userId.email,
				phoneNumber: obj.userId.phoneNumber,
				_id: obj._id,
				status: latestStage.length > 0 ? latestStage[0].status : null,
				stage: latestStage.length > 0 ? latestStage[0].stage : null
			};
		});
		const data = await Promise.all(promise);

		return { docs: data, pageCount, totalCount };
	};
}

function fetchingShortlistCandidate({ applicationDb, pick }) {
	return async function(payload) {
		const token = await applicationDb.findToken(payload.token);

		if (!token) {
			return false;
		}

		let application = await applicationDb
			.fetchApplication(
				{
					_id: payload.applicationId
				},
				{ select: { _id: 1, resume: 1, files: 1, notes: 1, userId: 1 } }
			)
			.lean();

		const user = await applicationDb.findUser({
			collection: 'users',
			id: application.userId,
			select: {
				name: 1,
				_id: 0,
				image: 1,
				email: 1,
				phoneNumber: 1,
				bio: 1,
				skills: 1,
				links: 1
			}
		});

		application = { ...application, ...user };

		let data;

		if (token.views > 0) {
			data = pick(application, [...token.views, 'bio', 'links']);
			return data;
		}

		data = application;

		return data;
	};
}

export {
	creatingApplication,
	updatingApplication,
	withdrawApplication,
	fetchingApplications,
	addToApplication,
	fetchingApplication,
	inviteApplicant,
	shortlistApplicant,
	inviteReviewer,
	reviewShortlist,
	fetchingShortlists,
	fetchingTalentApplications,
	fetchingShortlistCandidate
};
