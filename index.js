const express = require('express');
const app = express();
const db = require('./config/db');
const Post = require('./models/Post');

const port = process.env.PORT ||  8000;

app.use(express.json());

app.get('/', (req, res)=>{
    res.send("Welcome! Server is Running :)")
})

// To Checking health of api
app.get('/api/', (req, res)=>{
    res.status(200).json({
        message: "Api is working fine in Json format."
    })
})

// Fetching all the posts
app.get("/api/posts", (req, res) => {
    Post.find({}).then((data)=>{
        res.status(200).json({data: data})
        console.log(data);
    }).catch((err)=> {
        console.log(err);;
        res.status(500).json({
            message: err
        })
    })
});

// Getting is specific post
app.get("/api/posts/:id", (req, res) => {
    let postid = req.params.id;
    Post.find({_id:postid}).then((data)=>{
        console.log(data);
        res.status(200).json({data:data})
    }).catch((err)=>{
        console.log(err);
        res.status(500).json({message:err})
    })
});

// Creating a new post
app.post("/api/posts", (req, res) => {

    let newPost = new Post({
        title: req.body.title,
        description: req.body.description
    })

    newPost.save().then((data)=>{
        
        res.status(200).json({message:"Post created successfully", data:data })
    }).catch((err)=>{
        
        res.status(500).json({message:err})
    })
});

// Updating Specific Post
app.put("/api/posts/:id", (req, res) => {
    let postid = req.params.id;

    let newInfo = {
        title: req.body.title,
        description: req.body.description
    }

    Post.findByIdAndUpdate(postid, newInfo).then((data)=>{res.status(200).json({message:"Post Updated Successfully", data:data})}).catch((err)=> {res.status(500).json({message:err})})
});

// Deleting Specific Post 
app.delete("/api/posts/:id", (req, res) => {

    let postid = req.params.id;

    Post.findByIdAndDelete(postid).then((data)=> res.status(200).json({message: "Post Deleted Successfully"})).catch((err)=> res.status(500).json({message: err}))
});

app.listen(port, (err)=>{
    if(!err){
        db()
          .then(() =>
            console.log("Successfully Connected DB and Server is Up :)")
          )
          .catch((err) => console.log(err));
    }else{
        console.log(err);
    }
})