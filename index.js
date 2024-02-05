// import express from "express";
const express = require("express");
// import cors from "cors";
const cors = require("cors");
const dotenv = require("dotenv");
const cookiepp = require('cookie-parser')
const { router, middleware } = require("./route/route.js");
const { conn, Broadcast } = require("./controller/controller.js");
const ioo = require("socket.io")
const http = require("http")

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
try {
  conn.sync({ alter: true })
  console.log("Database Connected");
} catch (error) {
  console.log("Error : " + error);
}
app.use(express.json());
app.use(cookiepp())
app.use(express.urlencoded({ extended: true }));
const server = http.createServer(app)
const io = ioo(server, {
  cors: {
    origin:
      process.env.STATUS == "development"
        ? process.env.DEV_URL
        : process.env.PROD_URL

  }
})
io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("broadcast", (msg) => {
    console.log(msg);
    io.emit("broadcast", msg);
  });
});
app.use(router);
app.post("/broadcast"
  , middleware
  , (req, res) => {
    io.emit("broadcast", { user: req.user, msg: req.body.chat })
    try {
      const newChat = new Broadcast()
      newChat.senderId = req.user.id
      newChat.chat = req.body.chat
      newChat.save()
      return res.json("Berhasil")
    } catch (error) {
      return res.json({ error: "Gagal : " + error })
    }
  })
const port = process.env.STATUS == "development" ? 5000 : process.env.PORT;
server.listen(port, () => {
  console.log("server running port : " + port);
  console.log("host : http://localhost:" + port);
});

module.exports = { io }