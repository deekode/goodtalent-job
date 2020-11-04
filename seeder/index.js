/* eslint-disable no-console */
/* eslint-disable require-jsdoc */
import fs from 'fs';
import mongoose from 'mongoose';
import { userModel, skillModel, talentRolesModel } from '../src/modules/user/models/index';
import { priceModel } from '../src/modules/test/models/index';
import { planModel } from '../src/modules/subscription/models/index';


require('dotenv').config();

mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises

// clean all the deprecation warnings
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

function readData(file) {
	return JSON.parse(fs.readFileSync(`${__dirname}/data/${file}.json`, 'utf-8'));
}

function createUsers() {
	const users = readData('users');

	return userModel.insertMany(users);
}


function createSkills() {
	const skills = readData('skills');

	return skillModel.insertMany(skills);
}


function createRoles() {
	const techs = readData('talent_roles');

	return talentRolesModel.insertMany(techs);
}


function createPlans() {
	const plans = readData('plans');

	return planModel.insertMany(plans);
}

function createPrices() {
	const plans = readData('price');

	return priceModel.insertMany(plans);
}
async function seed() {
	try {
		await deleteData();
		await createUsers();
		await createPlans();
		await createPrices();
		await createSkills();
		await createRoles()
		console.info('👍👍👍👍👍👍👍👍 Done!');
		process.exit();
	} catch (e) {
		console.error('👎👎👎👎👎👎👎👎 Error! The Error info is below but if you are importing sample data make sure to drop the existing database first with.');
		console.error(e);
		process.exit();
	}
}

async function deleteData() {
	await userModel.deleteMany({});
	await priceModel.deleteMany({});
	await planModel.deleteMany({});
	await skillModel.deleteMany({});
	await talentRolesModel.deleteMany({});
	if (process.argv.includes('--delete')) {
		console.info('😢😢 Goodbye Data...');
		console.info('Data Deleted. To load sample data,\n run>>>>\t  npm run seed');
	} else {
		console.info('Previous Data Deleted. Seeding new data...');
	}
}

if (process.argv.includes('--delete')) {
	deleteData();
	process.exit();
} else {
	seed();
}
