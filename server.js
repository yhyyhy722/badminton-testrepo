const express = require('express');
const { faker } = require('@faker-js/faker');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/', express.static('views'));

const users = [
	{
		email: 'jack@gmail.com',
		name: 'jack',
		password: '123456',
		level: 'low',
		score: 10,
	},
	{
		email: 'alex@gmail.com',
		name: 'alex',
		password: '123456',
		level: 'low',
		score: 23,
	},
	{
		email: 'tom@gmail.com',
		name: 'tom',
		password: '123456',
		level: 'intermediate',
		score: 68,
	},
	{
		email: 'martin@gmail.com',
		name: 'martin',
		password: '123456',
		level: 'advanced',
		score: 83,
	},
	{
		email: 'jimmy@gmail.com',
		name: 'jimmy',
		password: '123456',
		level: 'elite',
		score: 99,
	},
];

const games = [];

const gameHistories = []

const rankings = [];
for (let i = 0; i < 10; i++) {
	rankings.push({
		avatar: faker.image.avatar(),
		name: faker.name.fullName(),
		rank: i+1
	})
}

for (let i = 0; i < 10; i++) {
	gameHistories.push({
		dateTime: faker.datatype.datetime(),
		address: faker.address.streetAddress(),
		adversary: faker.name.fullName(),
		score: faker.datatype.number({ max: 11 }) + ':' + faker.datatype.number({ max: 11 }),
		isFinish: faker.datatype.boolean(),
	});
}

// user signup
app.post('/signup', (req, res) => {
	const { email, name, password } = req.body;

	const matchedUser = users.find(user => user.email === email);
	if (matchedUser) {
		return res.json({ message: 'Email has been registered.' })
	}

	const newUser = {
		email,
		name,
		password,
	}

	users.push(newUser);

	res.json(newUser);
});

// user signin
app.post('/signin', (req, res) => {
	const { email, password } = req.body;

	const matchedUser = users.find(user => user.email === email);
	if (!matchedUser || matchedUser.password !== password) {
		return res.json({ message: 'Invalid email or password.' })
	}

	res.json(matchedUser);
});

// update user level
app.put('/:email', (req, res) => {
	const { email } = req.params;
	const { level } = req.body;

	const matchedUser = users.find(user => user.email === email);
	if (!matchedUser) {
		return res.json({ message: 'Email does not exist.' })
	}
	matchedUser.level = level

	res.json(matchedUser);
});

// start matching
app.post('/matching', (req, res) => {
	const { email } = req.body;

	const matchedUser = users.find(user => user.email === email);
	if (!matchedUser) {
		return res.json({ message: 'Email does not exist.' })
	}

	const level = matchedUser.level;
	// TODO Update algorithm to match best competitor
	const matchedOpponent = users.find(user => user.level === level && user.email !== matchedUser.email);
	const newGame = {
		id: faker.database.mongodbObjectId(),
		user: matchedUser,
		opponent: matchedOpponent,
		gameTime: faker.datatype.datetime(),
		address: faker.address.streetAddress(),
		userScore: 0,
		opponentScore: 0,
		status: 'preparing',
	}
	games.push(newGame);
	res.json(newGame);
});

// input score(input score)
app.post('/updateScore', (req, res) => {
	const { gameId, email, myScore, opponentScore } = req.body;
	const matchedGame = games.find(game => game.id === gameId);
	if (matchedGame) {
		if (matchedGame.status === 'preparing') {
			if (email === matchedGame.user.email) {
				matchedGame.userScore = myScore;
				matchedGame.opponentScore = opponentScore;
			} else {
				matchedGame.userScore = opponentScore;
				matchedGame.opponentScore = myScore;
			}
			res.json(matchedGame);
		} else if (matchedGame.status === 'inputting') {
			if (
				(email === matchedGame.user.email && myScore === matchedGame.userScore && opponentScore === matchedGame.opponentScore) ||
				(email === matchedGame.opponent.email && myScore === matchedGame.opponentScore && opponentScore === matchedGame.userScore)
			) {
				matchedGame.status = 'over';
				res.json(matchedGame);
			} else {
				return res.json({ message: 'The score you entered does not match the opponent\'s' });
			}
		}
	} else {
		return res.json({ message: 'Game does not exist.' })
	}
})

// Ranking list
app.get('/ranking', (req, res) => {
	res.json(rankings);
});

// game history list
app.get('/gameHistory', (req, res) => {
	res.json(gameHistories);
});


app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
});
