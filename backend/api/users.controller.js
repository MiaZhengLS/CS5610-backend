import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UsersDAO from "../dao/usersDAO.js";
export default class UsersController {
  static async apiGetUserInfo(req, res) {
    const { authorization } = req.headers;
    // console.log(req.headers + "," + req.body);

    // const { userName } = req.params;
    if (!authorization) {
      return res.status(401).json({ message: "No authorization header sent" });
    }
    const token = authorization.split(" ")[1];
    // console.log("token: " + token);
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ message: `Unable to verify token ${err}` });
      }
      const decodedUserName = decoded.userName;
      // if (decodedUserName !== userName) {
      //   return res
      //     .status(403)
      //     .json({ message: "Not allowed to get that user's data" });
      // }
      const userInfo = await UsersDAO.getUser(decodedUserName);
      res
        .status(200)
        .json({ userName: userInfo.userName, info: userInfo.info });
      // jwt.sign(
      //   { userName: userInfo.userName, info: userInfo.info },
      //   process.env.JWT_SECRET,
      //   { expiresIn: "2d" },
      //   (err, token) => {
      //     if (err) {
      //       return res.status(200).json(err);
      //     }
      //     res.status(200).json({ token });
      //   }
      // );
    });
  }

  static async apiGetWishList(req, res, next) {}

  static async apiUpdateWishList(req, res, next) {}
}
