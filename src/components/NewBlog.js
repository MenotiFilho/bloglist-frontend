import React, { useState } from 'react';

const NewBlog = ({ handleNewBlog }) => {
	const [title, setTitle] = useState('');
	const [author, setAuthor] = useState('');
	const [url, setUrl] = useState('');

	const handleSubmit = (event) => {
		event.preventDefault();

		const newBlog = {
			title,
			author,
			url,
			likes: 0,
		};

		handleNewBlog(newBlog);

		setTitle('');
		setAuthor('');
		setUrl('');
	};

	return (
		<div>
			<h2>create new</h2>
			<form onSubmit={handleSubmit}>
				<div>
					title:
					<input
						type="text"
						value={title}
						onChange={(event) => setTitle(event.target.value)}
					/>
				</div>
				<div>
					author:
					<input
						type="text"
						value={author}
						onChange={(event) => setAuthor(event.target.value)}
					/>
				</div>
				<div>
					url:
					<input
						type="text"
						value={url}
						onChange={(event) => setUrl(event.target.value)}
					/>
				</div>
				<button type="submit">create</button>
			</form>
		</div>
	);
};

export default NewBlog;
