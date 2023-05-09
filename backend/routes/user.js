
import express from "express";
const router = express.Router();
import userController from "../controllers/userController.js";
import { isAuth, isAdmin } from "../middleware/authMiddleware.js";

router.route("/login").post(userController.login);
router.route("/register").post(userController.register);
router.route("/logout").post(userController.logout);

router.route("/profile").get(isAuth, userController.getProfile);
router.route("/profile").put(isAuth, userController.updateProfile);

router.route("/list").get(isAuth, isAdmin, userController.adminGetUsers);
router.route("/user/:id").get(isAuth, isAdmin, userController.adminGetUserById);
router.route("/user/:id").put(isAuth, isAdmin, userController.adminUpdateUser);
router.route("/user/:id").delete(isAuth, isAdmin, userController.adminDeleteUser);

export default router;
