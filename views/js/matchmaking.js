const myName = document.getElementById('my_name');
const opponentName = document.getElementById('opponent_name');
const myAvatar = document.getElementById('my_avatar');
const opponentAvatar = document.getElementById('opponent_avatar');
const gameDate = document.getElementById('game_date');
const gameTime = document.getElementById('game_time');
const gameAddress = document.getElementById('game_address');
const matchResult = document.getElementById('match_result');
const gameOver = document.getElementById('game_over');
const startMatch = document.getElementById('start_match');
const emptyImg = document.getElementById('empty_img');
const confirm = document.getElementById('confirm');
const cancel = document.getElementById('cancel');

let gameId;

startMatch.addEventListener('click', function() {
	fetch('/matching', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			email: user.email
		})
	}).then(res => res.json())
		.then((res) => {
			setGame(res);
		});
});

confirm.addEventListener('click', function() {
	const myScore = document.getElementById('my_score');
	const adversaryScore = document.getElementById('adversary_score');
	const scoreResult = document.getElementById('score_result');

	fetch('/updateScore', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			gameId: gameId,
			email: user.email,
			myScore: Number(myScore.value),
			opponentScore: Number(adversaryScore.value),
			userId: user._id
		})
	}).then(res => res.json())
		.then((res) => {
			if (res.message) {
				scoreResult.textContent = res.message;
				scoreResult.style.display = 'block';
			} else {
				alert('Success!');
				cancel.click();
				startMatch.style.display = 'none';
				emptyImg.style.display = 'none';
				gameOver.style.display = 'none';
				if (res.status === 'over') {
					matchResult.style.display = 'none';
					gameOver.style.display = 'none';
				}
			}
		});
});

fetch('/matching?email=' + user.email)
	.then(res => res.json())
	.then((res) => {
		if (res) {
			setGame(res);
		}
	});


function setGame(data) {
	startMatch.style.display = 'none';
	emptyImg.style.display = 'none';
	myName.textContent = user.name;
	myAvatar.src = user.avatar;
	if (data.user.email === user.email) {
		opponentName.textContent = data.opponent.name;
		opponentAvatar.src = data.opponent.avatar;
	} else {
		opponentName.textContent = data.user.name;
		opponentAvatar.src = data.user.avatar;
	}
	const date = new Date(data.gameTime);
	gameDate.textContent = date.toLocaleDateString();
	gameTime.textContent = date.toLocaleTimeString();
	gameAddress.textContent = data.address
	matchResult.style.display = 'block';
	gameId = data._id;

	if (new Date > date && (!data.firstInputId || (data.firstInputId && data.firstInputId !== user._id))) {
		gameOver.style.display = 'inline-block'
	} else {
		gameOver.style.display = 'none';
	}
}
