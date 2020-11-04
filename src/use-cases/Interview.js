/* eslint-disable require-jsdoc */

function createInterview({ interviewDb }) {
	return async function(interviewArray) {
		const interview = await interviewDb.createInterview(interviewArray);
		return interview;
	};
}

function inviteInterview({
	interviewDb,
	bookingDb,
	applicationDb,
	formatEmail,
	notifyClient,
	updateApplicationStage
}) {
	return async function(payload) {
		const data = payload.applicationIds.map(async doc => {
			const interview = await interviewDb.fetchInterview({
				_id: payload.interviewId
			});

			if (interview.dates.length === 0) {
				return {
					error: true,
					message:
						'You have not added any interview date. Add interview date to this job to invite a talent.'
				};
			}

			const stage = await updateApplicationStage({
				applicationIds: [doc],
				stage: interview.type,
				type: 'interview',
				status: 'invited',
				jobId: interview.jobId,
				interviewId: payload.interviewId
			});

			const application = await applicationDb
				.fetchApplication({ _id: doc })
				.lean();

			application.userId = await applicationDb.findUser({
				collection: 'users',
				id: application.userId,
				select: { name: 1, _id: 1, email: 1 }
			});

			await bookingDb.updateOrCreate(
				{ applicationId: doc._id },
				{
					jobId: interview.jobId,
					applicationId: doc,
					interviewId: interview._id,
					userId: application.userId._id,
					stageId: stage.length > 0 ? stage[0]._id : stage[0]._id
				},
				{ upsert: true }
			);

			const html = formatEmail('interview', {
				link: `${process.env.FRONTEND_SERVER}/login`,
				name: application.userId.name
			});

			notifyClient
				.notifyByEmail({
					htmlMessage: html,
					subject: 'Invitation for Interview',
					recepients: [{ Email: application.userId.email }]
				})
				.catch(err => {
					console.log(err);
				});
		});

		await Promise.all(data);

		return {};
	};
}

function deleteInterview({ interviewDb }) {
	return async function(payload) {
		await interviewDb.deleteInterview({ _id: payload.id });
		return {};
	};
}

function updateInterview({ interviewDb, validatePayload }) {
	return async function(payload, id) {
		await validatePayload(payload);
		const interview = await interviewDb.updateInterview(id, payload, {
			new: true
		});

		return interview;
	};
}

function fetchInterviews({ interviewDb }) {
	return async function(query) {
		const interviews = await interviewDb.fetchInterviews(query);
		const data = interviews.map(doc => {
			return {
				dates: doc.dates,
				_id: doc._id,
				maxNumber: doc.maxNumber,
				type: doc.type
			};
		});
		return data;
	};
}

function fetchBookings({ bookingDb, moment, jobDb }) {
	return async function(query) {
		const bookings = await bookingDb
			.fetchBookings(query)
			.lean()
			.populate({
				path: 'stageId',
				select: ['status']
			})
			.populate({
				path: 'jobId',
				select: ['title', 'pay', 'userId']
			});
		const promise = bookings.map(async obj => {
			obj.companyId = await jobDb.findUser({
				collection: 'users',
				id: obj.jobId.userId,
				select: { name: 1, _id: 1, image: 1 }
			});
			return {
				company: obj.companyId.name,
				companyImage: obj.companyId.image,
				pay: obj.jobId.pay,
				jobId: obj.jobId._id,
				_id: obj._id,
				title: obj.jobId.title,
				status: obj.stageId.status,
				interviewId: obj.interviewId,
				date: obj.date ? moment(obj.date).format('Do MMMM YYYY') : '',
				time: obj.date ? moment(obj.date).format('hh:mm') : ''
			};
		});
		const data = await Promise.all(promise);
		return data;
	};
}

function creatingBooking({
	bookingDb,
	jobDb,
	interviewDb,
	moment,
	formatEmail,
	notifyClient,
	updateApplicationStage
}) {
	return async function(payload) {
		const interview = await interviewDb.fetchInterview({
			_id: payload.interviewId
		});

		const bookings = await bookingDb.countBookings({
			interviewId: payload.interviewId,
			date: { $exists: true }
		});

		if (bookings.length >= interview.maxNumber) {
			return {
				error: true,
				message: 'This interview has been filled up!'
			};
		}

		const booking = await bookingDb.updateBooking(
			{ interviewId: payload.interviewId, userId: payload.user._id },
			{ $set: { date: payload.date, companyId: interview.userId } },
			{
				new: true
			}
		);

		await updateApplicationStage({
			applicationIds: [booking.applicationId],
			stage: interview.type,
			status: 'scheduled',
			jobId: interview.jobId,
			bookingId: booking._id
		});

		booking.userId = await jobDb.findUser({
			collection: 'users',
			id: interview.userId,
			select: { name: 1, _id: 1, email: 1, phoneNumber: 1 }
		});

		const html = formatEmail('booking', {
			link: `${process.env.FRONTEND_SERVER}/login`,
			date: moment(interview.date).format('LLLL'),
			name: interview.userId.name
		});

		notifyClient
			.notifyByEmail({
				htmlMessage: html,
				subject: 'New Booking for Interview',
				recepients: [{ Email: interview.userId.email }]
			})
			.catch(err => {
				console.log(err);
			});

		return booking;
	};
}

function fetchCompanyInterviews({
	bookingDb,
	applicationDb,
	moment,
	paginate
}) {
	return async function(query, payload) {
		const docs = await paginate(
			bookingDb.fetchBookings,
			bookingDb.countBookings,
			query,
			{ pageNo: payload.pageNo, size: payload.size },
			[
				{
					path: 'jobId',
					select: ['title']
				},
				{
					path: 'stageId',
					select: ['status']
				}
			]
		);

		const { pageCount, totalCount } = docs.data;
		const bookings = docs.data.docs;

		const promise = bookings.map(async obj => {
			const application = await applicationDb.findUser({
				collection: 'users',
				id: obj.userId,
				select: { name: 1, _id: 1, email: 1, phoneNumber: 1 }
			});

			return {
				applicationId: obj.applicationId,
				name: application.name,
				email: application.email,
				phoneNumber: application.phoneNumber,
				date: obj.interviewId
					? moment(obj.date).format('Do MMMM YYYY')
					: '',
				time: obj.interviewId ? moment(obj.date).format('hh:mm') : '',
				jobRole: obj.jobId.title,
				dateTime: obj.date,
				status: obj.stageId.status
			};
		});

		const data = await Promise.all(promise);

		return { docs: data, pageCount, totalCount };
	};
}

function fetchBooking({ interviewDb, moment, jobDb }) {
	return async function(payload) {
		const docs = await interviewDb.fetchInterviews({
			jobId: payload.jobId
		});

		const job = await jobDb.fetchJob({ _id: payload.jobId }).lean();

		job.userId = await jobDb.findUser({
			collection: 'users',
			id: job.userId,
			select: { name: 1, _id: 1, email: 1, phoneNumber: 1 }
		});

		const interviews = docs.map(obj => {
			return {
				date: moment(obj.date).format('Do MMMM YYYY'),
				time: moment(obj.date).format('hh:mm'),
				_id: obj._id,
				dateTime: obj.date
			};
		});

		const data = {
			jobDescription: job.description,
			companyName: job.userId.name,
			title: job.title,
			pay: job.pay,
			location: job.location,
			interviews
		};

		return data;
	};
}

function removeBooking({ bookingDb, interviewDb }) {
	return async function(payload) {
		const booking = await bookingDb.updateBooking(
			{ _id: payload.bookingId },
			{
				status: 'invited',
				$unset: {
					interviewId: ''
				}
			}
		);

		await interviewDb.updateInterview(booking.interviewId, {
			$pull: {
				bookings: booking._id
			}
		});

		return {};

		//send mail
	};
}

//create interview types

function createInterviewTypes({ jobDb }) {
	return async function(query, payload) {
		const data = await jobDb.updateJob(
			query,
			{ interviewTypes: payload },
			{ new: true }
		);

		return data;
	};
}

export {
	fetchInterviews,
	fetchBookings,
	fetchBooking,
	createInterview,
	inviteInterview,
	deleteInterview,
	updateInterview,
	removeBooking,
	createInterviewTypes,
	creatingBooking,
	fetchCompanyInterviews
};
