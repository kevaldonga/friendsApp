const app = require('express').Router();
const bodyParser = require('body-parser');
const { Op } = require('sequelize');
const { users } = require('../models');
const { nullCheck } = require('./validations/nullcheck');

app.use(bodyParser.json());

/* 
* /:uid - GET - get the user by uid
*/
app.get("/:uid", async (req, res) => {
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
* / - POST - create the user
*/
app.post("/", async (req, res) => {
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
*/
app.put("/:uid", async (req, res) => {
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
*/
app.delete("/:uid", async (req, res) => {
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