const { jwt } = require('jsonwebtoken');
const { JWTPRIVATEKEY } = require('./../config/globals');

const jwtcheck = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        let user = jwt.verify(token, JWTPRIVATEKEY);
        req.userinfo = user;
        next();
    }
    catch (e) {
        res.status(403).send("invalid");
    }
}

const authorizeuid = (req, res, next) => {
    if (req.userinfo.uid == req.params.uid) {
        next();
    }
    res.status(403).send("access denied");
}

const authorizeProfileUUID = (req, res, next) => {
    if (req.userinfo.profileUUID == req.params.profileUUID) {
        next();
    }
    res.status(403).send("access denined");
}

const authorizeuserUUID = (req, res, next) => {
    if (req.userinfo.userUUID == req.params.profileUUID) {
        next();
    }
    res.status(403).send("access denined");
}

module.exports = {
    jwtcheck: jwtcheck,
    authorizeProfileUUID: authorizeProfileUUID,
    authorizeuid: authorizeuid,
    authorizeuserUUID: authorizeuserUUID,
};