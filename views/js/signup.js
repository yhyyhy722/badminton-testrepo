const signup = document.getElementById('signup');
signup.addEventListener('click', function() {
	const email = document.getElementById('email').value;
	const name = document.getElementById('name').value;
	const password = document.getElementById('password').value;
	const confirmPassword = document.getElementById('confirm_password').value;

	if (!email) {
		alert('email required!');
		return;
	}

	if (!/^\S+@\S+\.\S+$/.test(email)) {
		alert('Invalid email format!');
		return;
	}

	if (!password) {
		alert('password required!');
		return;
	}

	if (password !== confirmPassword) {
		alert('Confirm password not equal to password!');
		return;
	}

	if (email && password) {
		fetch('/signup', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email,
				name,
				password,
			})
		}).then(res => res.json())
			.then(res => {
				if (res.message) {
					alert(res.message);
				} else {
					alert('Sign up successful!')
					location.href = './index.html';
				}
			});
	}
});
