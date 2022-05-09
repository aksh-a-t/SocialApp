var jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    let token =req.headers["authorization"].split(" ")[1];
      const verify = jwt.verify(token,process.env.SECRET_ACCESS_KEY);
      res.locals.userInfo = verify["_id"];
      next();
  } catch (error) {
    console.log("Auth",error);
    res.status(401).send(error);
  }
};


module.exports = auth;
