import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let categories;
let donuts;

export default class DonutsDAO {
  static async injectDB(conn) {
    if (donuts) {
      return;
    }
    try {
      categories = await conn
        .db(process.env.DONUT_NS)
        .collection("donut_category");
      donuts = await conn.db(process.env.DONUT_NS).collection("donuts");
    } catch (e) {
      console.error(`Unable to connect db donuts ${e}`);
    }
  }

  static async getCategories() {
     let cursor = await categories.find({});
     const categoryList = cursor.toArray();
     return categoryList;
  }

  static async getTopDonuts() {
    if (!donuts) {
      return;
    }
    try {
      let cursor = await donuts
        .aggregate([{ $sort: { popularity: -1, name: 1 } }])
        .limit(3);
      if (cursor) {
        const donutList = await cursor.toArray();
        return donutList;
      }
    } catch (e) {
      console.error(`Error in getTopDonuts: ${e}`);
      return [];
    }
  }

  static async getDonuts() {
    if (!donuts) {
      return;
    }
    try {
      let cursor = await donuts.find({});
      const donutList = cursor.toArray();
      return donutList;
    } catch (e) {
      console.error(`Error in getDonuts: ${e}`);
      return [];
    }
  }

  static async updateDonutPopularity(donutId, num) {
    if (!donuts) {
      return;
    }
    try {
      const updateRes = await donuts.updateOne(
        {
          _id: new ObjectId(donutId),
        },
        {
          $set: { popularity: num },
        }
      );
      if (updateRes.modifiedCount == 0) {
        console.error("updateDonutPopularity updateRes.modifiedCount == 0");
        return { error: "Modified 0 document" };
      } else {
        return updateRes;
      }
    } catch (e) {
      console.error(`Unable to update donut popularity ${e}`);
      return { error: e };
    }
  }
}
