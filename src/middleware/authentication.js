/* eslint-disable require-jsdoc */
import fetch from 'node-fetch';
import { userService } from '../grpc/client/user';
import { userTypes } from '../utils/constansts';
const userClient = userService();

// Authentication middleware

const auth = async req => {
	const authHeader = req.get('Authorization');
	if (!authHeader) {
		req.isAuth = false;
		return;
	}

	const token = authHeader.split(' ')[1] || authHeader;
	if (!token || token === '') {
		req.isAuth = false;
		return;
	}
	try {
		// const response = await userClient.decodeUserToken({
		// 	payload: JSON.stringify({ token })
		// });

		const response = await fetch(
			`${process.env.DECODE_TOKEN_URL}?token=${token}&route=1`,
			{
				headers: {
					'User-Agent': 'notification'
				}
			}
		).then(res => res.json());

		const user =
			// {
			// 	disabled: false,
			// 	image:
			// 		'https://res.cloudinary.com/goodtalent/image/upload/v1588361098/profile_images/user_izcn37.jpg',
			// 	skills: [],
			// 	links: [],
			// 	talentStatus: ['Open to gigs'],
			// 	isVerified: true,
			// 	deleted: false,
			// 	_id: '5f95dea16058e3001d14a949',
			// 	email: 'talent@mailinator.com',
			// 	password: null,
			// 	name: 'talent',
			// 	role: 'talent',
			// 	createdAt: '2020-10-25T20:22:57.629Z',
			// 	updatedAt: '2020-10-25T20:23:37.116Z',
			// 	__v: 0
			// };

			{
				disabled: false,
				image:
					'https://res.cloudinary.com/goodtalent/image/upload/v1588361098/profile_images/user_izcn37.jpg',
				skills: [],
				links: [],
				talentStatus: [],
				isVerified: true,
				deleted: false,
				_id: '5f95a7cc6058e3001d14a902',
				email: 'company@mailinator.com',
				password: null,
				name: 'company',
				companyName: 'company',
				role: 'company',
				createdAt: '2020-10-25T16:29:00.241Z',
				updatedAt: '2020-10-25T16:30:23.052Z',
				__v: 0,
				customRole: '5f95a7cc6058e3001d14a903',
				plan: '5f95a81e6058e3001d14a90d'
			};

			// response.data.user;

		if (!user) {
			req.isAuth = false;
			return;
		}
		req.isAuth = true;
		req.user = user;

		// return;
	} catch (error) {
		console.log(error);
		req.isAuth = false;
	}
};

const userAuth = async (req, res, next) => {
	await auth(req, res, next);
	if (req.isAuth) return next();
	return res.is.badRequest(
		{
			error: 'You are not authorized to access this resource'
		},
		401
	);
};

const talentAuth = async (req, res, next) => {
	await auth(req, res, next);
	if (req.isAuth && req.user.role === userTypes.talent) return next();

	return res.is.badRequest(
		{
			error: `You are not a ${userTypes.talent}. You cannot access this route!`
		},
		401
	);
};

const superAdminAuth = async (req, res, next) => {
	await auth(req, res, next);

	if (req.isAuth && req.user.role === userTypes.superadmin) return next();

	return res.is.badRequest(
		{
			error: `You are not a ${userTypes.superadmin}. You cannot access this route!`
		},
		401
	);
};

const companyAuth = async (req, res, next) => {
	await auth(req, res, next);
	if (req.isAuth && req.user.role === userTypes.company) return next();

	return res.is.badRequest(
		{
			error: `You are not a ${userTypes.company}. You cannot access this route!`
		},
		401
	);
};

const agencyAuth = async (req, res, next) => {
	await auth(req, res, next);
	if (req.isAuth && req.user.role === userTypes.agency) return next();

	return res.is.badRequest(
		{
			error: `You are not a ${userTypes.agency}. You cannot access this route!`
		},
		401
	);
};

export { talentAuth, userAuth, companyAuth, agencyAuth, superAdminAuth };
