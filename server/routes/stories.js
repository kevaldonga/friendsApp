const app = require("express").Router();
const bodyParser = require("body-parser");
const { Op } = require("sequelize");
const {
  stories,
  hashtagsOnStory,
  likesOnStory,
  profiles,
} = require("../models");
const { nullCheck } = require("./validations/nullcheck");
const {
  jwtcheck,
  authorizeuid,
  authorizeProfileUUID,
} = require("../middleware/jwtcheck");

app.use(bodyParser.json({ limit: '1mb' }));

/*
 * / - POST - create a story
 * @check check jwt signature, match uid from payload
 */
app.post("/:uid", jwtcheck, authorizeuid, async (req, res) => {
  value = nullCheck(req.body, {
    nonNullableFields: ["profileId", "media"],
    mustBeNullFields: [...defaultNullFields, "likesCount"],
  });
  if (typeof value == "string") return res.status(409).send({ error: true, res: value });

  await stories
    .create(req.body)
    .then((result) => {
      res.send({ error: false, res: "SUCCESS" });
    })
    .catch((err) => {
      res.status(403).send({ error: true, res: err.message, errObj: err });
    });
});

/*
 * /:storyUUID - GET - get a story
 */
app.post("/:storyUUID", async (req, res) => {
  const storyUUID = req.params.storyUUID;
  let error = false;

  result = await stories
    .findOne({
      where: {
        uuid: {
          [Op.eq]: storyUUID,
        },
      },
      attributes: ["id"],
    })
    .catch((err) => {
      error = true;
      res.status(403).send({ error: true, res: err.message, errObj: err });
    });

  if (error) return;

  if (result == null) {
    return res.status(409).send({ error: true, res: "invalid resource" });
  }

  const storyId = result.id;

  await stories
    .findOne({
      where: {
        id: {
          [Op.eq]: storyId,
        },
      },
    })
    .then((result) => {
      if (result == null) {
        return res.status(409).send({ error: true, res: "invalid resource" });
      }
      res.send({ error: false, obj: result, res: "SUCCESS" });
    })
    .catch((err) => {
      res.status(403).send({ error: true, res: err.message, errObj: err });
    });
});

/*
 * /profileUUID/stories - GET - get all stories of a profile
 */
app.get("/profile/:profileUUID", async (req, res) => {
  const profileUUID = req.params.profileUUID;
  const offset = req.query.page === undefined ? 0 : parseInt(req.query.page);
  const limit = req.query.limit === undefined ? 10 : parseInt(req.query.limit);
  let error = false;

  result = await profiles
    .findOne({
      where: {
        uuid: {
          [Op.eq]: profileUUID,
        },
      },
      attributes: ["id"],
    })
    .catch((err) => {
      error = true;
      res.status(403).send({ error: true, res: err.message, errObj: err });
    });

  if (error) return;

  if (result == null) {
    return res.status(409).send({ error: true, res: "invalid resource" });
  }

  const profileId = result.id;

  await stories
    .findAll({
      where: {
        profileId: {
          [Op.eq]: profileId,
        },
      },
      limit: limit,
      offset: offset,
    })
    .then((result) => {
      res.send({ error: false, obj: result, res: "SUCCESS" });
    })
    .catch((err) => {
      res.status(403).send({ error: true, res: err.message, errObj: err });
    });
});

/*
 * /:storyUUID - PUT - update a story
 * @check check jwt signature, match profile uuid from payload
 */
app.put("/:storyUUID", jwtcheck, async (req, res) => {
  value = nullCheck(req.body, {
    mustBeNullFields: [...defaultNullFields, "profileId", "likesCount"],
  });
  if (typeof value == "string") return res.status(409).send({ error: true, res: value });

  const storyUUID = req.params.storyUUID;

  await stories
    .update(req.body, {
      where: {
        uuid: {
          [Op.eq]: storyUUID,
        },
      },
    })
    .then((result) => {
      if (result == 0) {
        return res.status(409).send({ error: true, res: "invalid resource" });
      }
      res.send({ error: false, res: "SUCCESS" });
    })
    .catch((err) => {
      res.status(403).send({ error: true, res: err.message, errObj: err });
    });
});

/*
 * /:storyUUID - delete - delete a story
 * @check check jwt signature
 */
app.delete("/:storyUUID", jwtcheck, async (req, res) => {
  const storyUUID = req.params.storyUUID;

  await stories
    .delete({
      where: {
        uuid: {
          [Op.eq]: storyUUID,
        },
      },
    })
    .then((result) => {
      res.send({ error: false, res: "SUCCESS" });
    })
    .catch((err) => {
      res.status(403).send({ error: true, res: err.message, errObj: err });
    });
});

/*
 * /:storyUUID/hastags - get all hashtags in a story
 */
app.get("/:storyUUID/hashtags", async (req, res) => {
  const storyUUID = req.params.storyUUID;
  const offset = req.query.page === undefined ? 0 : parseInt(req.query.page);
  const limit = req.query.limit === undefined ? 10 : parseInt(req.query.limit);
  let error = false;

  result = await stories
    .findOne({
      where: {
        uuid: {
          [Op.eq]: storyUUID,
        },
      },
      attributes: ["id"],
    })
    .catch((err) => {
      error = true;
      res.status(403).send({ error: true, res: err.message, errObj: err });
    });

  if (error) return;

  if (result == null) {
    return res.status(409).send({ error: true, res: "invalid resource" });
  }

  const storyId = result.id;

  await hashtagsOnStory
    .findAll({
      where: {
        storyId: {
          [Op.eq]: storyId,
        },
      },
      limit: limit,
      offset: offset,
    })
    .then((result) => {
      res.send({ error: false, obj: result, res: "SUCCESS" });
    })
    .catch((err) => {
      res.status(403).send({ error: true, res: err.message, errObj: err });
    });
});

/*
 * /:storyUUID/hashtags/:hashtagUUID - POST - add a hashtag in a story
 * @check check jwt signature
 */
app.post("/:storyUUID/hashtags/:hashtagUUID", jwtcheck, async (req, res) => {
  const storyUUID = req.params.storyUUID;
  const hashtagUUID = req.params.hashtagUUID;
  let error = false;

  result = await stories
    .findOne({
      where: {
        uuid: {
          [Op.eq]: storyUUID,
        },
      },
      attributes: ["id"],
    })
    .catch((err) => {
      error = true;
      res.status(403).send({ error: true, res: err.message, errObj: err });
    });

  if (error) return;

  if (result == null) {
    return res.status(409).send({ error: true, res: "invalid resource" });
  }

  const storyId = result.id;

  result = await hashtags
    .findOne({
      where: {
        uuid: {
          [Op.eq]: hashtagUUID,
        },
      },
      attributes: ["id"],
    })
    .catch((err) => {
      error = true;
      res.status(403).send({ error: true, res: err.message, errObj: err });
    });

  if (error) return;

  if (result == null) {
    return res.status(409).send({ error: true, res: "invalid resource" });
  }

  const hashtagId = result.id;

  await hashtagsOnStory
    .create({ storyId: storyId, hashtagId: hashtagId })
    .then((result) => {
      res.send({ error: false, res: "SUCCESS" });
    })
    .catch((err) => {
      res.status(403).send({ error: true, res: err.message, errObj: err });
    });
});

/*
 * /:storyUUID/hastags/:hashtagUUID - remove a hashtag in a story
 * @check check jwt signature
 */
app.delete("/:storyUUID/hashtags/:hashtagUUID", jwtcheck, async (req, res) => {
  const storyUUID = req.params.storyUUID;
  const hashtagUUID = req.params.hashtagUUID;
  let error = false;

  result = await stories
    .findOne({
      where: {
        uuid: {
          [Op.eq]: storyUUID,
        },
      },
      attributes: ["id"],
    })
    .catch((err) => {
      error = true;
      res.status(403).send({ error: true, res: err.message, errObj: err });
    });

  if (error) return;

  if (result == null) {
    return res.status(409).send({ error: true, res: "invalid resource" });
  }

  const storyId = result.id;

  result = await hashtags
    .findOne({
      where: {
        uuid: {
          [Op.eq]: hashtagUUID,
        },
      },
      attributes: ["id"],
    })
    .catch((err) => {
      error = true;
      res.status(403).send({ error: true, res: err.message, errObj: err });
    });

  if (error) return;

  if (result == null) {
    return res.status(409).send({ error: true, res: "invalid resource" });
  }

  await hashtagsOnStory
    .destory({
      where: {
        storyId: {
          [Op.eq]: storyId,
        },
        hashtagId: {
          [Op.eq]: hashtagId,
        },
      },
    })
    .then((result) => {
      res.send({ error: false, res: "SUCCESS" });
    })
    .catch((err) => {
      res.status(403).send({ error: true, res: err.message, errObj: err });
    });
});

/*
 * /:storyUUID/likes - GET - get likes on a story
 */
app.get("/:storyUUID/likes", async (req, res) => {
  const storyUUID = req.params.storyUUID;
  const offset = req.query.page === undefined ? 0 : parseInt(req.query.page);
  const limit = req.query.limit === undefined ? 10 : parseInt(req.query.limit);
  4;
  let error = false;

  result = await stories
    .findOne({
      where: {
        uuid: {
          [Op.eq]: storyUUID,
        },
      },
      attributes: ["id"],
    })
    .catch((err) => {
      error = true;
      res.status(403).send({ error: true, res: err.message, errObj: err });
    });

  if (error) return;

  if (result == null) {
    return res.status(409).send({ error: true, res: "invalid resource" });
  }

  const storyId = result.id;

  await likesOnStory
    .findAll({
      where: {
        storyId: {
          [Op.eq]: storyId,
        },
      },
      limit: limit,
      offset: offset,
    })
    .then((result) => {
      res.send({ error: false, obj: result, res: "SUCCESS" });
    })
    .catch((err) => {
      res.status(403).send({ error: true, res: err.message, errObj: err });
    });
});

/*
 * /:profileUUID/like/:storyUUID - POST - like on a story
 * @check check jwt signature, match profile uuid from payload
 */
app.post(
  "/:profileUUID/likes/:storyUUID",
  jwtcheck,
  authorizeProfileUUID,
  async (req, res) => {
    const storyUUID = req.params.storyUUID;
    const profileId = req.userinfo.profileId;
    let error = false;

    result = await stories
      .findOne({
        where: {
          uuid: {
            [Op.eq]: storyUUID,
          },
        },
        attributes: ["id"],
      })
      .catch((err) => {
        error = true;
        res.status(403).send({ error: true, res: err.message, errObj: err });
      });

    if (error) return;

    if (result == null) {
      return res.status(409).send({ error: true, res: "invalid resource" });
    }

    const storyId = result.id;

    // increment likes count in story
    await stories
      .increment("likesCount", {
        where: {
          id: {
            [Op.eq]: storyId,
          },
        },
      })
      .catch((err) => {
        error = true;
        res.status(403).send({ error: true, res: err.message, errObj: err });
      });

    if (error) return;

    if (result == null) {
      return res.status(409).send({ error: true, res: "invalid resource" });
    }

    await likesOnStory
      .create({ storyId: storyId, profileId: profileId })
      .then((result) => {
        res.send({ error: false, res: "SUCCESS" });
      })
      .catch((err) => {
        res.status(403).send({ error: true, res: err.message, errObj: err });
      });
  },
);

/*
 * /:profileUUID/likes/:storyUUID - DELETE - unlike on a story
 * @check check jwt signature, match profile uuid from payload
 */
app.delete(
  "/:profileUUID/likes/:storyUUID",
  jwtcheck,
  authorizeProfileUUID,
  async (req, res) => {
    const storyUUID = req.params.storyUUID;
    const profileId = req.userinfo.profileId;
    let error = false;

    result = await stories
      .findOne({
        where: {
          uuid: {
            [Op.eq]: storyUUID,
          },
        },
        attributes: ["id"],
      })
      .catch((err) => {
        error = true;
        res.status(403).send({ error: true, res: err.message, errObj: err });
      });

    if (error) return;

    if (result == null) {
      return res.status(409).send({ error: true, res: "invalid resource" });
    }

    const storyId = result.id;

    // decrement likes count in story
    await stories
      .decrement("likesCount", {
        where: {
          id: {
            [Op.eq]: storyId,
          },
        },
      })
      .catch((err) => {
        error = true;
        res.status(403).send({ error: true, res: err.message, errObj: err });
      });

    if (error) return;

    if (result == null) {
      return res.status(409).send({ error: true, res: "invalid resource" });
    }

    await likesOnStory
      .destroy({
        where: {
          storyId: {
            [Op.eq]: storyId,
          },
          profileId: {
            [Op.eq]: profileId,
          },
        },
      })
      .then((result) => {
        if (result == 0) {
          return res.status(409).send({ error: true, res: "invalid resource" });
        }
        res.send({ error: false, res: "SUCCESS" });
      })
      .catch((err) => {
        res.status(403).send({ error: true, res: err.message, errObj: err });
      });
  },
);

module.exports = app;
