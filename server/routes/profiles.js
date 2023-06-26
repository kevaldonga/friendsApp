const app = require('express').Router();
const bodyParser = require('body-parser');
const { profiles, hashtagsOnProfiles } = require('../models');
const { Op } = require('sequelize');

app.use(bodyParser.json());

/* 
* /:profileId - GET - get a profile
*/
app.get("/:profileId", async (req, res) => {
    const profileId = req.params.profileId;

    result = await profiles.findOne({
        where: {
            "id": {
                [Op.eq]: profileId,
            },
        }
    });

    res.send(result);
});

/* 
* / - POST - create a profile
*/
app.post("/", async (req, res) => {
    result = await profiles.create(req.body);

    res.send(result ? "profile created successfully!!" : "error occured");
});

/*
* /:profileId - PUT - update a profile
*/
app.put("/:profileId", async (req, res) => {
    const profileId = req.params.profileId;

    result = await profiles.update(req.body, {
        where: {
            "id": profileId,
        }
    });

    res.send(result);
});

/* 
* /:profileId - DELETE - delete a profile
*/
app.delete("/:profileId", async (req, res) => {
    const profileId = req.params.profileId;

    result = profiles.destroy({
        where: {
            "id": {
                [Op.eq]: profileId,
            }
        }
    });

    res.send(result ? "profile deleted successfully!!" : "error occured");
});

/* 
* /:profileId/hashtags - GET - get all hashtags in a profile
*/
app.get("/:profileId/hashtags", async (req, res) => {
    const profileId = req.params.profileId;

    result = await hashtagsOnProfiles.findAll({
        where: {
            "profileId": {
                [Op.eq]: profileId,
            },
        }
    });

    res.send(result);
});

/*
* /:profileId/hashtags/:hashtagId - POST - add a hashtag in a profile
*/
app.post("/:profileId/hashtags/:hashtagId", async (req, res) => {
    const profileId = req.params.profileId;
    const hasgtagId = req.params.hashtagId;

    result = await hashtagsOnProfiles.create({ "profileId": profileId, "hashtagId": hashtagId });

    res.send(result ? "hashtag added successfully!!" : "error occured");
});

/* 
* /:profileId/hashtags/:hasgtagId - GET - delete a hashtag on a profile
*/
app.delete("/:profileId/hashtags/hashtagId", async (req, res) => {
    const profileId = req.params.profileId;
    const hashtagId = req.params.hashtagId;

    result = await hashtagsOnProfiles.destroy({
        where: {
            "profileId": {
                [Op.eq]: profileId,
            },
            "hashtagId": {
                [Op.eq]: hashtagId,
            },
        }
    });

    res.send(result ? "hashtag deleted successfully!!" : "error occured");
});

module.exports = app;