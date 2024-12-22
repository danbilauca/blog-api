const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Blog posts data (mock data)
let blogPosts = [];

// Get all blog posts
app.get('/posts', (req, res) => {
    console.log(req);
    res.json(blogPosts);
});

// Create a new blog post
app.post('/posts', (req, res) => {
    const newPost = req.body;
    blogPosts.push(newPost);
    res.status(201).json(newPost);
});

// Get a single blog post
app.get('/posts/:id', (req, res) => {
    const post = blogPosts.find(p => p.id === parseInt(req.params.id));
    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
});

// Update a blog post
app.put('/posts/:id', (req, res) => {
    const post = blogPosts.find(p => p.id === parseInt(req.params.id));
    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }
    Object.assign(post, req.body);
    res.json(post);
});

// Delete a blog post
app.delete('/posts/:id', (req, res) => {
    blogPosts = blogPosts.filter(p => p.id !== parseInt(req.params.id));
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Blog API running at http://localhost:${port}`);
});
