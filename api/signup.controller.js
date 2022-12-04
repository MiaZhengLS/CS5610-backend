import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UsersDAO from "../dao/usersDAO.js";

export default class SignUpController {
  static async apiOnSignUp(req, res) {
    const { userName, userPwd } = req.body;
    const exist = await UsersDAO.getUser(userName);
    if (exist) {
      return res.sendStatus(409);
    }
    // console.log(req);
    const pwdHash = await bcrypt.hash(userPwd, 10);
    const wishList = [];
    const user = await UsersDAO.createUser(userName, pwdHash, wishList);
    if (user) {
      jwt.sign(
        {
          userName,
          info: wishList,
        },
        process.env.JWT_SECRET,
        { expiresIn: "2d" },
        (err, token) => {
          if (err) {
            return res.status(500).send(err);
          }
          res.status(200).json({ token });
        }
      );
    }
  }
}
