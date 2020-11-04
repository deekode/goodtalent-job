// constants used in the room api to denote the type of rooms
export const userTypes = {
	talent: 'talent',
	company: 'company',
	agency: 'agency',
	superadmin: 'superadmin',
	agencycompany: 'agencycompany',
	staff: 'staff'
};

export const jobStatus = {
	open: 'open', //This means the job has just been created
	close: 'close'
};

export const applicationTerms = {
	stage: {
		test: 'test',
		interview: 'interview',
		initial: 'initial',
		shortlist: 'shortlist',
		offer: 'offer',
		final: 'final'
	},
	status: {
		pending: 'pending', //This means the application is pending
		accepted: 'accepted',
		knockout: 'knockedout',
		current: 'current',
		rejected: 'rejected',
		hired: 'hired',
		offered: 'offered'
	}
};
