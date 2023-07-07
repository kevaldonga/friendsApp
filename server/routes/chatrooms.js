const app = require('express').Router();
const bodyParser = require('body-parser');
const { chatrooms, chats } = require('../models');
const Op = require('sequelize');
const { nullCheck, defaultNullFields } = require('./validations/nullcheck');

app.use(bodyParser.json());

/*
* / - POST - create a chatroom
*/
app.post("/", async (req, res) => {
    value = nullCheck(body, { nonNullableFields: ['profileId1', 'profileId2'], mustBeNullFields: [...defaultNullFields, 'profileId1', 'profileId2'] });
    if (typeof (value) == 'string') return res.status(409).send(value);

    await chatrooms.create(req.body)
        .then((result) => {
            res.send("chatroom created successfully!!");
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

/* 
* /:chatroomUUID - GET - get a chatroom
*/
app.get("/:chatroomUUID", async (req, res) => {
    const chatroomUUID = req.params.chatroomUUID;

    await chatrooms.findOne({
        where: {
            "uuid": {
                [Op.eq]: chatroomUUID,
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
* /:chatroomUUID - PUT - update a chatroom
*/
app.put("/:chatroomUUID", async (req, res) => {
    value = nullCheck(body, { nonNullableFields: ['background'], mustBeNullFields: [...defaultNullFields, 'profileId1', 'profileId2'] });
    if (typeof (value) == 'string') return res.status(409).send(value);

    const chatroomUUID = req.params.chatroomUUID;

    await chatrooms.update(req.body, {
        where: {
            "uuid": {
                [Op.eq]: chatroomUUID,
            }
        }
    })
        .then((result) => {
            res.send("chatroom updated successfully!!");
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

/* 
* /:chatroomUUID - DELETE - delete a chatroom
*/
app.delete("/:chatroomUUID", async (req, res) => {
    const chatroomUUID = req.params.chatroomUUID;

    await chatrooms.destroy({
        where: {
            "id": {
                [Op.eq]: chatroomUUID,
            }
        },
    })
        .then((result) => {
            res.send("chatroom deleted successfully!!");
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

/* 
* /:chatroomUUID/chats - GET - get all chats of chatroom
*/
app.get("/:chatroomUUID/chats", async (req, res) => {
    const chatroomUUID = req.params.chatroomUUID;
    const offset = req.query.page === undefined ? 0 : parseInt(req.query.page);
    const limit = req.query.limit === undefined ? 10 : parseInt(req.query.limit);
    let error = false;

    result = await chatrooms.findOne({
        where: {
            "uuid": {
                [Op.eq]: chatroomUUID,
            },
        },
        attributes: ['id'],
    })
        .catch((err) => {
            error = true;
            res.status(403).send(err.message);
        });

    if (error) return;

    const chatroomId = result.id;

    await chats.findAll({
        where: {
            "chatroomId": {
                [Op.eq]: chatroomId,
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
* /:chatroomUUID/chats/ - POST - add chat in chatroom
*/
app.post("/:chatroomUUID/chats/", async (req, res) => {
    value = nullCheck(body, { nonNullableFields: ['profileId'] });
    if (typeof (value) == 'string') return res.status(409).send(value);
    let error = false;

    const chatroomUUID = req.params.chatroomUUID;

    result = await chatrooms.findOne({
        where: {
            "uuid": {
                [Op.eq]: chatroomUUID,
            },
        },
        attributes: ['id'],
    })
        .catch((err) => {
            error = true;
            res.status(403).send(err.message);
        });

    if (error) return;

    const chatroomId = result.id;

    req.body.chatroomId = chatroomId;

    await chats.create(req.body)
        .then((result) => {
            res.send("chat added successfully!!");
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

/* 
* /:chatroomUUID/chats/:chatUUID - DELETE - remove a chat in chatroom
*/
app.delete("/:chatroomUUID/chats/:chatUUID", async (req, res) => {
    const chatroomUUID = req.params.chatroomUUID;
    const chatUUID = req.params.chatUUID;
    let error = false;

    result = await chatrooms.findOne({
        where: {
            "uuid": {
                [Op.eq]: chatroomUUID,
            },
        },
        attributes: ['id'],
    })
        .catch((err) => {
            error = true;
            res.status(403).send(err.message);
        });

    if (error) return;

    const chatroomId = result.id;

    await chats.destroy({
        where: {
            "chatroomId": {
                [Op.eq]: chatroomId,
            },
            "uuid": {
                [Op.eq]: chatUUID,
            },
        },
    })
        .then((result) => {
            res.send("chat removed successfully!!");
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

module.exports = app;