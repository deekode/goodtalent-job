/* eslint-disable require-jsdoc */
import { join } from 'path';
import { Server, loadPackageDefinition, ServerCredentials } from 'grpc';
import { loadSync } from '@grpc/proto-loader';
import logger from '../../utils/logger';
import { jobDb, applicationDb } from '../../data-access';

function startRpcServer() {
	const packageDefinition = loadSync(join(__dirname, '../protos/job.proto'), {
		keepCase: false,
		longs: String,
		enums: String,
		defaults: true,
		oneofs: true
	});

	const protoDescriptor = loadPackageDefinition(packageDefinition);
	const jobpackage = protoDescriptor.jobpackage;

	const PORT = process.env.GRPC_SERVER;

	//Creates the new server
	const server = new Server();

	//Services
	server.addService(jobpackage.JobService.service, {
		countJobs,
		fetchJob,
		fetchJobs,
		countApplications,
		fetchApplications,
		fetchApplication
	});
	// server.bind(`localhost:${PORT}`, ServerCredentials.createInsecure());
	// logger.log(`The grpc server is running on port ${PORT}`);
	//starts the server
	return server.start();
}

//Function on server side to verify batch id and send it to the client
async function countJobs(call, callback) {
	try {
		let { payload } = call.request;
		payload = JSON.parse(payload);
		const { query } = payload;
		if (!query) {
			return callback({
				code: status.INVALID_ARGUMENT,
				message: 'Please provide a valid query'
			});
		}
		const response = await jobDb.countJobs(query);
		return callback(null, { response: JSON.stringify({ data: response }) });
	} catch (e) {
		return callback(e);
	}
}

async function fetchJobs(call, callback) {
	try {
		let { payload } = call.request;
		payload = JSON.parse(payload);
		const { query } = payload;
		if (!query) {
			return callback({
				code: status.INVALID_ARGUMENT,
				message: 'Please provide a valid query'
			});
		}
		const response = await jobDb.fetchJobs(query);
		return callback(null, { response: JSON.stringify({ data: response }) });
	} catch (e) {
		return callback(e);
	}
}

async function fetchJob(call, callback) {
	try {
		let { payload } = call.request;
		payload = JSON.parse(payload);
		const { query } = payload;
		if (!query) {
			return callback({
				code: status.INVALID_ARGUMENT,
				message: 'Please provide a valid query'
			});
		}
		const response = await jobDb.fetchJobs(query);
		return callback(null, { response: JSON.stringify({ data: response }) });
	} catch (e) {
		return callback(e);
	}
}

async function countApplications(call, callback) {
	try {
		let { payload } = call.request;
		payload = JSON.parse(payload);
		const { query } = payload;
		if (!query) {
			return callback({
				code: status.INVALID_ARGUMENT,
				message: 'Please provide a valid query'
			});
		}
		const response = await applicationDb.countApplications(query);
		return callback(null, { response: JSON.stringify({ data: response }) });
	} catch (e) {
		return callback(e);
	}
}

async function fetchApplications(call, callback) {
	try {
		let { payload } = call.request;
		payload = JSON.parse(payload);
		const { query, options } = payload;
		if (!query) {
			return callback({
				code: status.INVALID_ARGUMENT,
				message: 'Please provide a valid query'
			});
		}
		const response = await jobDb.fetchApplications(query, options);

		return callback(null, { response: JSON.stringify({ data: response }) });
	} catch (e) {
		return callback(e);
	}
}

async function fetchApplication(call, callback) {
	try {
		let { payload } = call.request;
		payload = JSON.parse(payload);
		const { query } = payload;
		if (!query) {
			return callback({
				code: status.INVALID_ARGUMENT,
				message: 'Please provide a valid query'
			});
		}
		const response = await jobDb.fetchApplication(query);
		return callback(null, { response: JSON.stringify({ data: response }) });
	} catch (e) {
		return callback(e);
	}
}

export { startRpcServer };
