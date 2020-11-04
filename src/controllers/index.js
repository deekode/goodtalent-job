import * as useCase from '../use-cases';

import * as Job from './job';

import * as Application from './application';

import * as Interview from './interview';

import * as Controller from './message';

const createMessageController = Controller.createMessage(useCase.createMessage);

const updateMessageController = Controller.updateMessage(useCase.updateMessage);

const fetchMessagesController = Controller.fetchMessgaes(useCase.fetchMessages);

const fetchMessageController = Controller.fetchMessage(useCase.fetchMessage);

const deleteMessageController = Controller.deleteMessage(useCase.deleteMessage);

const sendMessageController = Controller.sendMessage(useCase.sendMessage);

const createJobController = Job.createJob(useCase.createJob);

const changeJobStatusController = Job.changeJobStatus(useCase.changeJobStatus);

const updateJobController = Job.updateJob(useCase.updateJob);

const createApplicationController = Application.createApplication(
	useCase.createApplication
);

const fetchApplicationsByJobsController = Application.fetchApplications(
	useCase.fetchApplications
);

const fetchApplicationsByTalentController = Application.fetchApplicationsByTalent(
	useCase.fetchingTalentApplications
);

const fetchApplicationController = Application.fetchApplication(
	useCase.fetchApplication
);

const addToApplicationController = Application.addToApplication(
	useCase.addToApplication
);

const fetchJobsByTalentController = Job.fetchJobsByTalent(useCase.fetchJobs);

const fetchJobsByCompanyController = Job.fetchJobsByCompany(useCase.fetchJobs);

const fetchJobsByAgencyController = Job.fetchJobsByAgency(useCase.fetchJobs);

const fetchJobsByAdminController = Job.fetchJobsByAdmin(useCase.fetchJobs);

const updateApplicationController = Application.updateApplication(
	useCase.updateApplication
);

const fetchJobController = Job.fetchJob(useCase.fetchJob);

const fetchiframeJobController = Job.fetchIframeJob(useCase.iframeJob);
const fetchingJobIdsController = Job.fetchingJobIds(useCase.fetchingJobIds);
const fetchiframeJobsController = Job.fetchIframeJobs(useCase.iframeJobs);

const createJobQuestionController = Job.createJobQuestions(
	useCase.createJobQuestion
);

const updateJobQuestionController = Job.updateJobQuestion(
	useCase.updateJobQuestion
);

const deleteJobQuestionController = Job.deleteJobQuestion(
	useCase.deleteJobQuestion
);

const fetchJobQuestionsController = Job.fetchJobQuestions(
	useCase.fetchJobQuestions
);

const inviteApplicantsController = Application.inviteApplicants(
	useCase.inviteApplicant
);

const shortlistApplicants = Application.shortlistApplicants(
	useCase.shortlistApplicant
);

const inviteReviewerController = Application.inviteReviewer(
	useCase.inviteReviewer
);

const reviewShortlistController = Application.reviewShortlist(
	useCase.reviewShortlist
);

const fetchingShortlistsController = Application.fetchingShortlists(
	useCase.fetchingShortlists
);

const fetchingShortlistCandidate = Application.fetchingShortlistCandidate(
	useCase.fetchingShortlistCandidate
);

const inviteInterview = Interview.inviteInterview(useCase.inviteInterview);

const updateInterview = Interview.updateInterview(useCase.updateInterview);

const deleteInterview = Interview.deleteInterview(useCase.deleteInterview);

const fetchBookings = Interview.fetchBookings(useCase.fetchBookings);

const fetchBooking = Interview.fetchBooking(useCase.fetchBooking);

const createBooking = Interview.createBooking(useCase.createBooking);

const removeBooking = Interview.removeBooking(useCase.removeBooking);

const fetchCompanyInterviews = Interview.fetchCompanyInterviews(
	useCase.fetchCompanyInterviews
);

export {
	createJobController,
	updateJobController,
	fetchingJobIdsController,
	fetchiframeJobController,
	fetchiframeJobsController,
	updateApplicationController,
	shortlistApplicants,
	fetchingShortlistCandidate,
	fetchingShortlistsController,
	reviewShortlistController,
	inviteReviewerController,
	addToApplicationController,
	createApplicationController,
	fetchApplicationsByTalentController,
	fetchApplicationsByJobsController,
	fetchApplicationController,
	fetchJobsByTalentController,
	fetchJobsByCompanyController,
	fetchJobsByAgencyController,
	fetchJobsByAdminController,
	fetchJobController,
	changeJobStatusController,
	createJobQuestionController,
	updateJobQuestionController,
	deleteJobQuestionController,
	fetchJobQuestionsController,
	inviteApplicantsController,
	inviteInterview,
	updateInterview,
	deleteInterview,
	fetchBookings,
	fetchBooking,
	createBooking,
	removeBooking,
	fetchCompanyInterviews,
	createMessageController,
	updateMessageController,
	fetchMessagesController,
	fetchMessageController,
	deleteMessageController,
	sendMessageController
};
