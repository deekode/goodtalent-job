/* eslint-disable babel/new-cap */
/* eslint-disable require-jsdoc */
import express from 'express';

import { catchErrors } from '../../utils/errorhandler';
import { talentAuth, userAuth } from '../../middleware/authentication';
import * as Controller from '../../controllers/index';

function getInterviewRoutes() {
	const router = express.Router();

	router.post('/invite', userAuth, catchErrors(Controller.inviteInterview));

	router.patch(
		'/:interviewId',
		userAuth,
		catchErrors(Controller.updateInterview)
	);

	router.get(
		'/company',
		userAuth,
		catchErrors(Controller.fetchCompanyInterviews)
	);

	router.delete(
		'/:interviewId',
		userAuth,
		catchErrors(Controller.deleteInterview)
	);

	router.get('/bookings', talentAuth, catchErrors(Controller.fetchBookings));

	router.get(
		'/booking/:jobId',
		talentAuth,
		catchErrors(Controller.fetchBooking)
	);

	router.post('/book', talentAuth, catchErrors(Controller.createBooking));

	router.patch(
		'/booking/remove/:bookingId',
		talentAuth,
		catchErrors(Controller.removeBooking)
	);

	return router;
}

export default getInterviewRoutes;
