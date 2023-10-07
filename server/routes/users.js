const app = require("express").Router();
const bodyParser = require("body-parser");
const { Op } = require("sequelize");
const { users } = require("../models");
const { nullCheck, defaultNullFields } = require("./validations/nullcheck");
const { jwt } = require("jsonwebtoken");
const { JWTPRIVATEKEY } = require("./../config/globals");
const { jwtcheck, authorizeuid } = require("../middleware/jwtcheck");

app.use(bodyParser.json());

/*
 * /:uid - GET - get the user by uid
 * @check check jwt signature, match uid from payload
 */
app.get("/:uid", jwtcheck, authorizeuid, async (req, res) => {
  const uid = req.params.uid;

  await users
    .findOne({
      where: {
        uid: {
          [Op.eq]: uid,
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
 * /generatetoken/:uid - GET - generate the json web token
 */
app.get("/generatetoken/:uid", async (req, res) => {
  const uid = req.params.uid;
  let error = false;

  result = await users
    .findOne({
      where: {
        uid: {
          [Op.eq]: uid,
        },
      },
      include: "profiles",
    })
    .catch((err) => {
      error = false;
      res.status(403).send({ error: true, res: err.message, errObj: err });
    });

  if (error) return;

  if (result == null) {
    return res.status(409).send({ error: true, res: "invalid resource" });
  }

  const uuid = result.uuid;
  const profileId = result.profiles.id;
  const profileUUID = result.profiles.uuid;

  const userObj = {
    uid: uid,
    userUUID: uuid,
    profileId: profileId,
    profileUUID: profileUUID,
  };

  token = jwt.sign(userObj, JWTPRIVATEKEY, { expiresIn: "30D" });

  res.send(token);
});

/*
 * / - POST - create the user
 */
app.post("/", async (req, res) => {
  value = nullCheck(req.body, {
    nonNullableFields: ["uid", "email"],
    mustBeNullFields: [...defaultNullFields],
  });
  if (typeof value == "string") return res.status(409).send({ error: true, res: value });

  await users
    .create(req.body)
    .then((result) => {
      res.send({ error: false, res: "SUCCESS" });
    })
    .catch((err) => {
      res.status(403).send({ error: true, res: err.message, errObj: err });
    });
});

/*
 * / - PUT - update the user
 * @check check jwt signature, match uid from payload
 */
app.put("/:uid", jwtcheck, authorizeuid, async (req, res) => {
  value = nullCheck(req.body, {
    mustBeNullFields: [...defaultNullFields, "uid"],
  });
  if (typeof value == "string") return res.status(409).send({ error: true, res: value });

  const uid = req.params.uid;

  await users
    .update(req.body, {
      where: {
        uid: {
          [Op.eq]: uid,
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
 * / - DELETE - delete the user
 * @check check jwt signature, match uid from payload
 */
app.delete("/:uid", jwtcheck, authorizeuid, async (req, res) => {
  const uid = req.params.uid;

  await users
    .destroy({
      where: {
        uid: {
          [Op.eq]: uid,
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

module.exports = app;
