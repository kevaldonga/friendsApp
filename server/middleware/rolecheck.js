const { users } = require("../models");
const { Op } = require("sequelize");

const adminCheck = (req, res, next) => {
  if (req.userinfo.role === "admin") {
    next();
  } else {
    res.status(403).send({ error: true, res: "forbidden" });
  }
};

const moderatorCheck = (req, res, next) => {
  if (req.userinfo.role === "moderator") {
    next();
  } else {
    res.status(403).send({ error: true, res: "forbidden" });
  }
};

const roleCheck = (uuid, role) => {
  try {
    result = users.findOne({
      where: {
        uuid: {
          [Op.eq]: uuid,
        },
      },
    });
  } catch (err) {
    return err.message;
  } finally {
    if (result.role !== role) {
      return "forbidden";
    }
  }
};

module.exports = {
  adminCheck: adminCheck,
  moderatorCheck: moderatorCheck,
  roleCheck: roleCheck,
};
