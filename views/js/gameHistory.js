const history = document.getElementById('history');

function getHistory() {
	fetch('/gameHistory')
		.then(res => res.json())
		.then(res => {
			history.innerHTML = '';
			for (let i = 0; i < res.length; i++) {
				const record = document.createElement('tr');

				record.innerHTML = `
				<td>${new Date(res[i].gameTime).toLocaleString()}</td>
				<td>${res[i].address}</td>
				<td>${res[i].opponent.name}</td>
				<td>${res[i].userScore} : ${res[i].opponentScore}</td>
				<td>
					${res[i].isFinish ? '' : '<button type="button" class="btn btn-primary btn-sm">Edit</button>'}
				</td>
		`;
				history.appendChild(record);
			}
		});
}

getHistory();
