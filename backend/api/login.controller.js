import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UsersDAO from "../dao/usersDAO.js";

export default class LoginController {
  static async apiOnLogin(req, res) {
    const { userName,userPwd  } = req.body;
    const user = await UsersDAO.getUser(userName);
    if (!user) {
      return res.sendStatus(401);
    }
    // console.log(req.body)
    const { pwdHash, info } = user;
    const isCorrect = await bcrypt.compare(userPwd, pwdHash);
    if (isCorrect) {
      jwt.sign(
        {
          userName,
          info,
        },
        process.env.JWT_SECRET,
        { expiresIn: "2d" },
        (err, token) => {
          if (err) {
            res.status(500).json(err);
          }
          res.status(200).json({ token });
        }
      );
    } else {
      res.sendStatus(401);
    }
  }
}


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6InRlc3RVc2VyTmFtZSIsImluZm8iOltdLCJpYXQiOjE2Njk1MjEwMTMsImV4cCI6MTY2OTY5MzgxM30.1Qg_yXsFkw-srNuL3y6eSDVzkuXvnzE80xc67U04N98

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
//   .eyJ1c2VyTmFtZSI6InRlc3RVc2VyTmFtZSIsImluZm8iOltdLCJpYXQiOjE2Njk1MjEwNTMsImV4cCI6MTY2OTY5Mzg1M30
//   .Tqdd6TVVgKGCuwiHCAsNvyJWH2HV9Va11GzRvh1thNY;

//   {
// 	"userName":"testUserName",
// 	"userPwd":"1234!!"
// }