const User = require("../models/User");
require('dotenv').config();
const checkAdmin = require('../utils/checkAdmin')

const deleteUser = async (req, res) => {
  const userId = req.params.userId;
  if (!userId) return res.status(404).send("not found");

  const admin = await checkAdmin(req,res);
  if (!admin || !admin.isAdmin)
    return res
      .status(401)
      .send({ message: "Unauthorized", error: "only admin can delete" });

  try {
    await User.findByIdAndDelete(userId);
    res.status(204).send({ message: "deleted succesfully" });
  } catch (error) {
    res.status(500).send({ message: "server error" });
  }
};



const getAllUser = async (req, res) => {
   const admin = await checkAdmin(req,res);
  if (!admin || !admin.isAdmin)
    return res.status(401).send({ message: "Unauthorized" });
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    res.status(500).send({ message: "server error" });
  }
};

module.exports = { deleteUser, getAllUser };