import { validate, Joi } from '../utils/validator';

/**
 * validate input parameters
 *
 * @param {object} userDetails - The properties of the object must match the properties on the schema
 * @returns {fn} fn - It validates input and throws error if any as response
 */

const validateJob = input => {
	const interview = Joi.object().keys({
		dates: Joi.array()
			.label('Date')
			.default([]),
		type: Joi.string().label('Type'),
		maxNumber: Joi.number().label('Max Number of Candidates')
	});

	const schema = Joi.object().keys({
		title: Joi.string()
			.label('Title')
			.required(),
		description: Joi.string()
			.label('Description')
			.min(10)
			.required(),
		departmentId: Joi.objectId().label('departmentId'),
		experience: Joi.string()
			.label('Experience')
			.required(),
		availability: Joi.string()
			.required()
			.label('Availabilty'),
		jobRole: Joi.string().label('Job Role'),
		visibility: Joi.boolean()
			.label('Visibility')
			.required(),
		test: Joi.object().keys({
			testId: Joi.number().label('testId'),
			duration: Joi.number().label('Duration')
		}),
		pay: Joi.object()
			.keys({
				min: Joi.number().label('Min Amount'),
				max: Joi.number().label('Max Amount'),
				currency: Joi.string().default('NGN'),
				negotiable: Joi.boolean(),
				period: Joi.string().valid('hour', 'week', 'month', 'annum')
			})
			.required(),
		location: Joi.object()
			.keys({
				country: Joi.string().label('Country'),
				state: Joi.string().label('State'),
				city: Joi.string().label('City')
			})
			.required(),
		companyId: Joi.objectId().label('companyId'),
		skills: Joi.array()
			.label('Skills')
			.required(),
		interviews: Joi.array()
			.items(interview)
			.default([])
	});

	return validate(input, schema);
};

const validateApplication = input => {
	const schema = Joi.object().keys({
		resume: Joi.string().label('Resume'),
		coverletter: Joi.string().label('Cover Letter'),
		jobId: Joi.objectId().required(),
		questionScore: Joi.number()
			.min(0)
			.max(1),
		token: Joi.string(),
		status: Joi.boolean()
	});

	return validate(input, schema);
};

const validateApplicationStatus = input => {
	const id = Joi.objectId();

	const offerObj = Joi.object().keys({
		resumptionDate: Joi.string()
			.label('Resumption Date')
			.required(),
		currency: Joi.string()
			.label('Currency')
			.required(),
		salary: Joi.number()
			.label('Salary')
			.required(),
		period: Joi.string()
			.label('Period')
			.required()
			.valid('hour', 'week', 'month', 'annum')
	});
	const schema = Joi.object().keys({
		stage: Joi.string()
			.label('Stage')
			.required(),
		type: Joi.string().label('Type'),
		status: Joi.string()
			.label('Status')
			.required(),
		applicationIds: Joi.array()
			.label('applicant Ids')
			.items(id)
			.required(),
		offer: offerObj,
		offerId: id,
		jobId: id,
		bookingId: id,
		interviewId: id
	});

	return validate(input, schema);
};

const inviteApplication = input => {
	const candidate = Joi.object().keys({
		name: Joi.string().label('Name'),
		email: Joi.string()
			.label('Email')
			.email()
	});

	const schema = Joi.object().keys({
		candidates: Joi.array()
			.items(candidate)
			.required(),
		jobId: Joi.objectId().required()
	});

	return validate(input, schema);
};

const validateQuestion = input => {
	const option = Joi.object().keys({
		text: Joi.string()
			.label('Text')
			.required(),
		answer: Joi.boolean()
			.label('Answer')
			.required()
	});
	const questions = Joi.object().keys({
		question: Joi.string()
			.label('Question')
			.required(),
		options: Joi.array()
			.label('Options')
			.items(option)
			.required()
	});
	const schema = Joi.object().keys({
		jobId: Joi.objectId(),
		questions: Joi.array()
			.label('questions')
			.items(questions)
			.required()
	});

	return validate(input, schema);
};

const validateInterview = input => {
	const schema = Joi.object().keys({
		dates: Joi.array()
			.label('Date')
			.default([]),
		time: Joi.string(),
		type: Joi.string().label('Type'),
		maxNumber: Joi.number().label('Max Number of Candidates')
	});

	return validate(input, schema);
};

const validateaddToApplication = input => {
	const note = Joi.object().keys({
		note: Joi.string()
			.label('Text')
			.required(),
		userId: Joi.objectId().required()
	});
	const schema = Joi.object().keys({
		notes: Joi.array()
			.items(note)
			.default([]),
		files: Joi.array()
			.label('Files')
			.default([]),
		applicationId: Joi.objectId().required()
	});

	return validate(input, schema);
};

const shortlist = input => {
	const schema = Joi.object().keys({
		shortlisted: Joi.boolean()
			.required()
			.label('shortlisted status'),
		applicationId: Joi.objectId().required()
	});

	return validate(input, schema);
};

const inviteReviewer = input => {
	const view = Joi.string().valid(
		'name',
		'email',
		'files',
		'resume',
		'notes',
		'skills'
	);

	const schema = Joi.object().keys({
		name: Joi.string()
			.required()
			.label('Name'),
		jobId: Joi.objectId().required(),
		email: Joi.string()
			.label('Email')
			.email()
			.required(),
		views: Joi.array()
			.label('Views')
			.items(view)
	});

	return validate(input, schema);
};

const reviewShortlist = input => {
	const schema = Joi.object().keys({
		status: Joi.string()
			.required()
			.label('Status')
			.valid('approved', 'rejected'),
		applicationId: Joi.objectId().required(),
		token: Joi.string()
			.label('Token')
			.required()
	});

	return validate(input, schema);
};

const validateMessage = input => {
	const schema = Joi.object().keys({
		title: Joi.string()
			.label('Title')
			.required(),

		subject: Joi.string()
			.label('Subject')
			.min(10)
			.max(100)
			.required(),

		description: Joi.string()
			.label('Description')
			.min(10)
			.max(3000)
			.required(),

		footer: Joi.string()
			.label('Footer')
			.min(10)
			.max(100)
			.required()
	});

	return validate(input, schema);
};

export {
	validateJob,
	validateApplication,
	validateApplicationStatus,
	validateQuestion,
	validateMessage,
	inviteApplication,
	validateInterview,
	shortlist,
	reviewShortlist,
	validateaddToApplication,
	inviteReviewer
};
