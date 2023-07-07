const app = require('express').Router();
const bodyParser = require('body-parser');
const { profiles, hashtagsOnProfiles } = require('../models');
const { Op } = require('sequelize');
const { nullCheck, defaultNullFields } = require('./validations/nullcheck');

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
            res.send(result);
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

/* 
* / - POST - create a profile
*/
app.post("/", async (req, res) => {
    value = nullCheck(body, { nonNullableFields: ['username', 'userId'], mustBeNullFields: [...defaultNullFields, 'isActive', 'followers', 'followings'] });
    if (typeof (value) == 'string') return res.status(409).send(value);

    await profiles.create(req.body)
        .then((result) => {
            res.send("profile created successfully!!");
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

/*
* /:profileUUID - PUT - update a profile
*/
app.put("/:profileUUID", async (req, res) => {
    value = nullCheck(body, { mustBeNullFields: [...defaultNullFields, 'userId', 'followers', 'followings', 'isActive'] });
    if (typeof (value) == 'string') return res.status(409).send(value);

    const profileUUID = req.params.profileUUID;

    await profiles.update(req.body, {
        where: {
            "uuid": profileUUID,
        }
    })
        .then((result) => {
            res.send("profile updated successfully!!");
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

/* 
* /:profileUUID - DELETE - delete a profile
*/
app.delete("/:profileUUID", async (req, res) => {
    const profileUUID = req.params.profileUUID;

    profiles.destroy({
        where: {
            "uuid": {
                [Op.eq]: profileUUID,
            }
        }
    })
        .then((result) => {
            res.send("profile deleted successfully!!");
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
*/
app.post("/:profileUUID/hashtags/:hashtagUUID", async (req, res) => {
    const profileUUID = req.params.profileUUID;
    const hashtagUUID = req.params.hashtagUUID;
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

    await hashtagsOnProfiles.create({ "profileId": profileId, "hashtagId": hashtagId })
        .then((result) => {
            res.send("hashtag added successfully!!");
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

/* 
* /:profileUUID/hashtags/:hasgtagUUID - GET - delete a hashtag on a profile
*/
app.delete("/:profileUUID/hashtags/hashtagUUID", async (req, res) => {
    const profileUUID = req.params.profileUUID;
    const hashtagUUID = req.params.hashtagUUID;
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
            res.send("hashtag removed successfully!!");
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

module.exports = app;