const jwt = require("jsonwebtoken");

// Check this authHeader
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  // extracts the auth header (the 2nd word from it) as it
  // is of the format ( Bearer <token> ) we need the token
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(401);
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken };
