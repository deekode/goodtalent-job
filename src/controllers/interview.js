import { lte } from 'lodash';

const inviteInterview = invite => {
	return async (req, res) => {
		const data = await invite({
			applicationIds: req.body.applicationIds,
			interviewId: req.body.interviewId,
			companyId: req.query.companyId ? req.query.companyId : req.user._id
		});
		if (data.error) {
			return res.is.badRequest({
				message: data.message
			});
		}
		return res.is.ok({
			message: 'You have successfully sent an invitation for interview!'
		});
	};
};

const updateInterview = invite => {
	return async (req, res) => {
		await invite(req.body, req.params.interviewId);
		return res.is.ok({
			message: 'Interview Updated Successfully!'
		});
	};
};

const deleteInterview = invite => {
	return async (req, res) => {
		await invite({ id: req.params.interviewId });
		return res.is.ok({
			message: 'Interview Deleted Successfully!'
		});
	};
};

const fetchBookings = booking => {
	return async (req, res) => {
		const data = await booking({
			userId: req.user._id,
			status: req.query.status
		});
		return res.is.ok({
			message: 'Bookings Fetched Successfully!',
			data
		});
	};
};

const fetchCompanyInterviews = booking => {
	return async (req, res) => {
		let date = { $gt: new Date().toISOString() };
		if (req.query.status === 'past') {
			date = { $lt: new Date().toISOString() };
		}
		const data = await booking(
			{
				companyId: req.query.companyId
					? req.query.companyId
					: req.user._id,
				date
			},
			{
				size: req.query.size,
				pageNo: req.query.pageNo
			}
		);
		return res.is.ok({
			message: 'Interviews Fetched Successfully!',
			data
		});
	};
};

const fetchBooking = booking => {
	return async (req, res) => {
		const data = await booking({
			jobId: req.params.jobId
		});
		return res.is.ok({
			message: 'Booking Fetched Successfully!',
			data
		});
	};
};

const createBooking = booking => {
	return async (req, res) => {
		const data = await booking({
			interviewId: req.body.interviewId,
			date: req.body.date,
			user: req.user
		});
		if (data.error) {
			return res.is.badRequest({
				message: data.message
			});
		}
		return res.is.ok({
			message: 'Booking Made Successfully!'
		});
	};
};

const removeBooking = booking => {
	return async (req, res) => {
		const data = await booking({
			bookingId: req.params.bookingId
		});
		if (data.error) {
			return res.is.badRequest({
				message: data.message
			});
		}
		return res.is.ok({
			message: 'Booking Removed Successfully!'
		});
	};
};

export {
	inviteInterview,
	updateInterview,
	deleteInterview,
	fetchBookings,
	fetchBooking,
	createBooking,
	removeBooking,
	fetchCompanyInterviews
};
