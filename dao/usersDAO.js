import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let users;

export default class UsersDAO {
  static async injectDB(conn) {
    if (users) {
      return;
    }
    try {
      users = await conn.db(process.env.DONUT_NS).collection("users");
    } catch (e) {
      console.error(`Unable to connect db users ${e}`);
    }
  }
  static async getUser(userName) {
    if (!users) {
      return;
    }
    try {
      let user = await users.findOne({ userName });
      if (!user) {
        return;
      }
      return user;
    } catch (e) {
      console.error(`Unable to get user ${e}`);
    }
  }

  static async createUser(userName, pwdHash, info) {
    const user = await UsersDAO.getUser(userName);
    if (user) {
      res.sendStatus(409);
    }
    try {
      let res = await users.insertOne({ userName, pwdHash, info });
      return res;
    } catch (e) {
      console.error(`Unable to create user ${e}`);
    }
  }

  static async addDonutToWishList(userName, donutId) {
    if (!users) {
      return;
    }
    try {
      let updateRes = await users.updateOne(
        { userName },
        {
          $addToSet: { info: donutId },
        }
      );
      if (updateRes.modifiedCount == 0) {
        console.error("addDonutToWishList updateRes.modifiedCount == 0");
        return { error: "Modified 0 document" };
      } else {
        return updateRes;
      }
    } catch (e) {
      console.error(`Unable to add donut to wish list ${e}`);
      return { error: e };
    }
  }

  static async removeDonutFromWishList(userName, donutId) {
    if (!users) {
      return;
    }
    try {
      let updateRes = await users.updateOne(
        { userName },
        {
          $pull: { info: donutId },
        }
      );
      if (updateRes.modifiedCount == 0) {
        console.error("removeDonutFromWishList updateRes.modifiedCount == 0");
        return { error: "Modified 0 document" };
      } else {
        return updateRes;
      }
    } catch (e) {
      console.error(`Unable to remove donut to wish list ${e}`);
      return { error: e };
    }
  }
}
