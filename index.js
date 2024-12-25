require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3030;

app.use(express.json());

// app.use(cors({ origin: `${process.env.FE_APP_URL}` }));
app.use(cors());

// Blog posts data (mock data
let blogPosts = [];

// test comment

// Get all blog posts
app.get('/', (req, res) => {
    console.log('/');
    res.send(`Hello World from ${process.env.ENV}!`);
});

// Get all blog posts
app.get('/posts', (req, res) => {
    console.log('GET /posts');
    res.json(blogPosts);
});

// Create a new blog post
app.post('/posts', (req, res) => {
    
    console.log('POST /posts');
    
    const newPost = req.body;

    fs.appendFile('./tmp/data.json', JSON.stringify(newPost), (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error writing to file');
        }
        console.log('Data written to file');
    });

    blogPosts.push(newPost);
    res.status(201).json(newPost);
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
    console.log(`Blog API running at http://localhost:${port}`);
});
