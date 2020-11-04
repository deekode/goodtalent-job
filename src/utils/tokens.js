import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const generateToken = num =>
	new Promise((resolve, reject) => {
		crypto.randomBytes(num || 16, (err, buffer) => {
			if (err) reject(err);
			const token = buffer.toString('hex');
			resolve(token);
		});
	});

/**
 * generates a token for a user
 * @function
 * @param {object} user - user object.
 * @returns {string} token - for authenticating the user.
 */

const signUser = user => {
	return new Promise((resolve, reject) => {
		jwt.sign(
			{
				id: user.companyId || user._id,
				email: user.email,
				name: user.name
			},
			process.env.TOKEN_SECRET,
			(err, token) => {
				if (err) return reject(err);

				return resolve(token);
			}
		);
	});
};

export { generateToken, signUser };
