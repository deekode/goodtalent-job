import startServer from './src/app';
require('dotenv').config();

const isProduction =
    process.env.NODE_ENV === 'production' ||
    process.env.NODE_ENV === 'staging' ||
    process.env.NODE_ENV === 'development';

startServer({
    port: isProduction ? process.env.PORT : undefined
});
