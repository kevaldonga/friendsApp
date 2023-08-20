const app = require('express')();
const Op = require('sequelize');
const bodyParser = require('body-parser');
const { hashtags, hashtagModerators, users } = require('../models');
const { nullCheck, defaultNullFields } = require('./validations/nullcheck');
const { jwtcheck, authorizeuserUUID } = require('../middleware/jwtcheck');
const { adminCheck, moderatorCheck } = require('../middleware/rolecheck');

app.use(bodyParser.json());

/* 
* /:userUUID - POST - create a hashtag
* @check check jwt signature, match userUUID from payload
*/
app.post("/:userUUID", jwtcheck, authorizeuserUUID, adminCheck, async (req, res) => {
    value = nullCheck(req.body, { nonNullableFields: ['tag', 'description', 'color', 'image'], mustBeNullFields: defaultNullFields });
    if (typeof (value) != 'string') return res.status(409).send(value);

    await hashtags.create(req.body)
        .then((result) => {
            res.send("SUCCESS");
        })
        .catch((err) => {
            res.status(403).send(err);
        });
});

/* 
* /:userUUID/tag/:tagUUID - PUT - update a hashtag
* @check check jwt signature, match userUUID from payload
*/
app.put("/:userUUID/tag/:tagUUID", jwtcheck, authorizeuserUUID, moderatorCheck, async (req, res) => {
    value = nullCheck(req.body, { mustBeNullFields: [...defaultNullFields, 'tag'] });
    if (typeof (value) != 'string') return res.status(409).send(value);

    const tagUUID = req.params.tagUUID;

    await hashtags.update(req.body, {
        where: {
            "uuid": {
                [Op.eq]: tagUUID,
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
            res.status(403).send(err);
        });
});

/* 
* /:userUUID/tag/:tagUUID - DELETE - delete a hashtag
* @check check jwt signature, match userUUID from payload
*/
app.delete("/:userUUID/tag/:tagUUID", jwtcheck, authorizeuserUUID, moderatorCheck, async (req, res) => {
    const tagUUID = req.params.tagUUID;

    await hashtags.delete({
        where: {
            "uuid": {
                [Op.eq]: tagUUID,
            },
        },
    })
        .then((result) => {
            res.send("SUCCESS");
        })
        .catch((err) => {
            res.status(403).send(err);
        });
});

/* 
* /:tagUUID - GET - get a hashtag
*/
app.get("/:tagUUID", async (req, res) => {
    const tagUUID = req.params.tagUUID;

    await hashtags.get({
        where: {
            "uuid": {
                [Op.eq]: tagUUID,
            },
        },
    })
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            res.status(403).send(err);
        });
});

/* 
* /:hashtagUUID/moderators/:userUUID - POST - add moderator to a hashtag
* @check check jwt signature
*/
app.post("/:hashtagUUID/moderators/:userUUID", jwtcheck, adminCheck, async (req, res) => {
    const userUUID = req.params.userUUID;
    const hashtagUUID = req.params.hashtagUUID;

    let error = false;

    result = await users.findOne({
        where: {
            "uuid": {
                [Op.eq]: userUUID,
            },
        },
        attributes: ['id'],
    })
        .catch((err) => {
            error = true;
            res.status(409).send(err.message);
        });

    if (error) return;

    if (result == null) {
        return res.status(409).send("invalid resource");
    }

    const userId = result.id;

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
            res.status(409).send(err.message);
        });

    if (error) return;

    if (result == null) {
        return res.status(409).send("invalid resource");
    }

    const hashtagId = result.id;

    await hashtagModerators.create({
        "userId": userId,
        "hashtagId": hashtagId,
    })
        .then((result) => {
            res.send("SUCCESS");
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

/* 
* /:hashtagUUID/moderators/:userUUID - DELETE - remove moderator from a hashtag
* @check check jwt signature
*/
app.delete("/:hashtagUUID/moderators/:userUUID", jwtcheck, adminCheck, async (req, res) => {
    const userUUID = req.params.userUUID;
    const hashtagUUID = req.params.hashtagUUID;

    let error = false;

    result = await users.findOne({
        where: {
            "uuid": {
                [Op.eq]: userUUID,
            },
        },
        attributes: ['id'],
    })
        .catch((err) => {
            error = true;
            res.status(409).send(err.message);
        });

    if (error) return;

    if (result == null) {
        return res.status(409).send("invalid resource");
    }

    const userId = result.id;

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
            res.status(409).send(err.message);
        });

    if (error) return;

    if (result == null) {
        return res.status(409).send("invalid resource");
    }

    const hashtagId = result.id;

    await hashtagModerators.destroy({
        where: {
            "userId": {
                [Op.eq]: userId,
            },
            "hashtagId": {
                [Op.eq]: hashtagId
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
 /:hashtagUUID/moderators - GET - get all hashtag moderators
*/
app.get("/:hashtagUUID/moderators", async (req, res) => {
    const offset = req.query.page === undefined ? 0 : parseInt(req.query.page);
    const limit = req.query.limit === undefined ? 10 : parseInt(req.query.limit);

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

            res.status(409).send(err.message);
        });

    if (error) return;

    if (result == null) {
        return res.status(409).send("invalid resource");
    }

    const hashtagId = result.id;

    await hashtagModerators.findAll({
        where: {
            "hashtagId": {
                [Op.eq]: hashtagId,
            },
        },
        include: "users",
        limit: limit,
        offset: offset,
    })
        .then((result) => {
            res.send(result.users);
        })
        .catch((err) => {
            res.status(409).send(err.message);
        });

});