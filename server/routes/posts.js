const app = require("express").Router();
const bodyParser = require("body-parser");
const {
  posts,
  hashtagsOnPost,
  likesOnPost,
  profiles,
  bookmarksOnPost,
} = require("../models");
const { Op } = require("sequelize");
const { defaultNullFields } = require("./validations/nullcheck");
const {
  jwtcheck,
  authorizeuid,
  authorizeProfileUUID,
} = require("../middleware/jwtcheck");

app.use(bodyParser.json({ limit: '1mb' }));

/*
 * /:postUUID - GET - get post
 */
app.get("/:postUUID", async (req, res) => {
  const postUUID = req.params.postUUID;
  let error = false;

  result = await posts
    .findOne({
      where: {
        uuid: {
          [Op.eq]: postUUID,
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

  const postId = result.id;

  await posts
    .findOne({
      where: {
        id: {
          [Op.eq]: postId,
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
 * /:profileUUID/posts - GET - get all post of profile
 */
app.get("/:profileUUID/posts", async (req, res) => {
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

  await posts
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
 * / - POST - create post
 * @check check jwt signature, match uid from payload
 */
app.post("/:uid", jwtcheck, authorizeuid, async (req, res) => {
  value = nullCheck(req.body, {
    nonNullableFields: ["profileId", "title", "media"],
    mustBeNullFields: [...defaultNullFields, "likesCount", "commentsCount"],
  });
  if (typeof value == "string") return res.status(409).send({ error: true, res: value });

  await posts
    .create(req.body)
    .then((result) => {
      res.send({ error: false, res: "SUCCESS" });
    })
    .catch((err) => {
      res.status(403).send({ error: true, res: err.message, errObj: err });
    });
});

/*
 * /:postUUID - PUT - update post
 * @check check jwt signature
 */
app.put("/:postUUID", jwtcheck, async (req, res) => {
  value = nullCheck(req.body, {
    nonNullableFields: ["title", "media"],
    mustBeNullFields: [
      ...defaultNullFields,
      "profileId",
      "likesCount",
      "commentsCount",
    ],
  });
  if (typeof value == "string") return res.status(409).send({ error: true, res: value });
  let error = false;

  const postUUID = req.params.postUUID;

  result = await posts
    .findOne({
      where: {
        uuid: {
          [Op.eq]: postUUID,
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

  const postId = result.id;

  await posts
    .update(req.body, {
      where: {
        id: {
          [Op.eq]: postId,
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
 * /:postUUID - DELETE - delete post
 * @check check jwt signature
 */
app.delete("/:postUUID", jwtcheck, async (req, res) => {
  const postUUID = req.params.postUUID;
  let error = false;

  result = await posts
    .findOne({
      where: {
        uuid: {
          [Op.eq]: postUUID,
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

  const postId = result.id;

  await posts
    .destory({
      where: {
        id: {
          [Op.eq]: postId,
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
 * /:postUUID/hashtags - GET - get all hashtags of post
 */
app.get("/:postUUID/hashtags", async (req, res) => {
  const postUUID = req.params.postUUID;
  const offset = req.query.page === undefined ? 0 : parseInt(req.query.page);
  const limit = req.query.limit === undefined ? 10 : parseInt(req.query.limit);
  let error = false;

  result = await posts
    .findOne({
      where: {
        uuid: {
          [Op.eq]: postUUID,
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

  const postId = result.id;

  await hashtagsOnPost
    .findAll({
      where: {
        postId: {
          [Op.eq]: postId,
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
 * /:postUUID/hashtags/:hashtagUUID - POST - add hashtag in post
 * @check check jwt signature
 */
app.post("/:postUUID/hashtags/:hashtagUUID", jwtcheck, async (req, res) => {
  const postUUID = req.params.postUUID;
  const hashtagUUID = req.params.hashtagUUID;
  let error = false;

  result = await posts
    .findOne({
      where: {
        uuid: {
          [Op.eq]: postUUID,
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

  const postId = result.id;

  result = await hashatags
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

  await hashtagsOnPost
    .create({ postId: postId, hashtagId: hashtagId })
    .then((result) => {
      res.send({ error: false, res: "SUCCESS" });
    })
    .catch((err) => {
      res.status(403).send({ error: true, res: err.message, errObj: err });
    });
});

/*
 * /:postUUID/hashtags/:hashtagUUID - DELETE - remove hashtag in post
 * @check check jwt signature
 */
app.delete("/:postUUID/hashtags/:hashtagUUID", jwtcheck, async (req, res) => {
  const postUUID = req.params.postUUID;
  const hashtagUUID = req.params.hashtagUUID;
  let error = false;

  result = await posts
    .findOne({
      where: {
        uuid: {
          [Op.eq]: postUUID,
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

  const postId = result.id;

  result = await hashatags
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

  await hashtagsOnPost
    .destroy({
      where: {
        postId: {
          [Op.eq]: postId,
        },
        hashtagId: {
          [Op.eq]: hashtagId,
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
 * /:postUUID/likes - GET - get likes on post
 */
app.get("/:postUUID/likes", async (req, res) => {
  const postUUID = req.params.postUUID;
  const offset = req.query.page === undefined ? 0 : parseInt(req.query.page);
  const limit = req.query.limit === undefined ? 10 : parseInt(req.query.limit);
  let error = false;

  result = await posts
    .findOne({
      where: {
        uuid: {
          [Op.eq]: postUUID,
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

  const postId = result.id;

  await likesOnPost
    .findAll({
      where: {
        postId: {
          [Op.eq]: postId,
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
 * /:profileUUID/likes/:postUUID - POST - like a post
 * @check check jwt signature, match profile uuid from payload
 */
app.post(
  "/:profileUUID/likes/:postUUID",
  jwtcheck,
  authorizeProfileUUID,
  async (req, res) => {
    const profileId = req.userinfo.profileId;
    const postUUID = req.params.postUUID;
    let error = false;

    result = await posts
      .findOne({
        where: {
          uuid: {
            [Op.eq]: postUUID,
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

    const postId = result.id;

    // increment like count
    await comments
      .increment("likesCount", {
        where: {
          id: {
            [Op.eq]: postId,
          },
        },
      })
      .catch((err) => {
        error = true;
        res.status(403).send({ error: true, res: err.message, errObj: err });
      });

    if (error) return;

    await likesOnPost
      .create({ postId: postId, profileId: profileId })
      .then((result) => {
        res.send({ error: false, res: "SUCCESS" });
      })
      .catch((err) => {
        res.status(403).send({ error: true, res: err.message, errObj: err });
      });
  },
);

/*
 * /:profileUUID/likes/:postUUID - GET - unlike post
 * @check check jwt signature, match profile uuid from payload
 */
app.delete(
  "/:profileUUID/likes/:postUUID",
  jwtcheck,
  authorizeProfileUUID,
  async (req, res) => {
    const postUUID = req.params.postUUID;
    const profileId = req.userinfo.profileId;
    let error = false;

    result = await posts
      .findOne({
        where: {
          uuid: {
            [Op.eq]: postUUID,
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

    const postId = result.id;

    // decrement like count
    await comments
      .decrement("likesCount", {
        where: {
          id: {
            [Op.eq]: commentId,
          },
        },
      })
      .catch((err) => {
        error = true;
        res.status(403).send({ error: true, res: err.message, errObj: err });
      });

    if (error) return;

    await likesOnPost
      .destory({
        where: {
          postId: {
            [Op.eq]: postId,
          },
          profileId: {
            [Op.eq]: profileId,
          },
        },
      })
      .then((result) => {
        res.send({ error: false, res: "SUCCESS" });
      })
      .catch((err) => {
        res.status(403).send({ error: true, res: err.message, errObj: err });
      });
  },
);

/*
 * /:postUUID/bookmarks - POST - add bookmark to post
 * @check check jwt signature
 */
app.post("/:postUUID/bookmarks", jwtcheck, async (req, res) => {
  const postUUID = req.params.postUUID;
  const profileId = req.userinfo.profileId;

  let error = false;

  result = await posts
    .findOne({
      where: {
        uuid: {
          [Op.eq]: postUUID,
        },
      },
      attributes: ["id"],
    })
    .catch((err) => {
      error = true;
      res.status(403).send({ error: true, errObj: err, res: err.message });
    });

  if (error) return;

  if (result == null) {
    return res.status(409).send({ error: true, res: "invalid resource" });
  }

  const postId = result.id;

  await posts
    .increment("bookmarkCount", {
      where: {
        id: {
          [Op.eq]: postId,
        },
      },
    })
    .catch((err) => {
      error = true;
      res.status(403).send({ error: true, errObj: err, res: err.message });
    });

  if (error) return;

  await bookmarksOnPost
    .create({
      postId: postId,
      profileId: profileId,
    })
    .then((result) => {
      res.send({ error: false, res: "SUCCESS" });
    })
    .catch((err) => {
      res.send(403).send({ error: true, errObj: err, res: err.message });
    });
});
/*
 * /:postUUID/bookmarks - DELETE - add bookmark to post
 * @check jwt signature
 */
app.delete("/:postUUID/bookmarks", jwtcheck, async (req, res) => {
  const postUUID = req.params.postUUID;
  const profileId = req.userinfo.profileId;

  let error = false;

  result = await posts
    .findOne({
      where: {
        uuid: {
          [Op.eq]: postUUID,
        },
      },
      attributes: ["id"],
    })
    .catch((err) => {
      error = true;
      res.status(403).send({ error: true, errObj: err, res: err.message });
    });

  if (error) return;

  if (result == null) {
    return res.status(409).send({ error: true, res: "invalid resource" });
  }

  const postId = result.id;

  await posts
    .decrement("bookmarkCount", {
      where: {
        id: {
          [Op.eq]: postId,
        },
      },
    })
    .catch((err) => {
      error = true;
      res.status(403).send({ error: true, errObj: err, res: err.message });
    });

  if (error) return;

  await bookmarksOnPost
    .destory({
      where: {
        postId: {
          [Op.eq]: postId,
        },
        profileId: {
          [Op.eq]: profileId,
        },
      },
    })
    .then((result) => {
      res.send({ error: false, res: "SUCCESS" });
    })
    .catch((err) => {
      res.send(403).send({ error: true, errObj: err, res: err.message });
    });
});

module.exports = app;
