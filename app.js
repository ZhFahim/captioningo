// Requiring Dependencies
var express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
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

// Requring Routes
var routes = require("./routes/index");
app.use("/", routes);

// Run server
var port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("Server has started!");
});
