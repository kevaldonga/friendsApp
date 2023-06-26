const app = require('express').Router();
const bodyParser = require('body-parser');
const { Op } = require('sequelize');
const { userRelation } = require('../models');

app.use(bodyParser.json());

/* 
* /:profileId/followers - GET - get all followers of a profile
*/
app.get("/:profileId/followers", async (req, res) => {
    const profileId = req.params.profileId;

    result = await userRelation.findAll({
        where: {
            "beingFollowedProfileId": {
                [Op.eq]: profileId,
            }
        }
    });

    res.send(result);
});

/* 
* /:profileId/followers - GET - get all followings of a profile
*/
app.get("/:profileId/followings", async (req, res) => {
    const profileId = req.params.profileId;

    result = await userRelation.findAll({
        where: {
            "followerProfileId": {
                [Op.eq]: profileId,
            },
        }
    });

    res.send(result);
});

/* 
* /:followerProfileId/follows/:beingFollowedProfileId - POST - user follows other user
*/
app.post("/:followerProfileId/follows/:beingFollowedProfileId", async (req, res) => {
    const followerProfileId = req.body.followerProfileId;
    const beingFollowedProfileId = req.body.beingFollowedProfileId;

    // update friendsRelation table
    result = await friendsRelation.create({
        "beingFollowedProfileId": beingFollowedProfileId,
        "followerProfileId": followerProfileId,
    });

    res.send(result ? "operation successful!!" : "error occured");

    // increment  following count in profile
    await profiles.increment("followings", {
        where: {
            "profileId": {
                [Op.eq]: profileId,
            },
        }
    });

    // increment follower count in other profile
    await profiles.increment("followers", {
        where: {
            "profileId": {
                [Op.eq]: beingFollowedProfileId,
            },
        }
    });

});

/* 
* /:followerProfileId/follows/:beingFollowedProfileId - DELETE - user unfollows other user
*/
app.delete("/:followerProfileId/unfollows/:beingFollowedProfileId", async (req, res) => {
    const followerProfileId = req.body.followerProfileId;
    const beingFollowedProfileId = req.body.beingFollowedProfileId;

    // update friendsRelation table
    let result = await friendsRelation.destroy({
        "followerProfileId": followerProfileId,
        "beingFollowedProfileId": beingFollowedProfileId,
    });

    res.send(result ? "operation successful!!" : "error occured");

    // decrement following count in profile
    await profiles.decrement("followings", {
        by: 1, where: {
            "profileId": {
                [Op.eq]: followerProfileId,
            },
        }
    });

    // decrement follower count in other profile
    await profiles.decrement("followers", {
        by: 1, where: {
            "profileId": {
                [Op.eq]: beingFollowedProfileId,
            },
        }
    });

});

module.exports = app;