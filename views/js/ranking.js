const right = document.getElementById('right');
fetch('/ranking')
.then(res => res.json())
.then(res => {
	right.innerHTML = '';
	for (let i = 0; i < res.length; i++) {
		const rankingItem = document.createElement('div');
		rankingItem.classList.add('ranking-item');
		if (user._id === res[i]._id) {
			rankingItem.classList.add('active');
		}

		let medal = '';
		if (i === 0) {
			medal = '<img class="avatar" src="images/gold-medal.png">';
		} else if (i === 1) {
			medal = '<img class="avatar" src="images/silver-medal.png">';
		} else if (i === 2) {
			medal = '<img class="avatar" src="images/bronze-medal.png">';
		}
		rankingItem.innerHTML = `
			<div>
				<img class="avatar" src="${res[i].avatar}">
				<span class="mx-3">${res[i].name}</span>
				${medal}
			</div>
			<div>${res[i].score.toFixed(2)}(${res[i].level})</div>
			<div>${i+1}</div>
		`;
		right.appendChild(rankingItem);
	}
});
