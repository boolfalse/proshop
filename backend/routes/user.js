
import express from "express";
const router = express.Router();
import userController from "../controllers/userController.js";
// import { isAuth, isAdmin } from "../middleware/authMiddleware.js";

router.route("/login").post(userController.login);
router.route("/register").post(userController.register);
router.route("/logout").post(userController.logout);

router.route("/profile").get(userController.getProfile); // isAuth
router.route("/profile").put(userController.updateProfile); // isAuth

router.route("/").get(userController.adminGetUsers); // isAuth, isAdmin
router.route("/:id").get(userController.adminGetUserById); // isAuth, isAdmin
router.route("/:id").put(userController.adminUpdateUser); // isAuth, isAdmin
router.route("/:id").delete(userController.adminDeleteUser); // isAuth, isAdmin

export default router;
