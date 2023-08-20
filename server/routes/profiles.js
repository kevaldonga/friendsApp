const app = require('express').Router();
const bodyParser = require('body-parser');
const { profiles, hashtagsOnProfiles, bookmarksOnPost } = require('../models');
const { Op } = require('sequelize');
const { nullCheck, defaultNullFields } = require('./validations/nullcheck');
const { jwtcheck, authorizeProfileUUID } = require('../middleware/jwtcheck');

app.use(bodyParser.json());

/* 
* /:profileUUID - GET - get a profile
*/
app.get("/:profileUUID", async (req, res) => {
    const profileUUID = req.params.profileUUID;

    await profiles.findOne({
        where: {
            "uuid": {
                [Op.eq]: profileUUID,
            },
        }
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
* / - POST - create a profile
* @check check jwt signature
*/
app.post("/", jwtcheck, async (req, res) => {
    value = nullCheck(req.body, { nonNullableFields: ['username', 'userId'], mustBeNullFields: [...defaultNullFields, 'isActive', 'followers', 'followings'] });
    if (typeof (value) == 'string') return res.status(409).send(value);

    await profiles.create(req.body)
        .then((result) => {
            res.send("SUCCESS");
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

/*
* /:profileUUID - PUT - update a profile
* @check check jwt signature, match profile uuid from payload
*/
app.put("/:profileUUID", jwtcheck, authorizeProfileUUID, async (req, res) => {
    value = nullCheck(req.body, { mustBeNullFields: [...defaultNullFields, 'userId', 'followers', 'followings', 'isActive'] });
    if (typeof (value) == 'string') return res.status(409).send(value);

    const profileId = req.userinfo.profileId;

    await profiles.update(req.body, {
        where: {
            "id": {
                [Op.eq]: profileId
            },
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

/* 
* /:profileUUID - DELETE - delete a profile
* @check check jwt signature, match profile uuid from payload
*/
app.delete("/:profileUUID", jwtcheck, authorizeProfileUUID, async (req, res) => {
    const profileId = req.userinfo.profileId;

    profiles.destroy({
        where: {
            "id": {
                [Op.eq]: profileId,
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

/* 
* /:profileUUID/hashtags - GET - get all hashtags in a profile
*/
app.get("/:profileUUID/hashtags", async (req, res) => {
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

    if (result == null) {
        return res.status(409).send("invalid resource");
    }

    const profileId = result.id;

    await hashtagsOnProfiles.findAll({
        where: {
            "profileId": {
                [Op.eq]: profileId,
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
* /:profileUUID/hashtags/:hashtagUUID - POST - add a hashtag in a profile
* @check check jwt signature, match profile uuid from payload
*/
app.post("/:profileUUID/hashtags/:hashtagUUID", jwtcheck, authorizeProfileUUID, async (req, res) => {
    const profileId = req.userinfo.profileId;
    const hashtagUUID = req.params.hashtagUUID;
    let error = false;

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

    if (result == null) {
        return res.status(409).send("invalid resource");
    }

    const hashtagId = result.id;

    await hashtagsOnProfiles.create({ "profileId": profileId, "hashtagId": hashtagId })
        .then((result) => {
            res.send("SUCCESS");
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

/* 
* /:profileUUID/hashtags/:hasgtagUUID - GET - delete a hashtag on a profile
* @check check jwt signature, match profile uuid from payload
*/
app.delete("/:profileUUID/hashtags/hashtagUUID", jwtcheck, authorizeProfileUUID, async (req, res) => {
    const profileId = req.userinfo.profileId;
    const hashtagUUID = req.params.hashtagUUID;
    let error = false;

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

    if (result == null) {
        return res.status(409).send("invalid resource");
    }

    await hashtagsOnProfiles.destroy({
        where: {
            "profileId": {
                [Op.eq]: profileId,
            },
            "hashtagId": {
                [Op.eq]: hashtagId,
            },
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

/* 
* /:profileUUID/bookmarks/posts - GET - get all bookmarked posts of user
* @check check jwt signature, match profileuuid with payload
*/
app.get("/:profileUUID/bookmarks/posts", jwtcheck, authorizeProfileUUID, async (req, res) => {
    const profileId = req.userinfo.profileId;

    await bookmarksOnPost.findAll({
        where: {
            "profileId": profileId,
        },
        attributes: ['id'],
    })
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            res.send(err);
        });
});

module.exports = app;