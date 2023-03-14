const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const checkAdmin = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const secret = process.env.JWT_SECRET;
  const decodedToken = jwt.verify(token, secret);
  const adminId = decodedToken.userId;
  if (!adminId) return res.status(404).send("not found");
  const admin = await User.findOne({ _id: adminId });
  return admin;
};

module.exports = checkAdmin;
