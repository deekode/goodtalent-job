import requestIp from 'request-ip';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as rpc from '../grpc/server'

const loadModules = async app => {
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(cors());
	app.use(morgan('dev'));
	app.use(requestIp.mw());
	rpc.startRpcServer();
};

export default loadModules;
