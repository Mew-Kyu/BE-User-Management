const User = require("../models/User");
const bcrypt = require("bcrypt");

const userController = {
  //GET ALL USER
  getAllUsers: async (req, res) => {
    try {
      const user = await User.find();
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  
  //GET USER BY ID
  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const { password, ...others } = user._doc;
      res.status(200).json(others);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //DELETE A USER
  deleteUser: async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User deleted");
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //UPDATE A USER
  updateUser: async (req, res) => {
    try {
      await User.findByIdAndUpdate(req.params.id, req.body);
      res.status(200).json("User updated");
    } catch (err) {
      res.status(500).json("Username or email already exists");
    }
  },

  //CHANGE A USER'S ROLE
  updateUserRole: async (req, res) => {
    if (req.user.isAdmin) {
      try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send("User not found");
  
        user.isAdmin = req.body.isAdmin;
        await user.save();
  
        res.status(200).send("User role updated successfully");
      } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
      }
    } else {
      res.status(403).send("You are not authorized to perform this action");
    }
  },
  
  //CHANGE A USER'S PASSWORD
  changeUserPassword: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).send("User not found");

      // check if current password is valid
      const validPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!validPassword)
        return res.status(400).send("Current password is not valid");

      // hash and update new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
      user.password = hashedPassword;
      await user.save();

      res.status(200).send("Password updated successfully");
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal server error");
    }
  },
};

module.exports = userController;
