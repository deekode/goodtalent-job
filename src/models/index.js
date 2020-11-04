import mongoose, { model, Schema } from 'mongoose';
import mongooseDelete from 'mongoose-delete';

import job from './Job';
import application from './Application';
import question from './Question';

import interview from './Interview';

import stage from './Stage';

import booking from './Booking';

import message from './Message';

const interviewModel = model(
	'interviews',
	interview(mongoose, Schema, mongooseDelete)
);

const bookingModel = model(
	'bookings',
	booking(mongoose, Schema, mongooseDelete)
);

const jobModel = model('jobs', job(mongoose, Schema, mongooseDelete));

const applicationModel = model(
	'applications',
	application(mongoose, Schema, mongooseDelete)
);

const questionModel = model(
	'questions',
	question(mongoose, Schema, mongooseDelete)
);

const messageModel = model(
	'messages',
	message(mongoose, Schema, mongooseDelete)
);

const stageModel = model(
	'application_stages',
	stage(mongoose, Schema, mongooseDelete)
);

export {
	jobModel,
	messageModel,
	applicationModel,
	questionModel,
	interviewModel,
	bookingModel,
	stageModel
};
