// updating documents in mongo REPL
// total basics - use correct db:
// use nucampsite
// display all docs in collection:
db.users.find().pretty();

// updateOne() and update():
// https://docs.mongodb.com/v4.2/tutorial/update-documents/

// make user admin:
db.users.updateOne({ username: 'dude' }, { $set: { admin: true } });

// give first and last names:
db.users.updateOne(
	{ username: 'dude' },
	{
		$set: {
			firstname: 'dude',
			lastname: 'bro',
		},
	},
);
