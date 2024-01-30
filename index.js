import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { router } from "./route/route.js";

dotenv.config();
const app = express();
app.use(
  cors({
    origin:
      process.env.STATUS == "development"
        ? process.env.DEV_URL
        : process.env.PROD_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(router);
const port = process.env.STATUS == "development" ? 5000 : process.env.PORT;
app.listen(port, () => {
  console.log("server running port : " + port);
  console.log("host : http://localhost:" + port);
});
