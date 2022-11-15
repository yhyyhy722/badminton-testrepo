const myName = document.getElementById('my_name');
const opponentName = document.getElementById('opponent_name');
const gameDate = document.getElementById('game_date');
const gameTime = document.getElementById('game_time');
const gameAddress = document.getElementById('game_address');
const matchResult = document.getElementById('match_result');
const gameOver = document.getElementById('game_over');
const startMatch = document.getElementById('start_match');
const confirm = document.getElementById('confirm');
const cancel = document.getElementById('cancel');

let user = localStorage.getItem('user');
user = JSON.parse(user);

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
			myName.textContent = user.name;
			opponentName.textContent = res.opponent.name;
			const date = new Date(res.gameTime);
			gameDate.textContent = date.toLocaleDateString();
			gameTime.textContent = date.toLocaleTimeString();
			gameAddress.textContent = res.address
			matchResult.style.display = 'block';
			gameOver.style.display = 'inline-block';
			gameId = res.id;
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
			opponentScore: Number(adversaryScore.value)
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
				gameOver.style.display = 'none';
				if (res.status === 'over') {
					matchResult.style.display = 'none';
					gameOver.style.display = 'none';
				}
			}
		});
});
