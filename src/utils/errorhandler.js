/* eslint-disable func-names */
/*
Catch Errors Handler
With async/await, you need some way to catch errors
Instead of using try{} catch(e) {} in each controller, we wrap the function in
catchErrors(), catch any errors they throw, and pass it along to our express middleware with next()
*/

import logger from './logger';

const catchErrors = fn => {
	return function(req, res, ...args) {
		return fn(req, res, ...args).catch(error => {
			logger.error(error);
			res.status(400).json({
				status: false,
				errors: error.errors || error.message
			});
		});
	};
};

/*
Not Found Error Handler
If we hit a route that is not found, we mark it as 404 and pass it along to the next error handler to display
*/
const notFound = (req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
};

/*
Development Error Handler
In development we show good error messages so if we hit a syntax error or any other previously un-handled error, we can show good info on what happened
*/
const developmentErrors = (err, req, res, _) => {
	err.stack = err.stack || '';
	const errorDetails = {
		message: err.message,
		status: err.status,
		stackHighlighted: err.stack.replace(/[a-z_-\d]+.js:\d+:\d+/gi, '<mark>$&</mark>')
	};
	res.status(err.status || 500);
	res.format({
		'application/json': () => res.json(errorDetails) // Ajax call, send JSON back
	});
};

/*
Production Error Handler
No stacktraces are leaked to user
*/
const productionErrors = (err, req, res, _) => {
	res.status(err.status || 500);
	res.json({
		message: err.message,
		error: {}
	});
};

export { catchErrors, notFound, developmentErrors, productionErrors };