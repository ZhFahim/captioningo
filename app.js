// Requiring Dependencies
var express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  Caption = require("./models/caption"),
  seedDB = require("./seedDB");

// App config
app.set("view engine", "ejs");
app.use(express.static("public"));
//seedDB();

// DB config
mongoose.connect("mongodb://localhost/captioningo", {
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
      res.render("home", { caption: captions[randomNum] });
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
  // Fetch captions based on query
  Caption.find(query, function(err, captions) {
    if (err) {
      console.log(err);
    } else {
      // Render browse page based on query
      res.render("browse", {
        captions: captions,
        categories: categories,
        text: req.query.text,
        reqCategory: req.query.category
      });
    }
  });
});

// Escape regex in search query
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

// Run server
app.listen(3000, function() {
  console.log("Server has started!");
});
