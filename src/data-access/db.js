/* eslint-disable babel/new-cap */
/* eslint-disable require-jsdoc */
export default function Db(mongoose) {
	const findUser = async obj => {
		const data = await mongoose.connection.db
			.collection(obj.collection)
			.findOne(
				{ _id: mongoose.Types.ObjectId(obj.id) },
				{ projection: obj.select }
			);
		return data;
	};

	const createToken = async obj => {
		mongoose.connection.db
			.collection('tokens')
			.createIndex({ createdAt: 1 }, { expireAfterSeconds: 86400 });

		const data = await mongoose.connection.db
			.collection('tokens')
			.insertOne(obj);
		return data;
	};

	const findToken = async token => {
		const data = await mongoose.connection.db
			.collection('tokens')
			.findOne({ token: token });
		return data;
	};

	const findDepartment = async obj => {
		const data = await mongoose.connection.db
			.collection('departments')
			.findOne(
				{ _id: mongoose.Types.ObjectId(obj.id) },
				{ projection: obj.select }
			);
		return data;
	};

	return {
		findUser,
		createToken,
		findToken,
		findDepartment
	};
}
