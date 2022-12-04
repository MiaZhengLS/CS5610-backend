import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import DonutsDAO from "./dao/donutsDAO.js";
import UsersDAO from "./dao/usersDAO.js";

async function main() {
  dotenv.config();

  const client = new mongodb.MongoClient(process.env.DONUT_DB_URI);

  const port = process.env.PORT || 8000;

  try {
    await client.connect();
    const p1 = DonutsDAO.injectDB(client);
    const p2 = UsersDAO.injectDB(client);
    await Promise.all([p1, p2]);

    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main().catch(console.error);
