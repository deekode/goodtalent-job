/* eslint-disable consistent-return */
/* eslint-disable max-len */
import JoiBase from 'joi';
import JoiObjectId from 'joi-mongodb-objectid';
import _ from 'lodash';

const Joi = JoiBase.extend(JoiObjectId);

/**
 * @summary a format function to format the error output in the validator
 * @param {*} message a message to format
 * @returns {string} formatted response
 */
function format(message) {
	return message.replace('"', '').replace('"', '');
}

/**
 * Format Errors
 * @param {object} result error from Joi validate
 * @returns {object} formated Errors
 */
const formatErrors = result => {
	if (result) {
		const array = result.details.map(error => ({
			[error.context.label]: format(error.message)
		}));
		const errors = _.fromPairs(
			array.map(error => [Object.keys(error), error[Object.keys(error)]])
		);
		return {
			errors,
			type: 'ValidationError'
		};
	}
};

/**
 * Validate schema with input
 * @param {object} inputDetails - This is the input details for validation
 * @param {object} schema - This is the joi-schema
 * @returns {Promise} promise - If err, it formats error and rejects it, else it resolves the inputDetails
 */
const validate = (inputDetails, schema) =>
	new Promise((resolve, reject) => {
		Joi.validate(
			inputDetails,
			schema,
			{
				abortEarly: false
			},
			(err, value) => {
				const errors = formatErrors(err);
				if (err) return reject(errors);
				return resolve(value);
			}
		);
	});

export { validate, Joi };
