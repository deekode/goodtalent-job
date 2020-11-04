/* eslint-disable import/no-mutable-exports */
import mongoose from 'mongoose';
import {
	jobModel,
	applicationModel,
	questionModel,
	bookingModel,
	interviewModel,
	messageModel,
	stageModel
} from '../models';
import stage from './Stage';
import job from './Job';
import application from './Application';
import Db from './db';
import question from './Question';
import booking from './Booking';
import interview from './Interview';

import message from './Message';

const messageDb = message(messageModel);

let jobDb = job(jobModel);

let applicationDb = application(applicationModel);

const questionDb = question(questionModel);

const stageDb = stage(stageModel);

let bookingDb = booking(bookingModel);

let interviewDb = interview(interviewModel);

const db = Db(mongoose);

applicationDb = { ...applicationDb, ...db };

jobDb = { ...jobDb, ...db };

bookingDb = { ...bookingDb, ...db };

interviewDb = { ...interviewDb, ...db };

export {
	jobDb,
	applicationDb,
	questionDb,
	bookingDb,
	interviewDb,
	messageDb,
	stageDb
};
