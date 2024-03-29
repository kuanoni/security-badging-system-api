const faker = require('@faker-js/faker').faker;
const fs = require('fs');

const profileTypes = [
	{
		type: 'Employee',
		amt: 300,
	},

	{
		type: 'Contractor',
		amt: 180,
	},
	{
		type: 'Privileged Visitor',
		amt: 20,
	},
];

const badgeTypes = profileTypes.map((cholder) => cholder.type);

const makeUnownedCredentials = () => {
	const multi = 1.25;
	const credentials = {};
	badgeTypes.forEach((type) => (credentials[type] = []));

	/*  credentials looks like this:
    credentials = {
        'Employee': [],
        'Contractor': [],
        'Privileged Visitor': [],
    } */

	const takenIds = []; // ids kept track of to prevent duplicates

	profileTypes.forEach((profile) => {
		for (let i = 0; i < profile.amt * multi; i++) {
			const activationDate = faker.date.past(1);
			const expirationDate = faker.date.between(
				activationDate,
				new Date().setFullYear(new Date().getFullYear() + 5)
			);
			const status = new Date(expirationDate) > Date.now();

			let _id = faker.datatype.number({ min: 100000, max: 999999 }).toString();

			// remake id if it's a duplicate
			while (takenIds.includes(_id)) _id = faker.datatype.number({ min: 100000, max: 999999 }).toString();

			takenIds.push(_id);

			credentials[profile.type].push({
				_id,
				badgeType: profile.type,
				badgeOwnerId: '',
				badgeOwnerName: '',
				badgeFormat: pickRandomOutOfList(['HID 2000PGG', 'HID 1326LSS', 'HID 208X']),
				activationDate,
				expirationDate,
				status,
				partition: pickRandomOutOfList(['BLR01', 'KNS01', 'KNS02', 'LA01', 'LA02', 'NYC01']),
			});
		}
	});

	return credentials;
};

const makeAccessGroups = () => {
	const groups = [
		'Global Access',
		'General Access',
		'Lab Access',
		'Lab 2 Access',
		'Fabrication Access',
		'Fabrication 2 Access',
		'Tech Access',
		'Custodian Access',
		'Cafeteria Access',
		'Bar Access',
	];

	return groups.map((group, i) => ({ _id: i.toString(), groupName: group, groupMembers: [] }));
};

const makeCardholders = () => {
	const accessGroups = makeAccessGroups();
	const credentials = makeUnownedCredentials();
	let availableCredentials = JSON.parse(JSON.stringify(credentials));
	const cardholders = [];
	const takenIds = [];

	profileTypes.forEach((profile) => {
		for (let i = 0; i < profile.amt; i++) {
			const avatar = faker.image.avatar();
			const firstName = faker.name.firstName();
			const lastName = faker.name.lastName();
			const email = `${firstName}.${lastName}@company.com`;
			const jobTitle = faker.name.jobType();
			const activationDate = faker.date.past(1);
			const expirationDate = faker.date.between(
				activationDate,
				new Date().setFullYear(new Date().getFullYear() + 5)
			);
			const profileStatus = new Date(expirationDate) > Date.now();
			const profileType = profile.type;

			let employeeId = faker.datatype.number({ min: 10000000, max: 99999999 }).toString();
			while (takenIds.includes(employeeId))
				employeeId = faker.datatype.number({ min: 10000000, max: 99999999 }).toString();

			takenIds.push(employeeId);

			const cardholderAccessGroups = [];
			const availableAccessGroups = [
				...accessGroups.map((accessGroup) => ({ _id: accessGroup._id, groupName: accessGroup.groupName })),
			];
			const cardholderCredentials = [];

			if (profileStatus) {
				// assign a couple access groups to cardholder
				for (let j = 0; j < Math.floor(Math.random() * 3 + 1); j++) {
					const idx = Math.floor(Math.random() * (availableAccessGroups.length - 1));
					const accessGroup = availableAccessGroups.splice(idx, 1)[0];
					cardholderAccessGroups.push({ _id: accessGroup._id, groupName: accessGroup.groupName });
					accessGroups[idx].groupMembers.push(employeeId);
				}

				// assign a couple credentials to cardholder
				for (let j = 0; j < Math.floor(Math.random() * 2); j++) {
					const idx = Math.floor(Math.random() * (availableCredentials[profileType].length - 1));
					const addedCred = availableCredentials[profileType][idx];
					cardholderCredentials.push({ _id: addedCred._id, status: addedCred.status });

					availableCredentials[profileType].splice(idx, 1);
					const newIdx = credentials[profileType].findIndex((cred) => cred._id === addedCred._id);

					credentials[profileType][newIdx].badgeOwnerId = employeeId;
					credentials[profileType][newIdx].badgeOwnerName = firstName + ' ' + lastName;
				}
			}

			cardholders.push({
				_id: employeeId,
				avatar,
				firstName,
				lastName,
				email,
				jobTitle,
				profileStatus,
				activationDate,
				expirationDate,
				profileType,
				credentials: cardholderCredentials,
				accessGroups: cardholderAccessGroups.sort((groupA, groupB) => groupA._id > groupB._id),
			});
		}
	});

	return {
		cardholders,
		credentials: shuffle(badgeTypes.map((badgeType) => credentials[badgeType]).flat()),
		accessGroups,
	};
};

// ========================
//      UTIL FUNCTIONS
// ========================

const pickRandomOutOfList = (list) => {
	const r = Math.floor(Math.random() * list.length);
	return list[r];
};

const getUniqueRandomNumbers = (amt, max, min = 0) => {
	const arr = [];
	while (arr.length < amt) {
		const r = Math.floor(Math.random() * max + min);
		if (!arr.includes(r)) arr.push(r);
	}

	return arr;
};

const shuffle = (array) => {
	let currentIndex = array.length,
		randomIndex;

	// While there remain elements to shuffle.
	while (currentIndex != 0) {
		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}

	return array;
};

const writeJson = (fileName, obj) => {
	fs.writeFile(`./makeFakeData/${fileName}.json`, JSON.stringify(obj), 'utf8', () => {});
};

const { cardholders, credentials, accessGroups } = makeCardholders();

writeJson('credentials', credentials);
writeJson('accessGroups', accessGroups);
writeJson('cardholders', cardholders);
