const levelCards = document.getElementsByClassName('level-card');

for (let i = 0; i < levelCards.length; i++) {
	levelCards[i].addEventListener('click', function() {
		let user = localStorage.getItem('user');
		user = JSON.parse(user);
		const level = levelCards[i].dataset.level;

		fetch('/' + user.email, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				level
			})
		}).then(res => res.json())
			.then(() => {
				location.href = './Ranking.html';
			});
	});
}
