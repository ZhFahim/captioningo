var express = require("express"),
  app = express();

// App setup
app.set("view engine", "ejs");
app.use(express.static("public"));

// Routes
app.get("/", function(req, res) {
  res.render("home");
});
app.get("/browse", function(req, res) {
  res.render("browse");
});

// Run server
app.listen(3000, function() {
  console.log("Server has started!");
});
