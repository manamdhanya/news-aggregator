const express = require("express");
const axios = require("axios");

const app = express();
const port = 3000;  

base_url="https://saurav.tech/NewsAPI/"

app.get("/top-articles", async (req, res) => {
   try {
     const response = await axios.get(base_url + "top-headlines/category/general/in.json");
     let articles = response.data.articles.slice(0, 5); 
 
     res.json(articles);
   } catch (error) {
     console.error("Error fetching articles:", error);
     res.status(500).json({ message: "Failed to fetch articles" });
   }
 });
 

 app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
 });