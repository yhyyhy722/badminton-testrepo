const signin = document.getElementById('signin');
signin.addEventListener('click', function() {
	const email = document.getElementById('email').value;
	const password = document.getElementById('password').value;

	if (!email) {
		alert('email required!')
		return;
	}

	if (!password) {
		alert('password required!')
		return;
	}

	if (email && password) {
		fetch('/signin', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email,
				password,
			})
		}).then(res => res.json())
			.then(res => {
				if (res.message) {
					alert(res.message);
				} else {
					localStorage.setItem('user', JSON.stringify(res));
					alert('Sign in successful!')
					location.href = './Home.html';
				}
			});
	}
});
