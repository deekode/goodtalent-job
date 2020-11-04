/* eslint-disable babel/new-cap */
/* eslint-disable require-jsdoc */
import express from 'express';

import { catchErrors } from '../../utils/errorhandler';
import { userAuth } from '../../middleware/authentication';
import * as jobController from '../../controllers/index';

function getMessageRoutes() {
	const router = express.Router();

	router.post(
		'/create',
		userAuth,
		catchErrors(jobController.createMessageController)
	);

	router.patch(
		'/:messageId',
		userAuth,
		catchErrors(jobController.updateMessageController)
	);

	router.get(
		'/messages',
		userAuth,
		catchErrors(jobController.fetchMessagesController)
	);

	router.get(
		'/:messageId',
		userAuth,
		catchErrors(jobController.fetchMessageController)
	);

	router.delete(
		'/:messageId',
		userAuth,
		catchErrors(jobController.deleteMessageController)
	);

	router.post(
		'/',
		userAuth,
		catchErrors(jobController.sendMessageController)
	);

	return router;

	return router;
}

export default getMessageRoutes;
