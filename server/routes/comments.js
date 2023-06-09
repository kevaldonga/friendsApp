const app = require('express').Router();
const { comments, likesOnComment, posts } = require('../models');
const bodyParser = require('body-parser');
const Op = require('sequelize');
const { nullCheck, defaultNullFields } = require('./validations/nullcheck');
const { jwtcheck, authorizeuid } = require('../middleware/jwtcheck');

app.use(bodyParser.json());

/* 
* / - POST - create a comment
* @check check jwt signature, match uid from payload
*/
app.post("/:uid", jwtcheck, authorizeuid, async (req, res) => {
    value = nullcheck(req.body, { nonNullableFields: ['postId', 'comment', 'profileId'], mustBeNullFields: [...defaultNullFields, 'likesCount'] });
    if (typeof (value) == 'string') return res.status(409).send(value);
    let error = false;

    // increment comment count in post
    await posts.increment('commentsCount', {
        where: {
            "id": {
                [Op.eq]: postId,
            },
        },
    })
        .catch((err) => {
            error = true;
            res.status(403).send(err.message);
        });

    if (error) return;

    await comments.create(req.body)
        .then((result) => {
            res.send("comment has been added successfully!!");
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

/* 
* /:commentUUID - GET - get a comment
* @check check jwt signature
*/
app.get("/:commentUUID", jwtcheck, async (req, res) => {
    const commentUUID = req.params.commentUUID;
    let error = false;

    result = await comments.findOne({
        where: {
            "uuid": {
                [Op.eq]: commentUUID,
            },
        },
        attributes: ['id'],
    })
        .catch((err) => {
            error = true;
            res.status(403).send(err.message);
        });

    if (error) return;

    const commentId = result.id;

    await comments.findOne({
        where: {
            "id": {
                [Op.eq]: commentId,
            },
        },
    })
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

/* 
* /:postUUID/comments - GET - get all comments of post
* @check check jwt signature
*/
app.get("/:postUUID/comments", async (req, res) => {
    const postUUID = req.params.postUUID;
    const offset = req.query.page === undefined ? 0 : parseInt(req.query.page);
    const limit = req.query.limit === undefined ? 10 : parseInt(req.query.limit);
    let error = false;

    result = await posts.findOne({
        where: {
            "uuid": {
                [Op.eq]: postUUID,
            },
        },
        attributes: ['id'],
    })
        .catch((err) => {
            error = true;
            res.status(403).send(err.message);
        });

    if (error) return;

    const postId = result.id;

    await comments.findAll({
        where: {
            "postId": {
                [Op.eq]: postId,
            },
        },
        limit: limit,
        offset: offset,
    })
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

/* 
* /:commentUUID/post/:postUUID - DELETE - delete a comment
* @check check jwt signature
*/
app.delete("/:commentUUID/post/:postUUID", jwtcheck, async (req, res) => {
    const commentUUID = req.params.commentUUID;
    const postUUID = req.params.postUUID;
    let error = false;

    result = await comments.findOne({
        where: {
            "uuid": {
                [Op.eq]: commentUUID,
            },
        },
        attributes: ['id'],
    })
        .catch((err) => {
            error = true;
            res.status(403).send(err.message);
        });

    if (error) return;

    const commentId = result.id;

    result = await posts.findOne({
        where: {
            "uuid": {
                [Op.eq]: postUUID,
            },
        },
        attributes: ['id'],
    })
        .catch((err) => {
            error = true;
            res.status(403).send(err.message);
        });

    if (error) return;

    const postId = result.id;

    // decrement comment count in post
    await posts.decrement('commentsCount', {
        where: {
            "id": {
                [Op.eq]: postId,
            },
        },
    })
        .catch((err) => {
            error = true;
            res.status(403).send(err.message);
        });

    if (error) return;

    await comments.destroy({
        where: {
            "id": {
                [Op.eq]: commentId,
            },
        },
    })
        .then((result) => {
            res.send("comment removed successfully!!");
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

/* 
* /:commentUUID - PUT - update a comment
* @check check jwt signature
*/
app.put("/:commentUUID", jwtcheck, async (req, res) => {
    value = nullcheck(req.body, { nonNullableFields: ['comment'], mustBeNullFields: [...defaultNullFields, 'profileId', 'postId', 'likesCount'] });
    if (typeof (value) == 'string') return res.status(409).send(value);
    let error = false;

    const commentUUID = req.params.commentUUID;

    result = await comments.findOne({
        where: {
            "uuid": {
                [Op.eq]: commentUUID,
            },
        },
        attributes: ['id'],
    })
        .catch((err) => {
            error = true;
            res.status(403).send(err.message);
        });

    if (error) return;

    const commentId = result.id;

    await comments.update(req.body, {
        where: {
            "id": {
                [Op.eq]: commentId,
            },
        },
    })
        .then((result) => {
            res.send("comment updated successfully!!");
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

/* 
* /:commentUUID/likes - GET - get likes on a comment
* @check check jwt signature
*/
app.get("/:commentUUID/likes", jwtcheck, async (req, res) => {
    const commentUUID = req.params.commentUUID;
    const offset = req.query.page === undefined ? 0 : parseInt(req.query.page);
    const limit = req.query.limit === undefined ? 10 : parseInt(req.query.limit);
    let error = false;

    result = await comments.findOne({
        where: {
            "uuid": {
                [Op.eq]: commentUUID,
            },
        },
        attributes: ['id'],
    })
        .catch((err) => {
            error = true;
            res.status(403).send(err.message);
        });

    if (error) return;

    const commentId = result.id;

    await likesOnComment.findAll({
        where: {
            "commentId": {
                [Op.eq]: commentId,
            },
        },
        limit: limit,
        offset: offset,
    })
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

/* 
* /:profileUUID/likes/:commentUUID - POST - like on a comment
* @check check jwt signature
*/
app.post("/:profileUUID/likes/:commentUUID", jwtcheck, async (req, res) => {
    const commentUUID = req.params.commentUUID;
    const profileUUID = req.params.profileUUID;
    let error = false;

    result = await comments.findOne({
        where: {
            "uuid": {
                [Op.eq]: commentUUID,
            },
        },
        attributes: ['id'],
    })
        .catch((err) => {
            error = true;
            res.status(403).send(err.message);
        });

    if (error) return;

    const commentId = result.id;

    result = await profiles.findOne({
        where: {
            "uuid": {
                [Op.eq]: profileUUID,
            },
        },
        attributes: ['id'],
    })
        .catch((err) => {
            error = true;
            res.status(403).send(err.message);
        });

    if (error) return;

    const profileId = result.id;

    // increment like count
    await comments.increment('likesCount', {
        where: {
            "id": {
                [Op.eq]: commentId,
            },
        },
    })
        .catch((err) => {
            error = true;
            res.status(403).send(err.message);
        });

    if (error) return;

    await likesOnComment.create({ "commentId": commentId, "profileId": profileId })
        .then((result) => {
            res.send("coment liked successfully!!");
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

/* 
* /:profileUUID/likes/:commentUUID - DELETE - unlike a comment
* @check check jwt signature
*/
app.delete("/:profileUUID/likes/:commentUUID", jwtcheck, async (req, res) => {
    const commentUUID = req.params.commentUUID;
    const profileUUID = req.params.profileUUID;
    let error = false;

    result = await comments.findOne({
        where: {
            "uuid": {
                [Op.eq]: commentUUID,
            },
        },
        attributes: ['id'],
    })
        .catch((err) => {
            error = true;
            res.status(403).send(err.message);
        });

    if (error) return;

    const commentId = result.id;

    result = await profiles.findOne({
        where: {
            "uuid": {
                [Op.eq]: profileUUID,
            },
        },
        attributes: ['id'],
    })
        .catch((err) => {
            error = true;
            res.status(403).send(err.message);
        });

    if (error) return;

    const profileId = result.id;

    // decrement like count
    await comments.decrement('likesCount', {
        where: {
            "id": {
                [Op.eq]: commentId,
            },
        },
    })
        .catch((err) => {
            error = true;
            res.status(403).send(err.message);
        });

    if (error) return;

    await likesOnComment.destroy({
        where: {
            "commentId": {
                [Op.eq]: commentId
            },
            "profileId": {
                [Op.eq]: profileId
            }
        }
    })
        .then((result) => {
            res.send("comment unliked successfully!!");
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

module.exports = app;