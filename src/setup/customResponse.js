module.exports = function setupCustomResponses(req, res, next) {
	res.is = {
		/**
		 * Server response - status code 200
		 * @function
		 * @param {object} data - This takes in a data object of response messages
		 * @returns {fn} response - This sends response with a status code of 200
		 */
		ok: data => {
			sendResponse(200, { status: true, ...data }, res);
		},
		updated: data => {
			sendResponse(204, { status: true, ...data }, res);
		},
		/**
		 * Server response - status code 201
		 * @function
		 * @param {object} data - This takes in a data object of response messages
		 * @returns {fn} response - This sends response with a status code of 201
		 */
		created: data => {
			sendResponse(201, { status: true, ...data }, res);
		},

		pdf: pdfDoc => {
			const pdfChunks = [];
			pdfDoc.on('data', chunk => {
				pdfChunks.push(chunk);
			});

			pdfDoc.on('end', () => {
				const pdfBytes = Buffer.concat(pdfChunks);
				res.setHeader('Content-Type', 'application/pdf');
				res.send(pdfBytes);
			});

			pdfDoc.end();
		},
		/**
		 * Server response - responses for bad requests.
		 * @function
		 * @param {object} data - This takes in a data object of response messages.
		 *  @param {object} code - This takes in a status code of response messages.
		 * @returns {fn} response - This sends response with a status code of a bad request.
		 */
		badRequest: (data, code = 400) => {
			let responseCode = code;
			if (code < 400 || code >= 500) {
				responseCode = 400;
			}
			sendResponse(responseCode, { ...data, status: false }, res);
		},

		serverError: message => {
			sendResponse(500, { status: true, ...message }, res);
		}
	};

	next();
};

/**
 * Server response - responses for bad requests.
 *  @function
 *  @param {object} code - This takes in a data object of response messages.
 *  @param {object} data - This takes in a status code of response messages.
 *  @param {object} res -  This is the response object.
 *  @returns {fn} response - This sends response with a status code of a bad request.
 */
function sendResponse(code, data, res) {
	return res.status(code).json(data);
}
