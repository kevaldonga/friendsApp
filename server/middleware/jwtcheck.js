const { jwt } = require("jsonwebtoken");
const { JWTPRIVATEKEY } = require("./../config/globals");

const jwtcheck = (req, res, next) => {
  let token;
  if (req.headers.authorization === undefined) {
    const cookieStr = req.headers.cookie;

    const cookies = fetchHTTPCookies(cookieStr);

    token = cookies.jwt;
  } else {
    token = req.headers.authorization.split(" ")[1];
  }

  if (token === undefined) {
    res.status(403).send({ error: true, res: "Access denied" });
    return;
  }

  try {
    let user = jwt.verify(token, JWTPRIVATEKEY);
    req.userinfo = user;
    next();
  } catch (e) {
    res.status(403).send({ error: true, res: "invalid" });
  }
};

const authorizeuid = (req, res, next) => {
  if (req.userinfo.uid == req.params.uid) {
    next();
  }
  res.status(403).send({ error: true, res: "Access denied" });
};

const authorizeProfileUUID = (req, res, next) => {
  if (req.userinfo.profileUUID == req.params.profileUUID) {
    next();
  }
  res.status(403).send({ error: true, res: "Access denied" });
};

const authorizeuserUUID = (req, res, next) => {
  if (req.userinfo.userUUID == req.params.profileUUID) {
    next();
  }
  res.status(403).send({ error: true, res: "Access denied" });
};

module.exports = {
  jwtcheck: jwtcheck,
  authorizeProfileUUID: authorizeProfileUUID,
  authorizeuid: authorizeuid,
  authorizeuserUUID: authorizeuserUUID,
};
