/* eslint-disable max-lines-per-function */
/* eslint-disable require-jsdoc */

export default function(mongoose, Schema, mongooseDelete) {
	const jobSchema = new Schema(
		{
			title: {
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
			description: {
				type: String
			},
			skills: {
				type: Array
			},
			experience: {
				type: String
			},
			test: {
				testId: {
					type: Number
				},
				duration: {
					type: Number
				}
			},
			pay: {
				min: {
					type: Number
				},
				max: {
					type: Number
				},
				period: {
					type: String,
					enum: ['hour', 'week', 'month', 'annum']
				},
				currency: {
					type: String
				},
				negotiable: {
					type: Boolean
				}
			},
			location: {
				country: {
					type: String
				},
				state: {
					type: String
				},
				city: {
					type: String
				}
			},
			visibility: {
				type: Boolean
			},
			status: {
				type: String
			},
			availability: {
				type: String
			},
			jobRole: {
				type: String
			},
			departmentId: {
				type: mongoose.Schema.Types.ObjectId
			}
		},
		{
			timestamps: true
		}
	);

	jobSchema.plugin(mongooseDelete, {
		deletedBy: true
	});
	jobSchema.plugin(mongooseDelete, {
		overrideMethods: 'all'
	});
	jobSchema.statics = {
		searchPartial: function(q, query, options) {
			return this.aggregate([
				{
					$match: {
						$or: [
							{ title: new RegExp(q, 'gi') },
							{ description: new RegExp(q, 'gi') },
							{ skills: new RegExp(q, 'gi') }
						],
						...query
					}
				},
				{ $sort: options.sort },
				{
					$group: {
						_id: null,
						// get a count of every result that matches until now
						totalCount: { $sum: 1 },
						// keep our results for the next operation
						results: { $push: '$$ROOT' }
					}
				},
				{
					$project: {
						totalCount: 1,
						rows: {
							$slice: [
								'$results',
								options.skip || 0,
								options.limit || '$totalCount'
							]
						}
					}
				}
			]);
		},
		searchFull: function(q, query, options) {
			return this.aggregate([
				{
					$match: {
						$text: { $search: q, $caseSensitive: false },
						...query
					}
				},
				{ $sort: options.sort },
				{
					$group: {
						_id: null,
						// get a count of every result that matches until now
						totalCount: { $sum: 1 },
						// keep our results for the next operation
						results: { $push: '$$ROOT' }
					}
				},
				{
					$project: {
						totalCount: 1,
						rows: {
							$slice: [
								'$results',
								options.skip || 0,
								options.limit || '$totalCount'
							]
						}
					}
				}
			]);
		},

		search: async function(q, query, options) {
			let data = await this.searchFull(q, query, options);

			if (data.length > 0)
				return {
					totalCount: data[0] ? data[0].totalCount : 0,
					rows: data[0] ? data[0].rows : []
				};

			data = await this.searchPartial(q, query, options);
			return {
				totalCount: data[0] ? data[0].totalCount : 0,
				rows: data[0] ? data[0].rows : []
			};
		}
	};

	return jobSchema;
}
