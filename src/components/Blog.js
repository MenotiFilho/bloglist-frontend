import React, { useState } from 'react';
import blogService from '../services/blogs';

const Blog = ({ blog, setBlogs, currentUser }) => {
	const [showDetails, setShowDetails] = useState(false);

	const handleToggleDetails = () => {
		setShowDetails(!showDetails);
	};

	const handleLike = async () => {
		const updatedBlog = { ...blog, likes: blog.likes + 1 };
		await blogService.update(blog.id, updatedBlog);
		setBlogs((prevBlogs) =>
			prevBlogs.map((prevBlog) =>
				prevBlog.id === blog.id
					? { ...prevBlog, likes: prevBlog.likes + 1 }
					: prevBlog
			)
		);
	};

	const handleDelete = async () => {
		if (window.confirm('Are you sure you want to delete this blog?')) {
			await blogService.deleteBlog(blog.id);
			setBlogs((prevBlogs) =>
				prevBlogs.filter((prevBlog) => prevBlog.id !== blog.id)
			);
		}
	};

	const blogStyle = {
		paddingTop: 10,
		paddingLeft: 2,
		border: 'solid',
		borderWidth: 1,
		marginBottom: 5,
	};

	return (
		<div className="blog" style={blogStyle}>
			<div>
				<strong>{blog.title}</strong> by {blog.author}
				<button onClick={handleToggleDetails}>
					{showDetails ? 'Hide Details' : 'Show Details'}
				</button>
				{currentUser && currentUser.username === blog.user.username && (
					<button onClick={handleDelete}>Delete</button>
				)}
			</div>

			{showDetails && (
				<div>
					<p>{blog.url}</p>
					<p>
						Likes: {blog.likes} <button onClick={handleLike}>Like</button>
					</p>
					<p>Criador: {blog.user.username}</p>
				</div>
			)}
		</div>
	);
};

export default Blog;
