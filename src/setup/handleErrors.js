const errorHandlers = require('../utils/errorhandler');
const logger = require('../utils/logger');

const handleErrors = app => {
	app.use((err, req, res, next) => {
		logger.log(err.message);
		logger.error(err.message);
		next(err);
	});

	if (process.env.NODE_ENV === 'development') {
		/* Development Error Handler - Prints stack trace */
		app.use(errorHandlers.developmentErrors);
	}

	// production error handler
	app.use(errorHandlers.productionErrors);
};

module.exports = handleErrors;
