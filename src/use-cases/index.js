import { pick } from 'lodash';
import moment from 'moment';
import paginate from '../utils/paginate';
import { jobStatus, applicationTerms } from '../utils/constansts';
import {
	jobDb,
	applicationDb,
	questionDb,
	bookingDb,
	messageDb,
	interviewDb,
	stageDb
} from '../data-access/index';
import * as jobLogic from '../biz-logic';
import { formatEmail } from '../utils/mail';
import { generateToken } from '../utils/tokens';
import { notifyService } from '../grpc/client/user';
import * as Job from './Job';
import * as Application from './Application';
import * as Interview from './Interview';
import * as Message from './Message';
const notifyClient = notifyService();
//import { testDb } from '../../test/data-access/index';
//import { subscriptionDb } from '../../subscription/data-access/index';
//import { userDb } from '../../user/data-access/index';

let testDb, userDb;

const createJob = Job.creatingJob({
	jobDb,
	pick,
	validateJob: jobLogic.createJob,
	jobStatus,
	createInterview: Interview.createInterview({ interviewDb })
});

const changeJobStatus = Job.changeJobStatus({
	jobDb
});

const jobForTest = Job.jobForTests({
	jobDb,
	applicationDb
});

const fetchJobs = Job.fetchingJobs({
	jobDb,
	moment,
	paginate,
	applicationDb,
	bookingDb,
	testDb
});

const fetchJob = Job.fetchingJob({
	jobDb,
	moment,
	applicationDb,
	fetchInterviews: Interview.fetchInterviews({ interviewDb }),
	questionDb
});

const iframeJob = Job.fetchingIframeJob({
	jobDb,
	moment
});

const iframeJobs = Job.fetchingIframeJobs({
	jobDb,
	moment,
	paginate
});

const updateJob = Job.updatingJob({
	jobDb,
	pick,
	validateJob: jobLogic.createJob,
	createInterview: Interview.createInterview({ interviewDb })
});

const createJobQuestion = Job.createQuestions({
	validateInput: jobLogic.createQuestion,
	questionDb
});

const updateJobQuestion = Job.updateQuestions({
	validateInput: jobLogic.updateQuestion,
	questionDb
});

const deleteJobQuestion = Job.deleteQuestion({
	questionDb
});

const fetchJobQuestions = Job.fetchQuestions({
	questionDb
});
const fetchingJobIds = Job.fetchingJobIds({
	jobDb
});

const createApplication = Application.creatingApplication({
	applicationDb,
	userDb,
	validateApplication: jobLogic.createApplication,
	applicationTerms,
	jobDb,
	formatEmail,
	notifyClient,
	stageDb
});

const fetchApplications = Application.fetchingApplications({
	applicationDb,
	moment,
	stageDb,
	paginate
});

const fetchingTalentApplications = Application.fetchingTalentApplications({
	applicationDb,
	moment,
	stageDb,
	paginate
});

const fetchApplication = Application.fetchingApplication({
	applicationDb,
	stageDb,
	bookingDb,
	interviewDb
});

const updateApplication = Application.updatingApplication({
	applicationDb,
	stageDb,
	validateInput: jobLogic.validateApplicationStatus
});
const addToApplication = Application.addToApplication({
	applicationDb,
	validateInput: jobLogic.validateaddToApplication
});

const inviteApplicant = Application.inviteApplicant({
	applicationDb,
	generateToken,
	validateApplicants: jobLogic.inviteApplication,
	formatEmail,
	notifyClient
});

const shortlistApplicant = Application.shortlistApplicant({
	applicationDb,
	validateInput: jobLogic.shortlistApplicant
});

const inviteReviewer = Application.inviteReviewer({
	applicationDb,
	generateToken,
	formatEmail,
	notifyClient,
	validateInput: jobLogic.inviteReviewer
});

const reviewShortlist = Application.reviewShortlist({
	applicationDb,
	validateInput: jobLogic.reviewShortlist,
	updateApplicationStage: updateApplication
});

const fetchingShortlists = Application.fetchingShortlists({
	applicationDb,
	moment,
	paginate,
	stageDb
});

const fetchingShortlistCandidate = Application.fetchingShortlistCandidate({
	applicationDb,
	pick
});

const createInterview = Interview.createInterview({ interviewDb });

const inviteInterview = Interview.inviteInterview({
	interviewDb,
	bookingDb,
	applicationDb,
	formatEmail,
	notifyClient,
	updateApplicationStage: updateApplication
});

const updateInterview = Interview.updateInterview({
	interviewDb,
	validatePayload: jobLogic.validateInterview
});

const deleteInterview = Interview.deleteInterview({
	interviewDb
});

const fetchInterviews = Interview.fetchInterviews({ interviewDb });

const fetchCompanyInterviews = Interview.fetchCompanyInterviews({
	bookingDb,
	applicationDb,
	moment,
	paginate
});

const fetchBookings = Interview.fetchBookings({
	moment,
	bookingDb,
	jobDb
});

const fetchBooking = Interview.fetchBooking({
	interviewDb,
	moment,
	jobDb
});

const createBooking = Interview.creatingBooking({
	bookingDb,
	jobDb,
	interviewDb,
	moment,
	formatEmail,
	notifyClient,
	updateApplicationStage: updateApplication
});

const removeBooking = Interview.removeBooking({
	bookingDb,
	interviewDb
});

const createMessage = Message.createMessage({
	messageDb,
	validateInput: jobLogic.createMessage
});

const updateMessage = Message.updateMessgae({
	messageDb,
	validateInput: jobLogic.createMessage
});

const fetchMessages = Message.fetchMessages({ messageDb });

const fetchMessage = Message.fetchMessage({ messageDb });

const deleteMessage = Message.deleteMessage({ messageDb });

const sendMessage = Message.sendMessgaes({
	messageDb,
	formatEmail,
	notifyClient
});

export {
	createJob,
	updateJob,
	updateApplication,
	createApplication,
	fetchApplications,
	fetchingShortlists,
	fetchApplication,
	fetchingTalentApplications,
	addToApplication,
	inviteReviewer,
	reviewShortlist,
	fetchingShortlistCandidate,
	shortlistApplicant,
	fetchJobs,
	fetchJob,
	jobForTest,
	changeJobStatus,
	iframeJob,
	iframeJobs,
	fetchingJobIds,
	fetchJobQuestions,
	createJobQuestion,
	updateJobQuestion,
	deleteJobQuestion,
	inviteApplicant,
	createInterview,
	inviteInterview,
	updateInterview,
	deleteInterview,
	fetchInterviews,
	fetchCompanyInterviews,
	fetchBookings,
	fetchBooking,
	createBooking,
	removeBooking,
	createMessage,
	updateMessage,
	fetchMessages,
	fetchMessage,
	deleteMessage,
	sendMessage
};
