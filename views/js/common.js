let user = localStorage.getItem('user');
if (user) {
	user = JSON.parse(user);
	fetch('/user/' + user._id)
		.then(res => res.json())
		.then(res => {
			document.getElementById('avatar').src = res.avatar;
			document.getElementById('name').innerHTML = res.name;
		});
}
