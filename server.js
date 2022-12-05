const express = require('express');
const { setUpDatabase, getDb } = require('./db');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 3000;

let db;

setUpDatabase().then(() => {
	db = getDb();
});

app.use(express.json());
app.use('/', express.static('views'));

const k = 30; // factor of shifting of rating

function updateUserScore(user, score) {
	user.score = score;
	if (score < 300) {
		user.level = 'low';
	} else if (score >= 300 && score <600) {
		user.level = 'intermediate';
	} else if (score >= 600 && score < 900) {
		user.level = 'advanced';
	} else {
		user.level = 'elite';
	}
	return user;
}

const defaultAvatarUrls = [
	'https://www.uifaces.co/wp-content/themes/uifaces-theme/src/img/home-animation/avatar-1.svg',
	'https://www.uifaces.co/wp-content/themes/uifaces-theme/src/img/home-animation/avatar-2.svg',
	'https://www.uifaces.co/wp-content/themes/uifaces-theme/src/img/home-animation/avatar-3.svg',
	'https://www.uifaces.co/wp-content/themes/uifaces-theme/src/img/home-animation/avatar-4.svg',
	'https://www.uifaces.co/wp-content/themes/uifaces-theme/src/img/home-animation/avatar-5.svg',
	'https://www.uifaces.co/wp-content/themes/uifaces-theme/src/img/home-animation/avatar-6.svg',
	'https://www.uifaces.co/wp-content/themes/uifaces-theme/src/img/home-animation/avatar-7.svg',
	'https://www.uifaces.co/wp-content/themes/uifaces-theme/src/img/home-animation/avatar-8.svg',
	'https://www.uifaces.co/wp-content/themes/uifaces-theme/src/img/home-animation/avatar-9.svg',
];

const defaultAddress = [
	'131 Commonwealth Ave',
	'161 Commonwealth Ave',
	'30 Eastman Ln',
	'667 N Pleasant St',
	'686 N Pleasant St'
];

// user signup
app.post('/signup', async (req, res) => {
	const { email, name, password } = req.body;

	const matchedUser = await db.collection('users').findOne({ email });
	if (matchedUser) {
		return res.json({ message: 'Email has been registered.' })
	}

	const randomIndex = Math.floor(Math.random() * defaultAvatarUrls.length);

	const result = await db.collection('users').insertOne({
		email,
		name,
		password,
		avatar: defaultAvatarUrls[randomIndex],
		level: '',
		score: 0,
		createAt: new Date()
	});

	res.json(result);
});

// user signin
app.post('/signin', async (req, res) => {
	const { email, password } = req.body;

	const matchedUser = await db.collection('users').findOne({ email });
	if (!matchedUser || matchedUser.password !== password) {
		return res.json({ message: 'Invalid email or password.' })
	}

	res.json(matchedUser);
});

// update user level
app.put('/:email', async (req, res) => {
	const { email } = req.params;
	const { level } = req.body;

	const matchedUser = await db.collection('users').findOne({ email });
	if (!matchedUser) {
		return res.json({ message: 'Email does not exist.' })
	}
	let score = 0;
	if (level === 'low') {
		score = 150;
	} else if (level === 'intermediate') {
		score = 450;
	} else if (level === 'advanced') {
		score = 750;
	} else if (level === 'elite') {
		score = 900;
	}
	const result = await db.collection('users').updateOne(
		{ _id: matchedUser._id },
		{ $set: { level, score } },
		{ upsert: true }
	);

	res.json(result);
});

// get user
app.get('/user/:id', async (req, res) => {
	const id = req.params.id;
	const result = await db.collection('users').findOne({ _id: ObjectId(id) });
	res.json(result);
});

// start matching
app.post('/matching', async (req, res) => {
	const { email } = req.body;

	const matchedUser = await db.collection('users').findOne({ email });
	if (!matchedUser) {
		return res.json({ message: 'Email does not exist.' })
	}

	const level = matchedUser.level;

	const matchedOpponents = await db.collection('users').find({ level, email: {$ne : email} });
	const randomOpponentsIndex = Math.floor(Math.random() * matchedOpponents.length);
	const matchedOpponent = matchedOpponents[randomOpponentsIndex];

	const randomIndex = Math.floor(Math.random() * defaultAddress.length);
	const today = new Date()
	const tomorrow = new Date(today)
	tomorrow.setDate(tomorrow.getDate() + 1);

	const result = await db.collection('games').insertOne({
		user: matchedUser,
		opponent: matchedOpponent,
		address: defaultAddress[randomIndex],
		userScore: 0,
		opponentScore: 0,
		status: 'preparing',
		gameTime: tomorrow,
		createAt: new Date(),
	});
	const game = await db.collection('games').findOne({ _id: ObjectId(result.insertedId) });
	res.json(game);
});

// get matching by user email
app.get('/matching', async (req, res) => {
	const { email } = req.query;

	const matchedGame = await db.collection('games').findOne({ status: {$ne : 'over'}, $or: [ {'user.email': email}, {'opponent.email': email} ] });
	res.json(matchedGame);
});

// input score(input score)
app.post('/updateScore', async (req, res) => {
	const { gameId, email, myScore, opponentScore, userId } = req.body;
	const matchedGame = await db.collection('games').findOne({ _id: ObjectId(gameId) });
	if (matchedGame) {
		if (matchedGame.status === 'preparing') {
			if (email === matchedGame.user.email) {
				matchedGame.userScore = myScore;
				matchedGame.opponentScore = opponentScore;
			} else {
				matchedGame.userScore = opponentScore;
				matchedGame.opponentScore = myScore;
			}
			await db.collection('games').updateOne(
				{ _id: matchedGame._id },
				{ $set: { userScore: matchedGame.userScore, opponentScore: matchedGame.opponentScore, firstInputId: userId ,status: 'inputting' } },
				{ upsert: true }
			);
			res.json(matchedGame);
		} else if (matchedGame.status === 'inputting') {
			if (userId === matchedGame.firstInputId) {
				if (email === matchedGame.user.email) {
					matchedGame.userScore = myScore;
					matchedGame.opponentScore = opponentScore;
				} else {
					matchedGame.userScore = opponentScore;
					matchedGame.opponentScore = myScore;
				}
				await db.collection('games').updateOne(
					{ _id: matchedGame._id },
					{ $set: { userScore: matchedGame.userScore, opponentScore: matchedGame.opponentScore } },
					{ upsert: true }
				);
				res.json(matchedGame);
			} else {
				if (
					(email === matchedGame.user.email && myScore === matchedGame.userScore && opponentScore === matchedGame.opponentScore) ||
					(email === matchedGame.opponent.email && myScore === matchedGame.opponentScore && opponentScore === matchedGame.userScore)
				) {
					await db.collection('games').updateOne(
						{ _id: matchedGame._id },
						{ $set: { status: 'over' } },
						{ upsert: true }
					);
					// update user score, ELO RATING ALGORITHM
					let winUser;
					let loseUser;
					if (matchedGame.userScore > matchedGame.opponentScore) {
						winUser = matchedGame.user;
						loseUser = matchedGame.opponent;
					} else {
						winUser = matchedGame.opponent;
						loseUser = matchedGame.user;
					}

					let r1 = winUser.score;
					let r2 = loseUser.score;
					const P1 = r1 / (r1+r2);
					const P2 = r2 / (r1+r2);

					r1 = r1 + k * (1 - P1);
					r2 = r2 + k * (0 - P2);

					winUser = updateUserScore(winUser, r1);
					loseUser = updateUserScore(loseUser, r2);

					await db.collection('users').updateOne(
						{ _id: winUser._id },
						{ $set: { score: winUser.score, level: winUser.level } },
						{ upsert: true }
					);

					await db.collection('users').updateOne(
						{ _id: loseUser._id },
						{ $set: { score: loseUser.score, level: loseUser.level } },
						{ upsert: true }
					);
					res.json(matchedGame);
				} else {
					return res.json({ message: 'The score you entered does not match the opponent\'s' });
				}
			}
		}
	} else {
		return res.json({ message: 'Game does not exist.' })
	}
})

// Ranking list
app.get('/ranking', async (req, res) => {
	const users = await db.collection('users').find({}).sort({score: -1}).toArray();
	res.json(users);
});

// game history list
app.get('/gameHistory', async (req, res) => {
	const { userId } = req.query;
	const games = await db.collection('games').find({ $or: [ {"user._id": ObjectId(userId)}, {"opponent._id": ObjectId(userId)} ] }).toArray();
	res.json(games);
});


app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
});
