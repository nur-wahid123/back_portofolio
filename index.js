// import express from "express";
const express = require("express");
// import cors from "cors";
const cors = require("cors");
const dotenv = require("dotenv");
const { router } = require("./route/route.js");

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
