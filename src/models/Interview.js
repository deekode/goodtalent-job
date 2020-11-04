/* eslint-disable require-jsdoc */

export default function(mongoose, Schema, mongooseDelete) {
	const interviewSample = new Schema(
		{
			jobId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'jobs'
			},
			userId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'users'
			},
			companyId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'users'
			},
			dates: {
				type: Array
			},
			maxNumber: {
				type: Number
			},
			type: { type: String }
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
