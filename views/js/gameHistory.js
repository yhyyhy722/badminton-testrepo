const history = document.getElementById('history');
fetch('/gameHistory')
	.then(res => res.json())
	.then(res => {
		history.innerHTML = '';
		for (let i = 0; i < res.length; i++) {
			const record = document.createElement('tr');

			record.innerHTML = `
				<td>${res[i].dateTime}</td>
				<td>${res[i].address}</td>
				<td>${res[i].adversary}</td>
				<td>${res[i].score}</td>
				<td>
					${res[i].isFinish ? '' : '<button type="button" class="btn btn-primary btn-sm">Edit</button>'}
				</td>
		`;
			history.appendChild(record);
		}
	});
