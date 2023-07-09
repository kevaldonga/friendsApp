const app = require('express').Router();
const bodyParser = require('body-parser');
const { Op } = require('sequelize');
const { users } = require('../models');
const { nullCheck } = require('./validations/nullcheck');
const { jwt } = require('jsonwebtoken');
const { JWTPRIVATEKEY } = require('./../config/globals');
const { jwtcheck, authorizeuid } = require('../middleware/jwtcheck');

app.use(bodyParser.json());

/* 
* /:uid - GET - get the user by uid
* @check check jwt signature, match uid from payload
*/
app.get("/:uid", jwtcheck, authorizeuid, async (req, res) => {
    const uid = req.params.uid;

    await users.findOne({
        where: {
            "uid": {
                [Op.eq]: uid,
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
* /generatetoken/:uid - GET - generate the json web token
*/
app.get("/generatetoken/:uid", async (req, res) => {
    const uid = req.params.uid;
    let error = false;

    result = await users.findOne({
        where: {
            "uid": {
                [Op.eq]: uid,
            },
        },
        include: "profiles"
    })
        .catch((err) => {
            error = false;
            res.status(403).send(err.message);
        });

    if (error) return;

    const uuid = result.uuid;
    const profileId = result.profiles.id;
    const profileUUID = result.profiles.uuid;

    const userObj = {
        "uid": uid,
        "userUUID": uuid,
        "profileId": profileId,
        "profileUUID": profileUUID,
    };

    token = jwt.sign(userObj, JWTPRIVATEKEY, { 'expiresIn': '30D' });

    res.send(token);
});

/* 
* / - POST - create the user
* @check check jwt signature
*/
app.post("/", jwtcheck, async (req, res) => {
    value = nullCheck(body, { nonNullableFields: ['uid', 'email'], mustBeNullFields: [...defaultNullFields] });
    if (typeof (value) == 'string') return res.status(409).send(value);

    await users.create(req.body)
        .then((result) => {
            res.send("user created successfully!!");
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

/* 
* / - PUT - update the user
* @check check jwt signature, match uid from payload
*/
app.put("/:uid", jwtcheck, authorizeuid, async (req, res) => {
    value = nullCheck(body, { mustBeNullFields: [...defaultNullFields, 'uid'] });
    if (typeof (value) == 'string') return res.status(409).send(value);

    const uid = req.params.uid;

    await users.update(req.body, {
        where: {
            "uid": {
                [Op.eq]: uid,
            }
        }
    })
        .then((result) => {
            res.send("user updated successfully!!");
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

/* 
* / - DELETE - delete the user
* @check check jwt signature, match uid from payload
*/
app.delete("/:uid", jwtcheck, authorizeuid, async (req, res) => {
    const uid = req.params.uid;

    await users.destroy({
        where: {
            "uid": {
                [Op.eq]: uid,
            }
        }
    })
        .then((result) => {
            res.send("user deleted successfully!!");
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

module.exports = app;