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
  if (req.query.text) {
    // Display captions based on query
    var text = new RegExp(escapeRegex(req.query.text), "gi");
    Caption.find({ text: text }, function(err, captions) {
      if (err) {
        console.log(err);
      } else {
        res.render("browse", { captions: captions });
      }
    });
  } else {
    // Fetch every captions from DB
    Caption.find({}, function(err, captions) {
      if (err) {
        console.log(err);
      } else {
        // Render browse page with all captions
        res.render("browse", { captions: captions });
      }
    });
  }
});

// Escape regex in search query
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

// Run server
app.listen(3000, function() {
  console.log("Server has started!");
});
