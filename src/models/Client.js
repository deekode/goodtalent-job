/* eslint-disable require-jsdoc */

export default function(mongoose, Schema, mongooseDelete) {
	const clientSchema = new Schema(
		{
			userId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'users'
			},
			companyId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'users'
			}
		},
		{
			timestamps: true
		}
	);

	clientSchema.plugin(mongooseDelete, {
		deletedBy: true
	});
	clientSchema.plugin(mongooseDelete, {
		overrideMethods: 'all'
	});

	return clientSchema;
}
