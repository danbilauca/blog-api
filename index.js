require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = process.env.APP_PORT;// || 3030;
const mongoUrl = process.env.MONGO_URL;// || 'mongodb://localhost:27017/blog';

app.use(express.json());

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Something Connected to MongoDB'))
    .catch(err => console.log(err));

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model('Post', postSchema);

// Blog posts data (mock data
let blogPosts = [];

// Get all blog posts
app.get('/', (req, res) => {
    console.log('/');
    res.send(`Hello World from ${process.env.ENV}!`);
});

// Get all blog posts
app.get('/posts', async (req, res) => {
    try {
        
        console.log('GET /posts');

        const posts = await Post.find();
        console.log(posts);
        res.status(200).json(posts);
    } catch (error) {
        console.error(`Error getting posts: ${error}`);
        res.status(500).json({
            message: 'Error getting posts',
            error: error.message
        });
    }
});

// Create a new blog post
app.post('/posts', async (req, res) => {
    try {
        console.log('POST /posts');

        const newPost = new Post(req.body);
        const savedPost = await newPost.save();
    
        fs.appendFile('./tmp/data.json', JSON.stringify(req.body), (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error writing to file');
            }
            console.log('Data written to file');
        });
    
        blogPosts.push(newPost);
        res.status(201).json({
            message: 'Post created successfully',
            post: savedPost
        });

    } catch (error) {
        console.error(`Error saving post: ${error}`);
        res.status(500).json({
            message: 'Error saving post',
            error: error.message
        });
    }
});

// Get a single blog post
app.get('/posts/:id', (req, res) => {
    console.log('GET /posts/:id');
    const post = blogPosts.find(p => p.id === parseInt(req.params.id));
    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
});

// Update a blog post
app.put('/posts/:id', (req, res) => {
    console.log('POST /posts/:id');
    const post = blogPosts.find(p => p.id === parseInt(req.params.id));
    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }
    Object.assign(post, req.body);
    res.json(post);
});

// Delete a blog post
app.delete('/posts/:id', (req, res) => {
    console.log('DELETE /posts/:id');
    blogPosts = blogPosts.filter(p => p.id !== parseInt(req.params.id));
    res.status(204).send();
});


app.get('/read-file', (req, res) => {
    console.log('GET /read-file');
    fs.readFile('./quotes.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading file');
        }
        console.log('Data read from file');
        res.status(200).send(data);
    })
});

app.get('/read', (req, res) => {
    console.log('GET /read');
    fs.readFile('./tmp/data.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading file');
        }
        console.log('Data read from file');
        res.status(200).send(data);
    })
});

app.post('/write', (req, res) => {
    const payload = req.body;
    console.log('POST /write');
    console.log(JSON.stringify(payload));
    fs.appendFile('./tmp/data.json', JSON.stringify(payload), (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error writing to file');  
        } 
        console.log('Data written to file');
        res.status(200).send('Data written to file');
    })
});

app.listen(port, () => {
    console.log(`Environment: ${process.env.ENV}`);
    console.log(`Blog API running at http://localhost:${port}`);
});
