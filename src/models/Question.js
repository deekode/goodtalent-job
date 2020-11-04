/* eslint-disable require-jsdoc */

export default function(mongoose, Schema) {
	const questionSchema = new Schema(
		{
			jobId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'jobs'
			},
			userId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'users'
			},
			questions: {
				type: Array
			}
		},
		{
			timestamps: true
		}
	);

	return questionSchema;
}
