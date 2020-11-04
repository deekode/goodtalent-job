/* eslint-disable babel/new-cap */
/* eslint-disable require-jsdoc */
import express from 'express';

import { catchErrors } from '../../utils/errorhandler';
import {
	superAdminAuth,
	userAuth,
	companyAuth,
	talentAuth,
	agencyAuth
} from '../../middleware/authentication';
import * as jobController from '../../controllers/index';

function getSubscriptionRoutes() {
	const router = express.Router();

	router.post('/', userAuth, catchErrors(jobController.createJobController));

	router.patch(
		'/:id',
		userAuth,
		catchErrors(jobController.updateJobController)
	);

	router.get(
		'/talent',
		talentAuth,
		catchErrors(jobController.fetchJobsByTalentController)
	);

	router.get(
		'/company',
		companyAuth,
		catchErrors(jobController.fetchJobsByCompanyController)
	);

	router.get(
		'/agency',
		agencyAuth,
		catchErrors(jobController.fetchJobsByAgencyController)
	);

	router.get(
		'/iframe/:companyId',
		catchErrors(jobController.fetchiframeJobsController)
	);

	router.get(
		'/iframe/job/:jobId',
		catchErrors(jobController.fetchiframeJobController)
	);

	router.patch(
		'/status/:jobId',
		userAuth,
		catchErrors(jobController.changeJobStatusController)
	);

	router.get(
		'/admin',
		superAdminAuth,
		catchErrors(jobController.fetchJobsByAdminController)
	);
	router.get(
		'/questions',
		catchErrors(jobController.fetchJobQuestionsController)
	);

	router.get('/ids', catchErrors(jobController.fetchingJobIdsController));

	router.get(
		'/:jobId',
		userAuth,
		catchErrors(jobController.fetchJobController)
	);

	router.post(
		'/question',
		userAuth,
		catchErrors(jobController.createJobQuestionController)
	);

	router.patch(
		'/question/:questionId',
		userAuth,
		catchErrors(jobController.updateJobQuestionController)
	);
	router.delete(
		'/question/:questionId',
		userAuth,
		catchErrors(jobController.deleteJobQuestionController)
	);
	return router;
}

export default getSubscriptionRoutes;
