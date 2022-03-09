const dummyCollection = require('./dummyCollection');

const checkId = '6223ded767acb62638b647e1';
const checkName = 'Git Out Expeditions';

for (let i = 0; i < dummyCollection.length; i++) {
	if (
		dummyCollection[i].name === checkName ||
		dummyCollection[i]._id === checkId
	) {
		let match = dummyCollection[i];
		console.log(
			'Found existing: ',
			dummyCollection[i]._id,
			dummyCollection[i].name,
		);
	}
}

console.log(typeof dummyCollection);
console.log(Object.keys(dummyCollection));
console.log(Object.keys(dummyCollection[0]));

// console.log(dc);

// dummyCollection.map((doc, i) => {
// 	console.log(doc, i);
// });

// console.log(typeof dc);
