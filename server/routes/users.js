const app = require('express').Router();
const bodyParser = require('body-parser');
const { Op } = require('sequelize');
const { users } = require('../models');

app.use(bodyParser.json());

/* 
* /:uid - GET - get the user by uid
*/
app.get("/:uid", async (req, res) => {
    const uid = req.params.uid;

    result = await users.findOne({
        where: {
            "uid": {
                [Op.eq]: uid,
            }
        }
    });

    res.send(result);
});

/* 
* / - POST - create the user
*/
app.post("/", async (req, res) => {
    result = await users.create(req.body);

    res.send(result ? "user created successfully!!" : "error occured");
});

/* 
* / - PUT - update the user
*/
app.put("/:uid", async (req, res) => {
    const uid = req.params.uid;

    result = await users.update(req.body, {
        where: {
            "uid": {
                [Op.eq]: uid,
            }
        }
    });

    res.send(result ? "user updated successfully!!" : "error occured");
});

/* 
* / - DELETE - delete the user
*/
app.delete("/:uid", async (req, res) => {
    const uid = req.params.uid;

    result = await users.destroy(req.body, {
        where: {
            "uid": {
                [Op.eq]: uid,
            }
        }
    });

    res.send(result ? "user deleted successfully!!" : "error occured");
});

module.exports = app;