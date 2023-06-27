const app = require('express').Router();
const bodyParser = require('body-parser');
const { chatrooms, chats } = require('../models');
const Op = require('sequelize');

app.use(bodyParser.json());

/*
* / - POST - create a chatroom
*/
app.post("/", async (req, res) => {
    result = await chatrooms.create(req.body);

    res.send(result ? "chatroom created successfully!!" : "error occured");
});

/* 
* /:chatroomId - GET - get a chatroom
*/
app.get("/:chatroomId", async (req, res) => {
    const chatroomId = req.params.chatroomId;

    result = await chatrooms.findOne({
        where: {
            "id": {
                [Op.eq]: chatroomId,
            }
        }
    });

    res.send(result);
});

/* 
* /:chatroomId - PUT - update a chatroom
*/
app.put("/:chatroomId", async (req, res) => {
    const chatroomId = req.params.chatroomId;

    result = await chatrooms.update(req.body, {
        where: {
            "id": {
                [Op.eq]: chatroomId,
            }
        }
    });
});

/* 
* /:chatroomId - DELETE - delete a chatroom
*/
app.delete("/:chatroomId", async (req, res) => {
    const chatroomId = req.params.chatroomId;

    result = await chatroomId.destroy({
        where: {
            "id": {
                [Op.eq]: chatroomId,
            }
        },
    });

    res.send(result ? "chatroom deleted succesfully!!" : "error occured");
});

/* 
* /:chatroomId/chats - GET - get all chats of chatroom
*/
app.get("/:chatroomId/chats", async (req, res) => {
    const chatroomId = req.params.chatroomId;

    result = await chats.findAll({
        where: {
            "chatroomId": {
                [Op.eq]: chatroomId,
            }
        }
    });

    res.send(result);
});

/* 
* /:chatroomId/chats/ - POST - add chat in chatroom
*/
app.post("/:chatroomId/chats/", async (req, res) => {
    const chatroomId = req.params.chatroomId;

    result = await chats.create(req.body);

    res.send(result ? "chat added successfully!!" : "error occured");
});

/* 
* /:chatroomId/chats/:chatId - DELETE - remove a chat in chatroom
*/
app.delete("/:chatroomId/chats/:chatId", async (req, res) => {
    const chatroomId = req.params.chatroomId;
    const chatId = req.params.chatId;

    result = await chats.destroy({
        where: {
            "chatroomId": {
                [Op.eq]: chatroomId,
            },
            "chatId": {
                [Op.eq]: chatId,
            }
        }
    });

    res.send(result);
});

module.exports = app;