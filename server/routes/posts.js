const app = require('express').Router();
const bodyParser = require('body-parser');
const { posts, hashtagsOnPost, likesOnPost, profiles } = require('../models');
const { Op } = require('sequelize');
const { nullCheck, defaultNullFields } = require('./validations/nullcheck');

app.use(bodyParser.json());

/*
* /:postUUID - GET - get post
*/
app.get("/:postUUID", async (req, res) => {
    const postUUID = req.params.postUUID;
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

    await posts.findOne({
        where: {
            "id": {
                [Op.eq]: postId,
            }
        }
    })
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

/*
* /:profileUUID/posts - GET - get all post of profile
*/
app.get("/:profileUUID/posts", async (req, res) => {
    const profileUUID = req.params.profileUUID;
    const offset = req.query.page === undefined ? 0 : parseInt(req.query.page);
    const limit = req.query.limit === undefined ? 10 : parseInt(req.query.limit);
    let error = false;

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

    await posts.findAll({
        where: {
            "profileId": {
                [Op.eq]: profileId,
            }
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
* / - POST - create post
*/
app.post("/", async (req, res) => {
    value = nullCheck(body, { nonNullableFields: ['profileId', 'title', 'media',], mustBeNullFields: [...defaultNullFields, 'likesCount', 'commentsCount'] });
    if (typeof (value) == 'string') return res.status(409).send(value);

    await posts.create(req.body)
        .then((result) => {
            res.send("post created successfully!!");
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

/* 
* /:postUUID - PUT - update post
*/
app.put("/:postUUID", async (req, res) => {
    value = nullCheck(body, { nonNullableFields: ['title', 'media'], mustBeNullFields: [...defaultNullFields, 'profileId', 'likesCount', 'commentsCount'] });
    if (typeof (value) == 'string') return res.status(409).send(value);
    let error = false;

    const postUUID = req.params.postUUID;

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

    await posts.update(req.body, {
        where: {
            "id": {
                [Op.eq]: postId,
            }
        }
    })
        .then((result) => {
            res.send("post updated successfully!!");
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

/* 
* /:postUUID - DELETE - delete post
*/
app.delete("/:postUUID", async (req, res) => {
    const postUUID = req.params.postUUID;
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

    await posts.destory({
        where: {
            "id": {
                [Op.eq]: postId,
            }
        }
    })
        .then((result) => {
            res.send("post deleted successfully!!");
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

/* 
* /:postUUID/hashtags - GET - get all hashtags of post
*/
app.get("/:postUUID/hashtags", async (req, res) => {
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

    await hashtagsOnPost.findAll({
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
* /:postUUID/hashtags/:hashtagUUID - POST - add hashtag in post
*/
app.post("/:postUUID/hashtags/:hashtagUUID", async (req, res) => {
    const postUUID = req.params.postUUID;
    const hashtagUUID = req.params.hashtagUUID;
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

    result = await hashatags.findOne({
        where: {
            "uuid": {
                [Op.eq]: hashtagUUID,
            },
        },
        attributes: ['id'],
    })
        .catch((err) => {
            error = true;
            res.status(403).send(err.message);
        });

    if (error) return;

    const hashtagId = result.id;

    await hashtagsOnPost.create({ "postId": postId, "hashtagId": hashtagId })
        .then((result) => {
            res.send("hashtag added on post successfully!!");
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

/* 
* /:postUUID/hashtags/:hashtagUUID - DELETE - remove hashtag in post
*/
app.delete("/:postUUID/hashtags/:hashtagUUID", async (req, res) => {
    const postUUID = req.params.postUUID;
    const hashtagUUID = req.params.hashtagUUID;
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

    result = await hashatags.findOne({
        where: {
            "uuid": {
                [Op.eq]: hashtagUUID,
            },
        },
        attributes: ['id'],
    })
        .catch((err) => {
            error = true;
            res.status(403).send(err.message);
        });

    if (error) return;

    const hashtagId = result.id;

    await hashtagsOnPost.destroy({ "postId": postId, "hashtagId": hashtagId })
        .then((result) => {
            res.send("hashtag removed successfully!!");
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

/* 
* /:postUUID/likes - GET - get likes on post
*/
app.get("/:postUUID/likes", async (req, res) => {
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

    await likesOnPost.findAll({
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
* /:profileUUID/likes/:postUUID - POST - like a post
*/
app.post("/:profileUUID/likes/:postUUID", async (req, res) => {
    const profileUUID = req.params.profileUUID;
    const postUUID = req.params.postUUID;
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
                [Op.eq]: postId,
            },
        },
    })
        .catch((err) => {
            error = true;
            res.status(403).send(err.message);
        });

    if (error) return;

    await likesOnPost.create({ "postId": postId, "profileId": profileId })
        .then((result) => {
            res.send("liked on post successfully!!");
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

/* 
* /:profileUUID/likes/:postUUID - GET - unlike post
*/
app.delete("/:profileUUID/likes/:postUUID", async (req, res) => {
    const postUUID = req.params.postUUID;
    const profileUUID = req.params.profileUUID;
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

    await likesOnPost.destory({
        where: {
            "postId": {
                [Op.eq]: postId,
            },
            "profileId": {
                [Op.eq]: profileId,
            },
        }
    })
        .then((result) => {
            res.send("post unliked successfully!!");
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

module.exports = app;