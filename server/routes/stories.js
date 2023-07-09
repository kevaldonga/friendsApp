const app = require('express').Router();
const bodyParser = require('body-parser');
const { Op } = require('sequelize');
const { stories, hashtagsOnStory, likesOnStory, profiles } = require('../models');
const { nullCheck } = require('./validations/nullcheck');
const { jwtcheck, authorizeuid, authorizeProfileUUID } = require('../middleware/jwtcheck');

app.use(bodyParser.json());

/* 
* / - POST - create a story
* @check check jwt signature, match uid from payload
*/
app.post("/:uid", jwtcheck, authorizeuid, async (req, res) => {
    value = nullCheck(body, { nonNullableFields: ['profileId', 'media'], mustBeNullFields: [...defaultNullFields, 'likesCount'] });
    if (typeof (value) == 'string') return res.status(409).send(value);

    await stories.create(req.body)
        .then((result) => {
            res.send("tag created successfully!!");
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

/* 
* /:storyUUID - GET - get a story
* @check check jwt signature
*/
app.post("/:storyUUID", jwtcheck, async (req, res) => {
    const storyUUID = req.params.storyUUID;
    let error = false;

    result = await stories.findOne({
        where: {
            "uuid": {
                [Op.eq]: storyUUID,
            },
        },
        attributes: ['id'],
    })
        .catch((err) => {
            error = true;
            res.status(403).send(err.message);
        });

    if (error) return;

    const storyId = result.id;

    await stories.findOne({
        where: {
            "id": {
                [Op.eq]: storyId,
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
* /profileUUID/stories - GET - get all stories of a profile
* @check check jwt signature, match profile uuid from payload
*/
app.get("/profile/:profileUUID", jwtcheck, authorizeProfileUUID, async (req, res) => {
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

    await stories.findAll({
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
* /:storyUUID - PUT - update a story
* @check check jwt signature, match profile uuid from payload
*/
app.put("/:storyUUID", jwtcheck, async (req, res) => {
    value = nullCheck(body, { mustBeNullFields: [...defaultNullFields, 'profileId', 'likesCount'] });
    if (typeof (value) == 'string') return res.status(409).send(value);

    const storyUUID = req.params.storyUUID;

    await stories.update(req.body, {
        where: {
            "uuid": {
                [Op.eq]: storyUUID,
            }
        }
    })
        .then((result) => {
            res.send("story updated successfully!!");
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

/* 
* /:storyUUID - delete - delete a story
* @check check jwt signature
*/
app.delete("/:storyUUID", jwtcheck, async (req, res) => {
    const storyUUID = req.params.storyUUID;

    await stories.delete({
        where: {
            "uuid": {
                [Op.eq]: storyUUID,
            }
        }
    })
        .then((result) => {
            res.send("story deleted successfully!!");
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

/* 
* /:storyUUID/hastags - get all hashtags in a story
* @check check jwt signature
*/
app.get("/:storyUUID/hashtags", jwtcheck, async (req, res) => {
    const storyUUID = req.params.storyUUID;
    const offset = req.query.page === undefined ? 0 : parseInt(req.query.page);
    const limit = req.query.limit === undefined ? 10 : parseInt(req.query.limit);
    let error = false;

    result = await stories.findOne({
        where: {
            "uuid": {
                [Op.eq]: storyUUID,
            },
        },
        attributes: ['id'],
    })
        .catch((err) => {
            error = true;
            res.status(403).send(err.message);
        });

    if (error) return;

    const storyId = result.id;

    await hashtagsOnStory.findAll({
        where: {
            "storyId": {
                [Op.eq]: storyId,
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
* /:storyUUID/hashtags/:hashtagUUID - POST - add a hashtag in a story
* @check check jwt signature
*/
app.post("/:storyUUID/hashtags/:hashtagUUID", jwtcheck, async (req, res) => {
    const storyUUID = req.params.storyUUID;
    const hashtagUUID = req.params.hashtagUUID;
    let error = false;

    result = await stories.findOne({
        where: {
            "uuid": {
                [Op.eq]: storyUUID,
            },
        },
        attributes: ['id'],
    })
        .catch((err) => {
            error = true;
            res.status(403).send(err.message);
        });

    if (error) return;

    const storyId = result.id;

    result = await hashtags.findOne({
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

    await hashtagsOnStory.create({ "storyId": storyId, "hashtagId": hashtagId })
        .then((result) => {
            res.send("hashtag added in story successfully!!");
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

/* 
* /:storyUUID/hastags/:hashtagUUID - remove a hashtag in a story
* @check check jwt signature
*/
app.delete("/:storyUUID/hashtags/:hashtagUUID", jwtcheck, async (req, res) => {
    const storyUUID = req.params.storyUUID;
    const hashtagUUID = req.params.hashtagUUID;
    let error = false;

    result = await stories.findOne({
        where: {
            "uuid": {
                [Op.eq]: storyUUID,
            },
        },
        attributes: ['id'],
    })
        .catch((err) => {
            error = true;
            res.status(403).send(err.message);
        });

    if (error) return;

    const storyId = result.id;

    result = await hashtags.findOne({
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

    await hashtagsOnStory.destory({
        where: {
            "storyId": {
                [Op.eq]: storyId,
            },
            "hashtagId": {
                [Op.eq]: hashtagId,
            },
        }
    })
        .then((result) => {
            res.send("hashtag removed successfully!!");
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

/* 
* /:storyUUID/likes - GET - get likes on a story
* @check check jwt signature
*/
app.get("/:storyUUID/likes", jwtcheck, async (req, res) => {
    const storyUUID = req.params.storyUUID;
    const offset = req.query.page === undefined ? 0 : parseInt(req.query.page);
    const limit = req.query.limit === undefined ? 10 : parseInt(req.query.limit); 4
    let error = false;

    result = await stories.findOne({
        where: {
            "uuid": {
                [Op.eq]: storyUUID,
            },
        },
        attributes: ['id'],
    })
        .catch((err) => {
            error = true;
            res.status(403).send(err.message);
        });

    if (error) return;

    const storyId = result.id;

    await likesOnStory.findAll({
        where: {
            "storyId": {
                [Op.eq]: storyId,
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
* /:profileUUID/like/:storyUUID - POST - like on a story
* @check check jwt signature, match profile uuid from payload
*/
app.post("/:profileUUID/likes/:storyUUID", jwtcheck, authorizeProfileUUID, async (req, res) => {
    const storyUUID = req.params.storyUUID;
    const profileUUID = req.params.profileUUID;
    let error = false;

    result = await stories.findOne({
        where: {
            "uuid": {
                [Op.eq]: storyUUID,
            },
        },
        attributes: ['id'],
    })
        .catch((err) => {
            error = true;
            res.status(403).send(err.message);
        });

    if (error) return;

    const storyId = result.id;

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

    // increment likes count in story
    await stories.increment('likesCount', {
        where: {
            "id": {
                [Op.eq]: storyId,
            },
        },
    })
        .catch((err) => {
            error = true;
            res.status(403).send(err.message);
        });

    if (error) return;

    await likesOnStory.create({ "storyId": storyId, "profileId": profileId })
        .then((result) => {
            res.send("liked on story successfully!!");
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

/* 
* /:profileUUID/likes/:storyUUID - DELETE - unlike on a story
* @check check jwt signature, match profile uuid from payload
*/
app.delete("/:profileUUID/likes/:storyUUID", jwtcheck, authorizeProfileUUID, async (req, res) => {
    const storyUUID = req.params.storyUUID;
    const profileUUID = req.params.profileUUID;
    let error = false;

    result = await stories.findOne({
        where: {
            "uuid": {
                [Op.eq]: storyUUID,
            },
        },
        attributes: ['id'],
    })
        .catch((err) => {
            error = true;
            res.status(403).send(err.message);
        });

    if (error) return;;

    const storyId = result.id;

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

    // decrement likes count in story
    await stories.decrement('likesCount', {
        where: {
            "id": {
                [Op.eq]: storyId,
            },
        },
    })
        .catch((err) => {
            error = true;
            res.status(403).send(err.message);
        });

    if (error) return;

    await likesOnStory.destroy({
        where: {
            "storyId": {
                [Op.eq]: storyId
            },
            "profileId": {
                [Op.eq]: profileId
            }
        }
    })
        .then((result) => {
            res.send("unliked story successfully!!");
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

module.exports = app;