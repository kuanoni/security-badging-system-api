const faker = require('@faker-js/faker').faker;
const fs = require('fs');

const makeCredentials = (count) => {
	let creds = [];
	for (let i = 0; i < count; i++) {
		creds.push({
			_id: faker.datatype.number({ min: 10000, max: 99999 }).toString(),
			badgeType: pickRandomOutOfList(['Employee', 'Contractor', 'Privileged Visitor']),
			badgeOwnerId: '',
			badgeOwnerName: '',
		});
	}

	return creds;
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

	return groups.map((group, i) => ({ _id: i + 1, groupName: group, groupMembers: [] }));
};

const makeCardholders = (count) => {
	const accessGroups = makeAccessGroups();
	const tempCreds = makeCredentials(count * 1.5);
	const assignedCreds = [];
	const cardholders = [];

	const cardholdersIdsWithCreds = getUniqueRandomNumbers(count * 0.75, count + 1);

	for (let i = 0; i < count; i++) {
		const avatar = faker.image.avatar();
		const firstName = faker.name.firstName();
		const lastName = faker.name.lastName();
		const email = `${firstName}.${lastName}@company.com`;
		const employeeId = faker.datatype.number({ min: 10000000, max: 99999999 }).toString();
		const jobTitle = faker.name.jobType();
		const activationDate = faker.date.past(2);
		const expirationDate = faker.date.between(activationDate, new Date().setFullYear(new Date().getFullYear() + 2));
		const profileStatus = new Date(expirationDate) > Date.now();
		const profileType = pickRandomOutOfList(['Employee', 'Contractor', 'Privileged Visitor']);

		const cholderCreds = [];
		const cholderGroups = getUniqueRandomNumbers(Math.floor(Math.random() * 3 + 1), accessGroups.length).map(
			(num) => {
				accessGroups[num].groupMembers.push(employeeId);
				return { _id: num, groupName: accessGroups[num].groupName };
			}
		);

		if (cardholdersIdsWithCreds.includes(i)) {
			for (let j = 0; j < Math.floor(Math.random() * 3); j++) {
				const cred = {
					...tempCreds.shift(),
					badgeOwnerId: employeeId,
					badgeOwnerName: firstName + ' ' + lastName,
				};
				cholderCreds.push(cred);
				assignedCreds.push(cred);
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
			credentials: cholderCreds.map((cred) => ({ _id: cred._id, badgeNumber: cred.badgeNumber })),
			accessGroups: cholderGroups.sort((groupA, groupB) => groupA._id > groupB._id),
		});
	}

	const credentials = [...assignedCreds, ...tempCreds].sort((a, b) => a.id > b.id);

	return { cardholders, credentials, accessGroups };
};

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

const writeJson = (fileName, obj) => {
	fs.writeFile(`./src/makeFakeData/${fileName}.json`, JSON.stringify(obj), 'utf8', () => {});
};

const { cardholders, credentials, accessGroups } = makeCardholders(500);

writeJson('credentials', credentials);
writeJson('accessGroups', accessGroups);
writeJson('cardholders', cardholders);
