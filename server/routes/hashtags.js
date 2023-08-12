const app = require('express')();
const Op = require('sequelize');
const bodyParser = require('body-parser');
const { hashtags } = require('../models');
const { nullCheck, defaultNullFields } = require('./validations/nullcheck');
const { jwtcheck, authorizeuserUUID } = require('../middleware/jwtcheck');

app.use(bodyParser.json());

/* 
* /:userUUID - POST - create a hashtag
* @check check jwt signature, match userUUID from payload
*/
app.post("/:userUUID", jwtcheck, authorizeuserUUID, async (req, res) => {
    value = nullCheck(req.body, { nonNullableFields: ['tag', 'description', 'color', 'image'], mustBeNullFields: defaultNullFields });
    if (typeof (value) != 'string') return res.status(409).send(value);

    await hashtags.create(req.body)
        .then((result) => {
            res.send("hashtag created successfully!!");
        })
        .catch((err) => {
            res.status(403).send(err);
        });
});

/* 
* /:userUUID/tag/:tagUUID - PUT - update a hashtag
* @check check jwt signature, match userUUID from payload
*/
app.put("/:userUUID/tag/:tagUUID", jwtcheck, authorizeuserUUID, async (req, res) => {
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
            res.send("hashtag updated successfully!!");
        })
        .catch((err) => {
            res.status(403).send(err);
        });
});

/* 
* /:userUUID/tag/:tagUUID - DELETE - delete a hashtag
* @check check jwt signature, match userUUID from payload
*/
app.delete("/:userUUID/tag/:tagUUID", jwtcheck, authorizeuserUUID, async (req, res) => {
    const tagUUID = req.params.tagUUID;

    await hashtags.delete({
        where: {
            "uuid": {
                [Op.eq]: tagUUID,
            },
        },
    })
        .then((result) => {
            res.send("hashtag deleted successfully!!");
        })
        .catch((err) => {
            res.status(403).send(err);
        });
});

/* 
* /:tagUUID - GET - get a hashtag
*/
app.post("/:tagUUID", async (req, res) => {
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