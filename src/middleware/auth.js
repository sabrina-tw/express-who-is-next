const jwt = require("express-jwt");
const { secret } = require("../config/getJWTSecret");

function getTokenFromCookie(req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.access_token;
  }
  return token;
}

module.exports = {
  required: jwt({
    secret,
    algorithms: ["HS256"],
    getToken: getTokenFromCookie,
  }),
};
