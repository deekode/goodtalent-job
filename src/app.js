import express from 'express';
import getRouter from '../src/routes/index';
import loadModules from './setup/loadModules';
import dbConnection from './setup/db';
import errorHandle from './setup/handleErrors';
import setupCustomResponses from './setup/customResponse';

const app = express();

/**
 * loads dependant modules and express starts server
 * @function
 * @param {object} port - port object.
 * @returns {function} server - starts server
 */
export default function startServer({ port }) {
	// check if there is port or use random port

	loadModules(app);

	// setup custom response methods
	app.use(setupCustomResponses);

	// load routes
	const router = getRouter();
	app.use('/api/v2', router);

	// custom error handling
	errorHandle(app);

	return dbConnection(app, {
		port
	});
}
