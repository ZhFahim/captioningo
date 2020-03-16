// Requiring Dependencies
var express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  Caption = require("./models/caption"),
  seedDB = require("./seedDB");

// App config
app.set("view engine", "ejs");
app.use(express.static("public"));
require("dotenv").config();
//seedDB();

// DB config
mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// ROUTES
// Display random caption at home page
app.get("/", function(req, res) {
  Caption.find({}, function(err, captions) {
    if (err) {
      console.log(err);
    } else {
      var randomNum = Math.floor(Math.random() * captions.length);
      res.render("home", { caption: captions[randomNum], page: "home" });
    }
  });
});

// Browse captions
app.get("/browse", function(req, res) {
  // Retrive all categories from DB
  var categories;
  Caption.distinct("category", function(err, foundCategories) {
    if (err) {
      console.log(err);
    } else {
      categories = foundCategories;
    }
  });
  // Make query object
  var query = {};
  // Check if user requests a query or not
  if (req.query.text) {
    query.text = new RegExp(escapeRegex(req.query.text), "gi");
  }
  if (req.query.category && req.query.category !== "all") {
    query.category = req.query.category;
  }
  // Get total page numbers based on query
  var pages = 1;
  Caption.countDocuments(query, function(err, count) {
    pages = Math.ceil(count / 10); // Each page has 10 captions
  });
  // Get current page
  var currentPage = 1;
  if (req.query.page) {
    currentPage = req.query.page;
  }
  // Fetch captions based on query
  Caption.find(query)
    .limit(10)
    .skip((currentPage - 1) * 10)
    .sort({ $natural: -1 })
    .exec(function(err, captions) {
      if (err) {
        console.log(err);
      } else {
        // Render browse page based on query
        res.render("browse", {
          captions: captions,
          categories: categories,
          pages: pages,
          currentPage: currentPage,
          queryText: req.query.text,
          queryCategory: req.query.category,
          page: "browse"
        });
      }
    });
});

// Escape regex in search query
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

// Run server
var port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("Server has started!");
});
