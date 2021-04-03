//==============================================================//
// Setup
//==============================================================//

const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//==============================================================//
// MongoDB Setup
//==============================================================//

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Article", articleSchema);

//==============================================================//
// '/articles' general route handling
//==============================================================//

app
  .route("/articles")
  .get((req, res) => {
    Article.find({}, (err, articles) => {
      if (!err) {
        res.send(articles);
      } else {
        res.send(err);
      }
    });
  })
  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save((err) => {
      if (err) {
        res.send(err);
      } else {
        res.sendStatus(200);
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany({}, (err, articles) => {
      if (err) {
        res.send(err);
      } else {
        console.log("Successfully deleted all articles");
        res.sendStatus(200);
      }
    });
  });

//==============================================================//
// '/articles/:article' specific route handling
//==============================================================//

app.route("/articles/:article").get((req, res) => {
  const query = req.params.article;

  Article.find({ title: query }, (err, articles) => {
    if (err) {
      res.send(err);
    } else if (articles.length === 0) {
      res.sendStatus(404);
    } else {
      res.send(articles);
    }
  });
});

//==============================================================//
// Server start
//==============================================================//

app.listen(3000, () => {
  console.log("server listening on port 3000");
});
