/* eslint-disable no-continue */
/* eslint-disable require-jsdoc */
import { join } from 'path';
import { promisify } from 'util';
import grpc from 'grpc';
import { loadSync } from '@grpc/proto-loader';
require('dotenv').config();

function notifyService() {
	const notifyPackageDefinition = loadSync(
		join(__dirname, '../../protos/notify.proto'),
		{
			keepCase: false,
			longs: String,
			enums: String,
			defaults: true,
			oneofs: true
		}
	);

	const notificationpackage = grpc.loadPackageDefinition(
		notifyPackageDefinition
	).notificationpackage;

	const Service = new notificationpackage.NotifyService(
		process.env.GRPC_NOTIFY_CLIENT,
		grpc.credentials.createInsecure()
	);

	const client = promisifyAll(Service);

	return client;
}

function userService() {
	const userPackageDefinition = loadSync(
		join(__dirname, '../../protos/user.proto'),
		{
			keepCase: false,
			longs: String,
			enums: String,
			defaults: true,
			oneofs: true
		}
	);

	const userpackage = grpc.loadPackageDefinition(userPackageDefinition)
		.userpackage;

	const Service = new userpackage.UserService(
		process.env.GRPC_USER_CLIENT,
		grpc.credentials.createInsecure()
	);

	const client = promisifyAll(Service);

	return client;
}

//NotificationClient

function promisifyAll(client) {
	const to = {};
	for (const k in client) {
		if (typeof client[k] != 'function') continue;
		to[k] = promisify(client[k].bind(client));
	}
	return to;
}

export { userService, notifyService };
