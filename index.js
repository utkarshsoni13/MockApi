const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

var idCounter=0;
function generateId() {
    return ++idCounter;
}
let store = {
    posts: [],
    authors: []
};
// read data from store.json and initialize idCounter
fs.readFile('./storage/store.json', 'utf8', (err, data) => {
    if (!err) {
        try {
            store = JSON.parse(data);
            if (store.posts.length > 0) {
                idCounter = Math.max(...store.posts.map(post => post.id));
            }
        } catch (parseErr) {
            console.error('Error parsing existing data from file or store.json is empty');
        }
    }
});

app.get('/posts',(req,res)=>{
    fs.readFile('./storage/store.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading data from file.' });
        }
        let store=[]
        if (data) {
            try {
                store = JSON.parse(data);
            } catch (parseErr) {
                return res.status(500).json({ error: 'Error parsing data from file.' });
            }
        }
        return res.status(200).json(store.posts);     
    });
})
app.get('/posts/:id',(req,res)=>{
    console.log(req.params.id);
   let postId=parseInt(req.params.id);
   console.log(postId);
    fs.readFile('./storage/store.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading data from file.' });
        }
        let store = [];
        if (data) {
            try {
                store = JSON.parse(data);
            } catch (parseErr) {
                return res.status(500).json({ error: 'Error parsing data from file.' });
            }
        }
        let posts=store.posts
        console.log(posts)
        let post=posts.filter(post=>post.id===postId);
        console.log(post);
        if(post.length===1){
            return res.status(200).json(post);
        }
        else{
            return res.status(400).json({message:`No post with id ${postId} found`});
        }
    });
})

app.post('/posts', (req, res) => {
    console.log(req);
    const { id,title, author,views,reviews } = req.body;
    let currId=id;
    console.log(currId)
    if(currId==undefined){
        currId=generateId();
    }
    if (!title || !author ||!views||!reviews) {
        return res.status(400).json({ error: 'Please provide all the detail of the post.' });
    }

    fs.readFile('./storage/store.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading data from file.' });
        }
        if (data) {
            try {
                store = JSON.parse(data);
            } catch (parseErr) {
                return res.status(500).json({ error: 'Error parsing data from file.' });
            }
        }
        let posts=store.posts;
        if (posts.find(post => post.id === currId)) {
            return res.status(400).json({ error: 'A post with the same id already exists.' });
        }

        const newPost={ id:currId, title, author,views,reviews }
        store.posts.push(newPost);
        fs.writeFile('./storage/store.json', JSON.stringify(store, null, 2), 'utf8', (writeErr) => {
            if (writeErr) {
                return res.status(500).json({ error: 'Error writing data to file.' });
            }
    
            res.status(201).json({ message: 'Post added successfully.', post: newPost });
        });
    });
});
app.delete('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const index = store.posts.findIndex(post => post.id === postId);
    if (index === -1) {
        return res.status(404).json({ error: 'Post not found.' });
    }

    const deletedPost = store.posts.splice(index, 1)[0];

    fs.writeFile('./storage/store.json', JSON.stringify(store, null, 2), 'utf8', (writeErr) => {
        if (writeErr) {
            return res.status(500).json({ error: 'Error writing data to file.' });
        }

        res.json({ message: 'Post deleted successfully.', post: deletedPost });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
