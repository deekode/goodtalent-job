/* eslint-disable babel/new-cap */
/* eslint-disable require-jsdoc */
import express from 'express';

import { catchErrors } from '../../utils/errorhandler';
import { talentAuth, userAuth } from '../../middleware/authentication';
import * as jobController from '../../controllers/index';

function getApplicationRoutes() {
	const router = express.Router();

	router.post(
		'/',
		talentAuth,
		catchErrors(jobController.createApplicationController)
	);

	router.get(
		'/talent',
		talentAuth,
		catchErrors(jobController.fetchApplicationsByTalentController)
	);

	router.get(
		'/jobs/:jobId',
		userAuth,
		catchErrors(jobController.fetchApplicationsByJobsController)
	);

	router.get(
		'/shortlist/:applicationId',
		catchErrors(jobController.fetchingShortlistCandidate)
	);

	router.get(
		'/shortlists',
		catchErrors(jobController.fetchingShortlistsController)
	);


	router.get(
		'/:applicationId',
		userAuth,
		catchErrors(jobController.fetchApplicationController)
	);

	router.patch(
		'/status',
		userAuth,
		catchErrors(jobController.updateApplicationController)
	);

	router.post(
		'/invite/applicant',
		userAuth,
		catchErrors(jobController.inviteApplicantsController)
	);

	router.patch(
		'/add/:applicationId',
		userAuth,
		catchErrors(jobController.addToApplicationController)
	);

	router.post(
		'/shortlist/:applicationId',
		userAuth,
		catchErrors(jobController.shortlistApplicants)
	);

	router.post(
		'/invite/reviewer',
		userAuth,
		catchErrors(jobController.inviteReviewerController)
	);

	router.post(
		'/reviewShortlist',
		catchErrors(jobController.reviewShortlistController)
	);

	return router;
}

export default getApplicationRoutes;
