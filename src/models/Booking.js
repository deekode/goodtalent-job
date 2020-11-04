/* eslint-disable require-jsdoc */

export default function(mongoose, Schema, mongooseDelete) {
	const interviewSample = new Schema(
		{
			interviewId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'interviews'
			},
			applicationId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'applications'
			},
			date: {
				type: String
			},
			userId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'users'
			},
			companyId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'users'
			},
			jobId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'jobs'
			},
			stageId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'application_stages'
			}
		},
		{
			timestamps: true
		}
	);

	interviewSample.plugin(mongooseDelete, {
		deletedBy: true
	});
	interviewSample.plugin(mongooseDelete, {
		overrideMethods: 'all'
	});

	return interviewSample;
}
