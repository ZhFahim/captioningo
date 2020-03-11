var express = require("express"),
  app = express();

app.get("/", function(req, res) {
  res.send("Welcome to homepage!");
});

app.listen(3000, function() {
  console.log("Server has started!");
});
