/* eslint-disable require-jsdoc */

export default function(mongoose, Schema, mongooseDelete) {
	const stageSchema = new Schema(
		{
			applicationId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'applications'
			},
			jobId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'jobs'
			},
			knockoutScore: { type: Number },
			stage: { type: String },
			interviewId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'interviews'
			},
			bookingId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'bookings'
			},
			offer: {},
			status: {
				type: String
			},
			type: {
				type: String
			},
			current: {
				type: Boolean,
				default: false
			}
		},
		{
			timestamps: true
		}
	);

	stageSchema.plugin(mongooseDelete, {
		deletedBy: true
	});
	stageSchema.plugin(mongooseDelete, {
		overrideMethods: 'all'
	});

	return stageSchema;
}
