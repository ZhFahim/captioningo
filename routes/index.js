const express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  Caption = require("../models/caption"),
  User = require("../models/user"),
  Info = require("../models/info");

// Display random caption at home page
router.get("/", function(req, res) {
  Caption.find({}, function(err, captions) {
    if (err) {
      console.log(err);
    } else {
      // Update Total Hits
      Info.findOne({ name: "Hits" }, function(err, foundInfo) {
        foundInfo.value++;
        foundInfo.save();
      });
      // Generate random caption
      var randomNum = Math.floor(Math.random() * captions.length);
      res.render("home", { caption: captions[randomNum], page: "home" });
    }
  });
});

// Browse captions
router.get("/browse", function(req, res) {
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

// Update usedBy property route
router.get("/copy/:id", function(req, res) {
  //Find the caption
  Caption.findById(req.params.id, function(err, foundCaption) {
    if (err || !foundCaption) {
      console.log(err);
      res.send("Failed!");
    } else {
      foundCaption.usedBy++;
      foundCaption.save();
      res.send("Done!");
    }
  });
});

// Show Login Form
router.get("/login", function(req, res) {
  res.render("login");
});

// Handle Login
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "login"
  }),
  function(req, res) {}
);

// Dashboard
router.get("/dashboard", isLoggedIn, function(req, res) {
  // Get Statics
  var statics = {};
  // Total Captions
  Caption.countDocuments({}, function(err, totalCaptions) {
    statics.totalCaptions = totalCaptions;
    // Total Categories
    Caption.distinct("category", function(err, foundCategories) {
      statics.totalCategories = foundCategories.length;
      // Total Caption Used By
      Caption.aggregate(
        [
          {
            $group: {
              _id: null,
              totalUsedBy: { $sum: "$usedBy" }
            }
          }
        ],
        function(err, usedByResults) {
          statics.totalUsedBy = usedByResults[0].totalUsedBy;
          // Total Hits
          Info.findOne({ name: "Hits" }, function(err, foundInfo) {
            statics.totalHits = foundInfo.value;
            // Display Captions
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
                  // Serve statics and captions based on query
                  res.render("dashboard", {
                    statics: statics,
                    captions: captions,
                    categories: categories,
                    pages: pages,
                    currentPage: currentPage,
                    queryText: req.query.text,
                    queryCategory: req.query.category,
                    page: "dashboard"
                  });
                }
              });
          });
        }
      );
    });
  });
});

// Add Caption from Dashboard
router.post("/dashboard", isLoggedIn, function(req, res) {
  Caption.create(req.body, function(err, caption) {
    if (err) {
      console.log(err);
    } else {
      // Redirect to dashboard
      res.redirect("/dashboard");
    }
  });
});

// Edit Caption Page
router.get("/dashboard/edit/:id", isLoggedIn, function(req, res) {
  // Fetch all categories
  Caption.distinct("category", function(err, categories) {
    if (err) {
      console.log(err);
    } else {
      // Find caption based on ID
      Caption.findById(req.params.id, function(err, caption) {
        if (err) {
          console.log(err);
        } else {
          res.render("edit", { caption: caption, categories: categories });
        }
      });
    }
  });
});

// Update Caption
router.post("/dashboard/edit/:id", isLoggedIn, function(req, res) {
  // Find the caption from DB
  Caption.findById(req.params.id, function(err, caption) {
    if (err) {
      console.log(err);
    } else {
      // Update the caption
      caption.text = req.body.text;
      caption.category = req.body.category;
      caption.save();
      res.redirect("/dashboard");
    }
  });
});

// Delete Caption
router.delete("/dashboard/:id", isLoggedIn, function(req, res) {
  // Delete the caption from DB
  Caption.deleteOne({ _id: req.params.id }, function(err) {
    if (err) {
      console.log(err);
    } else {
      res.send("Caption deleted!");
    }
  });
});

// Escape regex in search query
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

module.exports = router;
