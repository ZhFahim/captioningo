// Requiring Dependencies
var express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  Caption = require("./models/caption"),
  seedDB = require("./seedDB");

// App config
app.set("view engine", "ejs");
app.use(express.static("public"));
// seedDB();

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
  res.render("browse");
});

// Run server
app.listen(3000, function() {
  console.log("Server has started!");
});
