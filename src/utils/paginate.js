/* eslint-disable no-labels */
export default async (
	findService,
	countService,
	query,
	{ pageNo, size },
	populate
) => {
	pageNo = parseInt(pageNo, 10);
	size = parseInt(size, 10);

	if (pageNo < 0 || pageNo === 0) {
		return {
			invalidPageNo: true
		};
	}

	const page = {};

	page.skip = size * (pageNo - 1);
	page.limit = size;
	page.sort = {
		createdAt: -1
	};
	let totalCount;
	let docs = await findService(query, page, populate);
	if (!query.text) {
		totalCount = await countService(query);

		docs = await findService(query, page, populate)
			.lean()
			.populate(populate);
	}

	const pagecount = docs.totalCount || totalCount;

	const pageCount = Math.ceil(pagecount / page.limit);

	return {
		data: {
			docs: docs.rows || docs,
			totalCount: docs.totalCount || totalCount,
			pageCount
		}
	};
};
