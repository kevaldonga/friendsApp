const app = require('express').Router();
const { comments, likesOnComment, posts, profiles } = require('../models');
const bodyParser = require('body-parser');
const Op = require('sequelize');
const { nullCheck, defaultNullFields } = require('./validations/nullcheck');
const { jwtcheck, authorizeuid, authorizeProfileUUID } = require('../middleware/jwtcheck');

app.use(bodyParser.json());

/* 
* / - POST - create a comment
* @check check jwt signature, match uid from payload
*/
app.post("/:uid", jwtcheck, authorizeuid, async (req, res) => {
    value = nullCheck(req.body, { nonNullableFields: ['postId', 'comment', 'profileId'], mustBeNullFields: [...defaultNullFields, 'likesCount'] });
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
            res.send("SUCCESS");
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

/* 
* /:commentUUID - GET - get a comment
*/
app.get("/:commentUUID", async (req, res) => {
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

    if (result == null) {
        return res.status(409).send("invalid resource");
    }

    const commentId = result.id;

    await comments.findOne({
        where: {
            "id": {
                [Op.eq]: commentId,
            },
        },
    })
        .then((result) => {
            if (result == null) {
                return res.status(409).send("invalid resource");
            }
            res.send(result);
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

/* 
* /:postUUID/comments - GET - get all comments of post
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

    if (result == null) {
        return res.status(409).send("invalid resource");
    }

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

    if (result == null) {
        return res.status(409).send("invalid resource");
    }

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

    if (result == null) {
        return res.status(409).send("invalid resource");
    }

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
            if (result == 0) {
                return res.status(409).send("invalid resource");
            }
            res.send("SUCCESS");
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
    value = nullCheck(req.body, { nonNullableFields: ['comment'], mustBeNullFields: [...defaultNullFields, 'profileId', 'postId', 'likesCount'] });
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

    if (result == null) {
        return res.status(409).send("invalid resource");
    }

    const commentId = result.id;

    await comments.update(req.body, {
        where: {
            "id": {
                [Op.eq]: commentId,
            },
        },
    })
        .then((result) => {
            if (result == 0) {
                return res.status(409).send("invalid resource");
            }
            res.send("SUCCESS");
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

/* 
* /:commentUUID/likes - GET - get likes on a comment
*/
app.get("/:commentUUID/likes", async (req, res) => {
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

    if (result == null) {
        return res.status(409).send("invalid resource");
    }

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
* @check check jwt signature, match profile uuid from payload
*/
app.post("/:profileUUID/likes/:commentUUID", jwtcheck, authorizeProfileUUID, async (req, res) => {
    const commentUUID = req.params.commentUUID;
    const profileId = req.userinfo.profileId;
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

    if (result == null) {
        return res.status(409).send("invalid resource");
    }

    const commentId = result.id;

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
            res.send("SUCCESS");
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

/* 
* /:profileUUID/likes/:commentUUID - DELETE - unlike a comment
* @check check jwt signature, match profile uuid from payload
*/
app.delete("/:profileUUID/likes/:commentUUID", jwtcheck, authorizeProfileUUID, async (req, res) => {
    const commentUUID = req.params.commentUUID;
    const profileId = req.userinfo.profileId;
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

    if (result == null) {
        return res.status(409).send("invalid resource");
    }

    const commentId = result.id;

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
            if (result == 0) {
                return res.status(409).send("invalid resource");
            }
            res.send("SUCCESS");
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

module.exports = app;