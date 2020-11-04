/* eslint-disable require-jsdoc */

export default function(mongoose, Schema, mongooseDelete) {
	const applicationSchema = new Schema(
		{
			jobId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'jobs'
			},
			userId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'users'
			},
			name: {
				type: String
			},
			email: {
				type: String
			},
			token: {
				type: String
			},
			companyId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'users'
			},
			resume: {
				type: String
			},
			coverletter: {
				type: String
			},
			files: {
				type: Array
			},
			notes: {
				type: Array
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

	applicationSchema.plugin(mongooseDelete, {
		deletedBy: true
	});
	applicationSchema.plugin(mongooseDelete, {
		overrideMethods: 'all'
	});

	return applicationSchema;
}
