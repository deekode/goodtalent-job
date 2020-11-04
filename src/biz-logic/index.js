import * as Validate from './validate';
import * as Job from './job';
import * as Application from './Application';

import * as Message from './Message';
import * as Interview from './Interview';

const createMessage = Message.createMessage({
	validateInput: Validate.validateMessage
});

const validateInterview = Interview.createInterview({
	validateInput: Validate.validateInterview
});

export { validateInterview };

const createJob = Job.createJob({
	validateInput: Validate.validateJob
});

const createApplication = Application.createApplication({
	validateInput: Validate.validateApplication
});

const validateaddToApplication = Application.validateaddToApplication({
	validateInput: Validate.validateaddToApplication
});

const validateApplicationStatus = Application.validateApplicationStatus({
	validateInput: Validate.validateApplicationStatus
});

const inviteApplication = Application.inviteApplication({
	validateInput: Validate.inviteApplication
});

const shortlistApplicant = Application.shortlist({
	validateInput: Validate.shortlist
});

const inviteReviewer = Application.inviteReviewer({
	validateInput: Validate.inviteReviewer
});

const reviewShortlist = Application.reviewShortlist({
	validateInput: Validate.reviewShortlist
});

const createQuestion = Job.createQuestion({
	validateInput: Validate.validateQuestion
});

const updateQuestion = Job.updateQuestion({
	validateInput: Validate.validateQuestion
});

export {
	createJob,
	createApplication,
	validateApplicationStatus,
	createQuestion,
	updateQuestion,
	inviteApplication,
	validateaddToApplication,
	shortlistApplicant,
	inviteReviewer,
	reviewShortlist,
	createMessage
};
