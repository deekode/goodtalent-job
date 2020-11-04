const fs = require('fs');
const logger = require('../utils/logger');

const createFolder = () => {
    if (!fs.existsSync('./public/')) {
        fs.mkdir('./public/', err => {
            if (err) {
                return logger.info('failed to write directory', err);
            }
            return null;
        });
    }
};

module.exports = createFolder;
