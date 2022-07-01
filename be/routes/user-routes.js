const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getSingleUser,
} = require("../controllers/user-controller");
const { isAuthenticated, authorizeRoles } = require("../middlewares/auth");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);

router
  .route("/admin/users")
  .get(isAuthenticated, authorizeRoles("admin"), getAllUsers);

router
  .route("/admin/user/:id")
  .get(isAuthenticated, authorizeRoles("admin"), getSingleUser)
  .put(isAuthenticated, authorizeRoles("admin"), updateUserRole)
  .delete(isAuthenticated, authorizeRoles("admin"), deleteUser);

module.exports = router;
