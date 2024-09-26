const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;

require("dotenv").config();

// groq

const { Groq } = require("groq-sdk");
const GroqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const base_url = "https://saurav.tech/NewsAPI/";

app.get("/top-articles", async (req, res) => {
  try {
    const response = await axios.get(
      base_url + "top-headlines/category/general/in.json"
    );
    let articles = response.data.articles.slice(0, 5);
    const data = [];
    for (const article of articles) {
      const link = article.url;
      const image = article.urlToImage;
      const title = article.title;

      const generated = await GroqClient.chat.completions.create({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content:
              "I'm providing you with a article link, I want you to fetch the content from the link and give me a summary of the news article in around 100-200 words. Just reply with the summary content and nothing else. Link: " +
              link,
          },
        ],
      });

      data.push({
        title,
        link,
        image,
        summary: generated.choices[0].message.content,
      });
    }

    res.json(data);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: "Failed to fetch articles" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
