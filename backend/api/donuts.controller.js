import DonutsDAO from "../dao/donutsDAO.js";

export default class DonutsController {
  static async apiGetIndexContent(req, res, next) {
    const topDonuts = await DonutsDAO.getTopDonuts();
    res.json(topDonuts);
  }
  static async apiGetMenuContent(req, res) {
    const categoryList = await DonutsDAO.getCategories();
    const donutList = await DonutsDAO.getDonuts();
    let catDonMap = new Map();
    donutList.forEach((donut) => {
      let cat = categoryList.find((x) => x._id.toString() === donut.category);
      if (cat) {
        if (catDonMap[cat.name] == undefined) {
          catDonMap[cat.name] = {};
          catDonMap[cat.name].order = cat.order;
          catDonMap[cat.name].donuts = [];
          // console.log("!has" + catDonMap[cat.name]);
        }
        let convertedDonut = {
          name: donut.name,
          description: donut.description,
          photo_url: donut.photo_url,
          category: cat.name,
          order: donut.order,
          price: donut.price,
        };
        catDonMap[cat.name].donuts.push(convertedDonut);
        // console.log(`${cat.name}: ${catDonMap[cat.name].length} `);
      } else {
        console.error(`cat not found`);
      }
    });
    res.json(catDonMap);
  }
  static async apiGetDonutDetail(req, res, next) {}
}
