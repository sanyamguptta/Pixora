const jwt = require("jsonwebtoken");

async function identifyUser(req, res, next) {
  // taking stored token value from cookie into variable
  const token = req.cookies.token;

  // if token not exists, then return directly
  if (!token) {
    return res.status(401).json({
      message: "Token not provided, unauthorized access",
    });
  }

  let decoded = null;

  try {
    // verifying if token is valid or not
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({
      message: "user not authenticated....",
    });
  }

  console.log(decoded);

  // this create new property of req which has data of decoded
  req.user = decoded;

  //
  next();
}

module.exports = identifyUser;
