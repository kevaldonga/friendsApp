const app = require('express').Router();
const { comments, likesOnComment, posts } = require('../models');
const bodyParser = require('body-parser');
const Op = require('sequelize');

app.use(bodyParser.json());

/* 
* / - POST - create a comment
*/
app.post("/", async (req, res) => {
    const postId = req.body.postId;

    result = await comments.create(req.body);

    // increment comment count in post
    await posts.increment('commentsCount', {
        where: {
            "id": {
                [Op.eq]: postId,
            },
        },
    });

    res.send(result ? "comment has been added successfully!!" : "error occured");
});

/* 
* /:commentId - GET - get a comment
*/
app.get("/:commentId", async (req, res) => {
    const commentId = req.params.commentId;

    result = await comments.findOne({
        where: {
            "id": {
                [Op.eq]: commentId,
            },
        },
    });

    res.send(result);
});

/* 
* /:postId/comments - GET - get all comments of post
*/
app.get("/:postId/comments", async (req, res) => {
    const postId = req.params.postId;

    result = await comments.findAll({
        where: {
            "postId": {
                [Op.eq]: postId,
            },
        },
    });

    res.send(result);
});

/* 
* /:commentId - DELETE - delete a comment
*/
app.delete("/:commentId/post/:postId", async (req, res) => {
    const commentId = req.params.commentId;
    const postId = req.params.postId;

    result = await comments.destroy({
        where: {
            "id": {
                [Op.eq]: commentId,
            },
        },
    });

    // decrement comment count in post
    await posts.decrement('commentsCount', {
        where: {
            "id": {
                [Op.eq]: postId,
            },
        },
    });

    res.send(result ? "comment deleted successfully!!" : "error occured");
});

/* 
* /:commentId - PUT - update a comment
*/
app.put("/:commentId", async (req, res) => {
    const commentId = req.params.commentId;

    result = await comments.update(req.body, {
        where: {
            "id": {
                [Op.eq]: commentId,
            },
        },
    });

    res.send(result ? "comment updated successfully!!" : "error occured");
});

/* 
* /:commentId/likes - GET - get likes on a comment
*/
app.get("/:commentId/likes", async (req, res) => {
    const commentId = req.params.commentId;

    result = await likesOnComment.findAll({
        where: {
            "commentId": {
                [Op.eq]: commentId,
            }
        }
    });

    res.send(result);
});

/* 
* /:commentId/likes/:profileId - POST - like on a comment
*/
app.post("/:commentId/likes/:profileId", async (req, res) => {
    const commentId = req.params.commentId;
    const profileId = req.params.profileId;

    result = await likesOnComment.create({ "commentId": commentId, "profileId": profileId });

    // increment like count
    await comments.increment('likesCount', {
        where: {
            "id": {
                [Op.eq]: commentId,
            },
        },
    });
    res.send(result);
});

/* 
* /:commentId/likes/:profileId - DELETE - unlike a comment
*/
app.delete("/:commentId/likes/:profileId", async (req, res) => {
    const commentId = req.params.commentId;
    const profileId = req.params.profileId;

    result = await likesOnComment.destroy({
        where: {
            "commentId": {
                [Op.eq]: commentId
            },
            "profileId": {
                [Op.eq]: profileId
            }
        }
    });

    // decrement like count
    await comments.decrement('likesCount', {
        where: {
            "id": {
                [Op.eq]: commentId,
            },
        },
    });

    res.send(result);
});

module.exports = app;