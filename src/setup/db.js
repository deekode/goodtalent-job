/* eslint-disable no-shadow */
/* eslint-disable handle-callback-err */
/* eslint-disable no-console */
const mongoose = require('mongoose');
const detectPort = require('detect-port');
const logger = require('../utils/logger');

//setup database

mongoose.Promise = global.Promise;
// Connecting to the database
const connection = (app, port) =>
	new Promise(async resolve => {
		port = port || (await detectPort());
		const server = app.listen(port, () => {
			logger.log(`Listening on port ${server.address().port}`);
			const originalClose = server.close.bind(server);
			server.close = () => {
				return new Promise(resolveClose => {
					originalClose(resolveClose);
				});
			};
			const option = {
				socketTimeoutMS: 30000,
				keepAlive: true,
				reconnectTries: 30000,
				useNewUrlParser: true
			};
			mongoose.connect(process.env.DATABASE, option, (err, database) => {
				if (err) {
					logger.log(err);
				}

				logger.log(`Database activated!`);
				server.db = {
					drop: () => {
						return new Promise(resolve => {
							database.dropDatabase((err, result) => {
								logger.log(`Error : ${err}`);
								if (err) throw err;
								database.close();
								resolve(`Operation Success ? ${result}`);
							});
						});
					}
				};
				if (database.collection) {
					database.collections.jobs.createIndex({
						skills: 'text',
						title: 'text',
						description: 'text'
					});
				}
				resolve(server);
			});
		});
	});

module.exports = connection;
