const history = document.getElementById('history');
const myScore = document.getElementById('my_score');
const adversaryScore = document.getElementById('adversary_score');
const confirm = document.getElementById('confirm');
const cancel = document.getElementById('cancel');
const scoreResult = document.getElementById('score_result');
const searchText = document.getElementById('search_text');
const search = document.getElementById('search');

let gameId;
let gameHistories = [];

function getHistory() {
	fetch('/gameHistory?userId=' + user._id)
		.then(res => res.json())
		.then(res => {
			gameHistories = res;
			generateGameHistory(res);
		});
}

function generateGameHistory(res) {
	history.innerHTML = '';
	for (let i = 0; i < res.length; i++) {
		const record = document.createElement('tr');

		record.innerHTML = `
				<td>${new Date(res[i].gameTime).toLocaleString()}</td>
				<td>${res[i].address}</td>
				<td>${user._id === res[i].user._id ? res[i].opponent.name : res[i].user.name}</td>
				<td>${user._id === res[i].user._id ? (res[i].userScore + ' : ' + res[i].opponentScore) : (res[i].opponentScore + ' : ' + res[i].userScore)}</td>
				<td>${res[i].status}</td>
				<td>
					${res[i].status === 'inputting' ? '<button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="openModal(\'' + res[i]._id + '\')">Edit</button>' : ''}
				</td>
		`;
		history.appendChild(record);
	}
}

function openModal(id) {
	gameId = id;
}

confirm.addEventListener('click', function() {
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
				getHistory();
			}
		});
});

search.addEventListener("click", function() {
	const text = searchText.value;
	const matchGameHistories = gameHistories.filter(
		item => new Date(item.gameTime).toLocaleString().indexOf(text) >= 0 ||
			item.address.indexOf(text) >= 0 ||
			(user._id === item.user._id ? item.opponent.name : item.user.name).indexOf(text) >= 0 ||
			String(item.userScore).indexOf(text) >= 0 ||
			String(item.opponentScore).indexOf(text) >= 0
	)
	generateGameHistory(matchGameHistories);
});

getHistory();
