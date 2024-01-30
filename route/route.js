// const express = require('express');
import axios from "axios";
import express from "express";
// import {} from "./../controller/controller.js";

export const router = express.Router();
function getRandomSearch() {
    // A list of all characters that can be chosen.
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    
    // Gets a random character from the characters string.
    const randomCharacter = characters.charAt(Math.floor(Math.random() * characters.length));
    let randomSearch = '';
  
    // Places the wildcard character at the beginning, or both beginning and end, randomly.
    switch (Math.round(Math.random())) {
      case 0:
        randomSearch = randomCharacter + '%';
        break;
      case 1:
        randomSearch = '%' + randomCharacter + '%';
        break;
    }
  
    return randomSearch;
  }
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
router.get("/oi",(req,res)=>{

})

// module.exports = {router}
