const app = require('express').Router();
const bodyParser = require('body-parser');
const { chatrooms, chats } = require('../models');
const Op = require('sequelize');
const { nullCheck, defaultNullFields } = require('./validations/nullcheck');
const { jwtcheck, authorizeuid } = require('../middleware/jwtcheck');

app.use(bodyParser.json());

/*
* /:uid - POST - create a chatroom
* @check check jwt signature, match uid from payload
*/
app.post("/:uid", jwtcheck, authorizeuid, async (req, res) => {
    value = nullCheck(req.body, { nonNullableFields: ['profileId1', 'profileId2'], mustBeNullFields: [...defaultNullFields, 'profileId1', 'profileId2'] });
    if (typeof (value) == 'string') return res.status(409).send(value);

    await chatrooms.create(req.body)
        .then((result) => {
            res.send("SUCCESS");
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

/* 
* /:chatroomUUID - GET - get a chatroom
* @check check jwt signature
*/
app.get("/:chatroomUUID", jwtcheck, async (req, res) => {
    const chatroomUUID = req.params.chatroomUUID;

    await chatrooms.findOne({
        where: {
            "uuid": {
                [Op.eq]: chatroomUUID,
            }
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
* /:chatroomUUID - PUT - update a chatroom
* @check check jwt signature
*/
app.put("/:chatroomUUID", jwtcheck, async (req, res) => {
    value = nullCheck(req.body, { nonNullableFields: ['background'], mustBeNullFields: [...defaultNullFields, 'profileId1', 'profileId2'] });
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
* /:chatroomUUID - DELETE - delete a chatroom
* @check check jwt signature
*/
app.delete("/:chatroomUUID", jwtcheck, async (req, res) => {
    const chatroomUUID = req.params.chatroomUUID;

    await chatrooms.destroy({
        where: {
            "id": {
                [Op.eq]: chatroomUUID,
            }
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
* /:chatroomUUID/chats - GET - get all chats of chatroom
* @check check jwt signature
*/
app.get("/:chatroomUUID/chats", jwtcheck, async (req, res) => {
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

    if (result == null) {
        return res.status(409).send("invalid resource");
    }

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
* @check check jwt signature
*/
app.post("/:chatroomUUID/chats/", jwtcheck, async (req, res) => {
    value = nullCheck(req.body, { nonNullableFields: ['profileId'] });
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

    if (result == null) {
        return res.status(409).send("invalid resource");
    }

    const chatroomId = result.id;

    req.body.chatroomId = chatroomId;

    await chats.create(req.body)
        .then((result) => {
            res.send("SUCCESS");
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

/* 
* /:chatroomUUID/chats/:chatUUID - DELETE - remove a chat in chatroom
* @check check jwt signature
*/
app.delete("/:chatroomUUID/chats/:chatUUID", jwtcheck, async (req, res) => {
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

    if (result == null) {
        return res.status(409).send("invalid resource");
    }

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
            if (result == 0) {
                return res.status(409).send("invalid resource");
            }
            res.send("SUCCESS");
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });
});

module.exports = app;