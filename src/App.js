import React, { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import './App.css';
import Togglable from './components/Togglable';
import NewBlog from './components/NewBlog';

const App = () => {
	const [blogs, setBlogs] = useState([]);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [user, setUser] = useState(null);
	const [notification, setNotification] = useState(null);
	const [notificationType, setNotificationType] = useState(null);

	const togglableRef = useRef();

	useEffect(() => {
		blogService.getAll().then((blogs) => setBlogs(blogs));
	}, []);

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON);
			setUser(user);
			blogService.setToken(user.token);
		}
	}, []);

	const showNotification = (message, type) => {
		setNotification(message);
		setNotificationType(type);
		setTimeout(() => {
			setNotification(null);
			setNotificationType(null);
		}, 5000);
	};

	const handleLogin = async (event) => {
		event.preventDefault();
		try {
			const user = await loginService.login({
				username,
				password,
			});

			window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));

			blogService.setToken(user.token);
			setUser(user);
			setUsername('');
			setPassword('');
		} catch (error) {
			showNotification('Wrong username or password', 'error');
		}
	};

	const handleNewBlog = async (newBlog) => {
		newBlog.user = user;
		const returnedBlog = await blogService.create(newBlog);
		setBlogs((prevBlogs) => [...prevBlogs, returnedBlog]);
		togglableRef.current.toggleVisibility();
		showNotification(
			`A new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
			'success'
		);
	};

	const handleLogout = () => {
		localStorage.removeItem('loggedBlogappUser');
		setUser(null);
	};

	const loginForm = () => (
		<form onSubmit={handleLogin}>
			<div>
				username
				<input
					type="text"
					value={username}
					name="Username"
					onChange={({ target }) => setUsername(target.value)}
				/>
			</div>
			<div>
				password
				<input
					type="password"
					value={password}
					name="Password"
					onChange={({ target }) => setPassword(target.value)}
				/>
			</div>
			<button type="submit">login</button>
		</form>
	);

	if (user === null) {
		return (
			<div>
				{notification && (
					<div className={`notification ${notificationType}`}>{notification}</div>
				)}
				<h2>Log in to application</h2>
				{loginForm()}
			</div>
		);
	}

	return (
		<div>
			{notification && (
				<div className={`notification ${notificationType}`}>{notification}</div>
			)}
			<h2>blogs</h2>
			<div>
				<p>{user.name} logged in</p>
				<button type="button" onClick={handleLogout}>
					logout
				</button>
			</div>
			<Togglable buttonLabel="new blog" ref={togglableRef}>
				<NewBlog handleNewBlog={handleNewBlog} />
			</Togglable>

			{blogs.map((blog) => (
				<Blog key={blog.id} blog={blog} setBlogs={setBlogs} currentUser={user} />
			))}
		</div>
	);
};

export default App;
