/* eslint-disable require-jsdoc */

export default function(mongoose, Schema, mongooseDelete) {
	const messageSample = new Schema(
		{
			title: {
				type: String
			},
			subject: {
				type: String
			},
			description: {
				type: String
			},
			footer: {
				type: String
			},
			userId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'users'
			}
		},
		{
			timestamps: true
		}
	);

	messageSample.plugin(mongooseDelete, {
		deletedBy: true
	});
	messageSample.plugin(mongooseDelete, {
		overrideMethods: 'all'
	});

	return messageSample;
}
