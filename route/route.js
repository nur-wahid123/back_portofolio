// import axios from "axios";
// import express from "express";
const axios = require("axios");
const express = require("express");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { body, matchedData, validationResult } = require("express-validator");
const { User, Broadcast } = require("../controller/controller");

const router = express.Router();
//route for authentication
const middleware = (req, res, next) => {
  const token = req.cookies.token
  if (!token) return res.status(401).json({ error: "Silahkan Login Terlebih dahulu" })
  try {
    const decode = jwt.verify(token, process.env.USER_SECRET)
    req.user = { name: decode.name, id: decode.id }
    next()
  } catch (error) {
    return res.status(403).json({ error: "Terjadi Error : " + error })
  }
};
router.post("/token"
  , async (req, res) => {
    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;
    const baseUrl = process.env.BASE_URL;
    const askToken = "https://accounts.spotify.com/api/token";
    try {
      const request = await axios.post(
        askToken,
        { grant_type: "client_credentials" },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
              "Basic " +
              new Buffer.from(client_id + ":" + client_secret).toString("base64"),
          },
        }
      );
      return res.json(request.data);
    } catch (error) {
      return res.json(error);
    }
  });
router.get("/check"
  , middleware, (req, res) => {
    res.json(req.user);
  });
router.post("/register"
  , body("email").isEmail().withMessage("Email Salah").exists().withMessage("Email Dibutuhkan"),
  body("name").exists(),
  body("username").exists(),
  body("password")
    .exists()
    .withMessage("Perlu Password")
    .isLength({ min: 6 })
    .withMessage("Minimal password adalah 6"),
  body("passwordConfirmation")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Konfirmasi Password Salah")
    .exists()
    .withMessage("Perlu Konfismasi Password"),
  async (req, res) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
      const data = matchedData(req);
      const isEmailExist = await User.findOne({ where: { email: data.email } });
      if (isEmailExist) return res.json({ error: "Email " + data.email + " sudah pernah digunakan" })
      const isUsernameExist = await User.findOne({ where: { username: data.username } });
      if (isUsernameExist) return res.json({ error: "Username " + data.username + " sudah pernah digunakan" })
      const newUser = new User();
      newUser.name = data.name
      newUser.username = data.username
      newUser.email = data.email
      newUser.password = await bcrypt.hash(data.password, 10);
      newUser.save()
      res.json("Registrasi Berhasil");
    } else {
      res.json({ error: result.array()[0].msg })
    }
  }
);
router.post("/login"
  , body("username")
    .exists()
    .withMessage("Perlu Username")
  , body("password")
    .exists()
    .withMessage("Perlu Password")
  , async (req, res) => {
    const result = validationResult(req)
    if (!result.isEmpty()) return res.json({ error: result.array()[0].msg })
    const data = matchedData(req)
    const isUsernameExist = await User.findOne({ where: { username: data.username } });
    if (!isUsernameExist) return res.json({ error: "Username atau Password Salah" })
    const verifyPassword = await bcrypt.compare(data.password, isUsernameExist.password)
    if (!verifyPassword) return res.json({ error: "Username atau Password Salah" })
    // return
    const token = jwt.sign({
      name: isUsernameExist.name,
      username: isUsernameExist.username,
      email: isUsernameExist.email,
      id: isUsernameExist.id
    }, process.env.USER_SECRET,
      { expiresIn: '3h', })
    res.cookie('token', token, { maxAge: 1000 * 60 * 60 * 3, httpOnly: true })
    res.status(200)
    return res.json("Login Berhasil")

  })
router.get("/logout"
  , (req, res) => {
    res.clearCookie("token")
    return res.json("Logout Berhasil")
  })
//route for broadcast chat
router.get("/chat"
  , middleware
  , async (req, res) => {
    try {
      let data = await Broadcast.findAll({ limit: 100, order: [['createdAt',"ASC"]],include:{model:User,as:"sender",attributes:['id','name']}})
      return res.json(data)
    } catch (error) {
      return res.json("error : " + error)
    }
  })

module.exports = { router, middleware };
