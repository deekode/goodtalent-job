import pug from 'pug';
import juice from 'juice';

/**
 * @summary send email handler
 * @param {*} filename the options that needs to be set before you can send an email
 * @param {*} options the options that needs to be set before you can send an email
 * @returns {*} request the result of a post to the mailjet api to send emails
 */

function formatEmail(filename, options) {
	const html = pug.renderFile(
		`${__dirname}/../mail-templates/${filename}.pug`,
		options
	);
	const inlineCss = juice(html);

	return inlineCss;
}

export { formatEmail };
