const app = require('express').Router();
const bodyParser = require('body-parser');
const { Op } = require('sequelize');
const { userRelation, profiles } = require('../models');
const { jwtcheck, authorizeProfileUUID } = require('../middleware/jwtcheck');

app.use(bodyParser.json());

/* 
* /:profileUUID/followers - GET - get all followers of a profile
*/
app.get("/:profileUUID/followers", async (req, res) => {
    const profileUUID = req.params.profileUUID;
    const offset = req.query.page === undefined ? 0 : parseInt(req.query.page);
    const limit = req.query.limit === undefined ? 10 : parseInt(req.query.limit);
    let error = false;

    result = await profiles.findOne({
        where: {
            "uuid": {
                [Op.eq]: profileUUID,
            },
        },
        attributes: ['id'],
    })
        .catch((err) => {
            error = true;
            res.status(403).send(err.message);
        });

    if (error) return;

    const profileId = result.id;

    await userRelation.findAll({
        where: {
            "beingFollowedProfileId": {
                [Op.eq]: profileId,
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
* /:profileUUID/followers - GET - get all followings of a profile
*/
app.get("/:profileUUID/followings", async (req, res) => {
    const profileUUID = req.params.profileUUID;
    const offset = req.query.page === undefined ? 0 : parseInt(req.query.page);
    const limit = req.query.limit === undefined ? 10 : parseInt(req.query.limit);
    let error = false;

    result = await profiles.findOne({
        where: {
            "uuid": {
                [Op.eq]: profileUUID,
            },
        },
        attributes: ['id'],
    })
        .catch((err) => {
            error = true;
            res.status(403).send(err.message);
        });

    if (error) return;

    const profileId = result.id;

    result = await userRelation.findAll({
        where: {
            "followerProfileId": {
                [Op.eq]: profileId,
            },
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
* /:profileUUID/follows/:beingFollowedProfileUUID - POST - user follows other user
* @check check jwt signature, match profile uuid from payload
*/
app.post("/:profileUUID/follows/:beingFollowedProfileUUID", jwtcheck, authorizeProfileUUID, async (req, res) => {
    const followerProfileId = req.userinfo.profileId;
    const beingFollowedProfileUUID = req.params.beingFollowedProfileUUID;
    let error = false;

    result = await profiles.findOne({
        where: {
            "uuid": {
                [Op.eq]: beingFollowedProfileUUID,
            },
        },
        attributes: ['id'],
    }).catch((err) => {
        error = true;
        res.status(403).send(err.message);
    });

    if (error) return;

    const beingFollowedProfileId = result.id;

    // increment  following count in profile
    await profiles.increment("followings", {
        where: {
            "profileId": {
                [Op.eq]: followerProfileId,
            },
        }
    })
        .catch((err) => {
            error = true;
            res.status(403).send(err.message);
        });

    if (error) return;

    // increment follower count in other profile
    await profiles.increment("followers", {
        where: {
            "profileId": {
                [Op.eq]: beingFollowedProfileId,
            },
        }
    })
        .catch((err) => {
            error = true;
            res.status(403).send(err.message);
        });

    if (error) return;

    // update friendsRelation table
    await friendsRelation.create({
        "beingFollowedProfileId": beingFollowedProfileId,
        "followerProfileId": followerProfileId,
    })
        .then((result) => {
            res.send("SUCCESS");
        })
        .catch((err) => {
            res.status(403).send(err.message);
        });

});

/* 
* /:profileUUID/follows/:beingFollowedProfileUUID - DELETE - user unfollows other user
* @check check jwt signature, match profile uuid from payload
*/
app.delete("/:profileUUID/unfollows/:beingFollowedProfileUUID", jwtcheck, authorizeProfileUUID, async (req, res) => {
    const followerProfileId = req.userinfo.profileId;
    const beingFollowedProfileUUID = req.params.beingFollowedProfileUUID;
    let error = false;

    result = await profiles.findOne({
        where: {
            "uuid": {
                [Op.eq]: beingFollowedProfileUUID,
            },
        },
        attributes: ['id'],
    })
        .catch((err) => {
            error = true;
            res.status(403).send(err.message);
        });

    if (error) return;

    const beingFollowedProfileId = result.id;

    // decrement following count in profile
    await profiles.decrement("followings", {
        by: 1, where: {
            "profileId": {
                [Op.eq]: followerProfileId,
            },
        }
    })
        .catch((err) => {
            error = true;
            res.status(403).send(err.message);
        });

    if (error) return;

    // decrement follower count in other profile
    await profiles.decrement("followers", {
        by: 1, where: {
            "profileId": {
                [Op.eq]: beingFollowedProfileId,
            },
        }
    })
        .catch((err) => {
            error = true;
            res.status(403).send(err.message);
        });

    if (error) return;

    // update friendsRelation table
    await friendsRelation.destroy({
        "followerProfileId": followerProfileId,
        "beingFollowedProfileId": beingFollowedProfileId,
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