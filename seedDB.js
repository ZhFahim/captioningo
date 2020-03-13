var mongoose = require("mongoose"),
  Caption = require("./models/caption.js");

// Demo Captions
var captions = [
  {
    text: "When you can't find the sunshine, be the sunshine.",
    author: "admin",
    usedBy: 345,
    language: "en"
  },
  {
    text:
      "The happiest people don't have the best of everything, they make the best of everything.",
    author: "admin",
    usedBy: 746,
    language: "en"
  },
  {
    text: "Do more things that make you forget to check your phone.",
    author: "admin",
    usedBy: 456,
    language: "en"
  },
  {
    text:
      "F.R.I.E.N.D.S. Fight for you. Respect you. Include you. Encourage you. Need you. Deserve you. Stand by you.",
    author: "admin",
    usedBy: 836,
    language: "en"
  },
  {
    text:
      "She's the exclamation mark in the happiest sentence that I could ever possibly write.",
    author: "admin",
    usedBy: 923,
    language: "en"
  },
  {
    text: "Feelings are just visitors, let them come and go.",
    author: "admin",
    usedBy: 482,
    language: "en"
  },
  {
    text:
      "Do not wait on the PERFECT MOMENT, take the minute and make it BEST.",
    author: "admin",
    usedBy: 658,
    language: "en"
  },
  {
    text: "The great pleasure in life is doing what people say you cannot do.",
    author: "admin",
    usedBy: 524,
    language: "en"
  },
  {
    text:
      "Life is like a balloon. If you never let go, you will certainly not understand how high you can climb.",
    author: "admin",
    usedBy: 238,
    language: "en"
  },
  {
    text:
      "Take a piece of my heart and make it all your own, so when we are apart, you’ll never be alone.",
    author: "admin",
    usedBy: 195,
    language: "en"
  }
];

module.exports = function() {
  Caption.create(captions);
};
