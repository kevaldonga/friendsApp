const app = require('express').Router();
const bodyParser = require('body-parser');
const { Op } = require('sequelize');
const { stories, hashtagsOnStory, likesOnStory } = require('../models');

app.use(bodyParser.json());

/* 
* / - POST - create a story
*/
app.post("/", async (req, res) => {
    result = await stories.create(req.body);

    res.send(result);
});

/* 
* /:storyId - GET - get a story
*/
app.post("/:storyId", async (req, res) => {
    const storyId = req.params.storyId;

    result = await stories.findOne({
        where: {
            "id": {
                [Op.eq]: storyId,
            }
        }
    });

    res.send(result);
});

/* 
* /profileId/stories - GET - get all stories of a profile
*/
app.get("/profile/:profileId", async (req, res) => {
    const profileId = req.params.profileId;

    result = await stories.findAll({
        where: {
            "profileId": {
                [Op.eq]: profileId,
            }
        }
    });

    res.send(result);
});

/* 
* /:storyId - PUT - update a story
*/
app.put("/:storyId", async (req, res) => {
    const storyId = req.params.storyId;

    result = await stories.update(req.body, {
        where: {
            "id": {
                [Op.eq]: storyId,
            }
        }
    });

    res.send(result ? "story updated successfully!!" : "error occured");
});

/* 
* /:storyId - delete - delete a story
*/
app.delete("/:storyId", async (req, res) => {
    const storyId = req.params.storyId;

    result = await stories.delete({
        where: {
            "id": {
                [Op.eq]: storyId,
            }
        }
    });

    res.send(result ? "story deleted successfully!!" : "error occured");
});

/* 
* /:storyId/hastags - get all hashtags in a story
*/
app.get("/:storyId/hashtags", async (req, res) => {
    const storyId = req.params.storyId;

    result = await hashtagsOnStory.findAll({
        where: {
            "storyId": {
                [Op.eq]: storyId,
            }
        },
    });

    res.send(result);
});

/*
* /:storyId/hashtags/hashtagId - POST - add a hashtag in a story
*/
app.post("/:storyId/hashtags/hashtagId", async (req, res) => {
    const storyId = req.params.storyId;
    const hashtagId = req.params.hashtagId;

    result = await hashtagsOnStory.create({ "storyId": storyId, "hashtagId": hashtagId });

    res.send(result ? "hashtag added successfully!!" : "error occured");
});

/* 
* /:storyId/hastags/:hashtagId - remove a hashtag in a story
*/
app.delete("/:storyId/hashtags/:hashtagId", async (req, res) => {
    const storyId = req.params.storyId;
    const hashtagId = req.params.hashtagId;

    result = await hashtagsOnStory.destory({
        where: {
            "storyId": {
                [Op.eq]: storyId,
            },
            "hashtagId": {
                [Op.eq]: hashtagId,
            },
        }
    });

    res.send(result ? "hashtag removed successfully!!" : "error occured");
});

/* 
* /:storyId/likes - GET - get likes on a story
*/
app.get("/:storyId/likes", async (req, res) => {
    const storyId = req.params.storyId;

    result = await likesOnStory.findAll({
        where: {
            "storyId": {
                [Op.eq]: storyId,
            }
        }
    });

    res.send(result);
});

/* 
* /:storyId/like/:profileId - POST - like on a story
*/
app.post("/:storyId/likes/:profileId", async (req, res) => {
    const storyId = req.params.storyId;
    const profileId = req.params.profileId;

    result = await likesOnStory.create({ "storyId": storyId, "profileId": profileId });

    res.send(result);
});

/* 
* /:storyId/likes/:profileId - DELETE - unlike on a story
*/
app.delete("/:storyId/likes/:profileId", async (req, res) => {
    const storyId = req.params.storyId;
    const profileId = req.params.profileId;

    result = await likesOnStory.destroy({
        where: {
            "storyId": {
                [Op.eq]: storyId
            },
            "profileId": {
                [Op.eq]: profileId
            }
        }
    });

    res.send(result);
});

module.exports = app;