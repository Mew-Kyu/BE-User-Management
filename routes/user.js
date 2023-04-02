const userController = require("../controllers/userController.js");
const {
  verifyToken,
  verifyTokenAndUser,
  verifyTokenAndUserAuthorization,
} = require("../controllers/verifyToken");

const router = require("express").Router();
//GET ALL USERS
router.get("/", verifyToken, userController.getAllUsers);

//GET USER BY ID
router.get("/user/:id", verifyToken, userController.getUserById);

//DELETE USER
router.delete(
  "/:id/delete",
  verifyTokenAndUserAuthorization,
  userController.deleteUser
);

//UPDATE USER
router.put("/:id/update", verifyTokenAndUser, userController.updateUser);

// UPDATE USER ROLE
router.put("/:id/update-role", verifyTokenAndUserAuthorization, userController.updateUserRole);

//CHANGE A USER'S PASSWORD
router.put("/:id/change-password", verifyTokenAndUser, userController.changeUserPassword);

module.exports = router;
