import express from "express";
import DonutsController from "./donuts.controller.js";
import UsersController from "./users.controller.js";
import LoginController from "./login.controller.js";
import SignUpController from "./signup.controller.js";
const router = express.Router();

router.route("/").get(DonutsController.apiGetIndexContent);
router.route("/login").post(LoginController.apiOnLogin);
router.route("/signup").post(SignUpController.apiOnSignUp);
router.route("/menu").get(DonutsController.apiGetMenuContent);
router.route("/detail/:id").get(DonutsController.apiGetDonutDetail);
router.route("/menu").put(UsersController.apiUpdateWishList);
router.route("/detail/:id").put(UsersController.apiUpdateWishList);
router.route("/account/my-account").get(UsersController.apiGetUserInfo);
router.route("/account/my-wishlist").get(UsersController.apiGetWishList);

export default router;
