const app = require('express').Router();
const bodyParser = require('body-parser');
const { posts, hashtagsOnPost, likesOnPost } = require('../models');
const { Op } = require('sequelize');

app.use(bodyParser.json());

/*
* /:postId - GET - get post
*/
app.get("/:postId", async (req, res) => {
    const postId = req.params.postId;

    result = await posts.findOne({
        where: {
            "id": {
                [Op.eq]: postId,
            }
        }
    });

    res.send(result);
});

/*
* /:profileId/posts - GET - get all post of profile
*/
app.get("/:profileId/posts", async (req, res) => {
    const profileId = req.params.profileId;

    result = await posts.findAll({
        where: {
            "profileId": {
                [Op.eq]: profileId,
            }
        }
    });

    res.send(result);
});

/*
* / - POST - create post
*/
app.post("/", async (req, res) => {
    result = await posts.create(req.body);

    res.send(result ? "post created successfully!!" : "error occured");
});

/* 
* /:postId - PUT - update post
*/
app.put("/:postId", async (req, res) => {
    const postId = req.params.posts;

    result = await posts.update(req.body, {
        where: {
            "id": {
                [Op.eq]: postId,
            }
        }
    });

    res.send(result ? "post updated successfully!!" : "error occured");
});

/* 
* /:postId - DELETE - delete post
*/
app.delete("/:postId", async (req, res) => {
    const postId = req.params.posts;

    result = await posts.destory({
        where: {
            "id": {
                [Op.eq]: postId,
            }
        }
    });

    res.send(result ? "post deleted successfully!!" : "error occured");
});

/* 
* /:postId/hashtags - GET - get all hashtags of post
*/
app.get("/:postId/hashtags", async (req, res) => {
    const postId = req.params.posts;

    result = await hashtagsOnPost.findAll({
        where: {
            "postId": {
                [Op.eq]: postId,
            }
        }
    });

    res.send(result);
});

/* 
* /:postId/hashtags/:hashtagId - POST - add hashtag in post
*/
app.post("/:postId/hashtags/:hashtagId", async (req, res) => {
    const postId = req.params.postId;
    const hashtagId = req.params.hashtagId;

    result = await likesOnPost.create({ "postId": postId, "hashtagId": hashtagId });

    res.send(result);
});

/* 
* /:postId/hashtags/:hasgtagId - GET - delete hashtag on post
*/
app.delete("/:postId/hashtags/:hashtagId", async (req, res) => {
    const postId = req.params.postId;
    const hashtagId = req.params.hashtagId;

    result = await hashtagsOnPost.destroy({
        where: {
            "postId": {
                [Op.eq]: postId,
            },
            "hashtagId": {
                [Op.eq]: hashtagId,
            },
        }
    });

    res.send(result ? "hashtag deleted successfully!!" : "error occured");
});

/* 
* /:postId/likes - GET - get likes on post
*/
app.get("/:postId/likes", async (req, res) => {
    const postId = req.params.postId;

    result = await likesOnPost.findAll({
        where: {
            "postId": {
                [Op.eq]: postId,
            },
        }
    });

    res.send(result);
});

/* 
* /:postId/likes/:profileId - POST - like a post
*/
app.post("/:postId/likes/:profileId", async (req, res) => {
    const profileId = req.params.profileId;
    const postId = req.params.postId;

    result = await likesOnPost.create({ "postId": postId, "profileId": profileId });

    res.send(result);
});

/* 
* /:postId//likes/:profileId - GET - unlike post
*/
app.delete("/:postId/likes/:profileId", async (req, res) => {
    const postId = req.params.postId;
    const profileId = req.params.profileId;

    result = await likesOnPost.destory({
        where: {
            "postId": {
                [Op.eq]: postId,
            },
            "profileId": {
                [Op.eq]: profileId,
            },
        }
    });

    res.send(result ? "post unliked successfully!!" : "error occured");
});

module.exports = app;