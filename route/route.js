// import axios from "axios";
// import express from "express";
const axios = require("axios");
const express = require("express");

const router = express.Router();

router.post("/token", async (req, res) => {
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
router.get("/oi", (req, res) => {
  res.json("hello");
});

module.exports = {router}