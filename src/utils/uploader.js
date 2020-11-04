/* eslint-disable no-await-in-loop */
/* eslint-disable prettier/prettier */
/* eslint-disable babel/camelcase */
/* eslint-disable prefer-template */
/* eslint-disable require-jsdoc */
import path from 'path';
import multer from 'multer';
import cloudinary from 'cloudinary';
require('dotenv').config();
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.diskStorage({
	filename: function(req, file, cb) {
		cb(null, new Date().toISOString() + '-' + file.originalname);
	}
});

//init upload from multer

const upload = multer({
	storage: storage,
	fileFilter: function(req, file, cb) {
		checkFileType(file, cb);
	}
}).array('files');

function checkFileType(file, cb) {
	// Allowed ext
	const filetypes = /jpeg|jpg|png|gif|pdf|doc|word|docs|docx/;
	// Check ext
	const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
	// Check mime
	const mimetype = filetypes.test(file.mimetype);

	if (mimetype && extname) {
		return cb(null, true);
	} else {
		cb(new Error('Use a valid File type'));
	}
}

async function cloudUpload(files, publicPath,type) {
	const array = [];
	for (const file of files) {
		await cloudinary.v2.uploader.upload(file.path, { public_id: publicPath, resource_type : type }, (error, result) => {
			if (error) {
			console.log(error)
				throw error;
			}
			array.push(result.secure_url);
		});
	}
	return array;
}

function uploader(req, res, publicPath,type) {
	return new Promise((resolve, reject) => {
		upload(req, res, err => {
			if (err) {
				reject(err);
			}
			resolve(cloudUpload(req.files, publicPath,type));
		});
	});
}

export default uploader;
