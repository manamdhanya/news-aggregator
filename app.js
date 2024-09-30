const express = require("express");
const axios = require("axios");
const CORS = require("cors");
const app = express();
const port = 3000;

require("dotenv").config();

app.use(CORS())

// groq

const { Groq } = require("groq-sdk");
const GroqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const base_url = "https://saurav.tech/NewsAPI/";

app.get("/top-articles", async (req, res) => {
  try {
    const category = req.query.category || 'general';//makes general the default category if nothign is selected
    const response = await axios.get(
      base_url + `top-headlines/category/${category}/in.json`
    );
    let articles = response.data.articles.slice(0, 5);
    const data = [];
    //doesnt summarise the main article that we want to show and instaed scrapes the site and gets the actual article
    let main_article=articles[0]
    const generated = await GroqClient.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content:
            "I'm providing you with a article link, I want you to fetch the content from the link by scraping the webiste and give me the actual content of the article in html format so i can properly format it just by pasting it in my app. Reply with only the article and nothing else . Link: " +
            main_article.url,
        },
      ]})
      data.push({
        title:main_article.title,
        lik:main_article.url,
        image:main_article.urlToImage,
        summary: generated.choices[0].message.content,
      });
    //removed the 1st(main) article from the articles array and creates summaries for the rest of them
    articles.splice(0,1)
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
              "I'm providing you with a article link, I want you to fetch the content from the link and give me a summary of the news article in around 100-200 words. Just reply with the summary content and nothing else.  . Link: " +
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
    //submites an array with the articles where the 1st article is not summarised and the rest are
    res.json(data);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: "Failed to fetch articles" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
