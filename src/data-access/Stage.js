/* eslint-disable require-jsdoc */

export default function stageDb(Stage) {
	const fetchStageById = stageId => Stage.findById(stageId);

	const createStage = stageDetails => Stage.create(stageDetails);

	const fetchStage = (query, options = {}) =>
		Stage.findOne(query, {}, options);

	const createOrUpdateStage = (query, stageDetails, options = {}) =>
		Stage.findOneAndUpdate(query, stageDetails, options);

	const fetchStages = (query, options = {}, join = '') =>
		Stage.find(query, {}, options).populate(join);

	return {
		createStage,
		fetchStageById,
		fetchStage,
		fetchStages,
		createOrUpdateStage
	};
}
