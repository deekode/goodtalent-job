/* eslint-disable babel/new-cap */
/* eslint-disable require-jsdoc */
import { Router } from 'express';

import jobRoutes from './apiV2/job';
import applicationRoutes from './apiV2/application';
import interviewRoutes from './apiV2/interview';
import messageRoutes from './apiV2/message';

function getRouter() {
	const router = Router();
	router.get('test', (req, res) => {
		res.send({ message: 'This is a test route!' });
	});

	router.use('/job', jobRoutes());
	router.use('/application', applicationRoutes());
	router.use('/interview', interviewRoutes());
	router.use('/message', messageRoutes());

	return router;
}

export default getRouter;
