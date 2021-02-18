const { Schema, model } = require("mongoose");

const ArticleSchema = new Schema(
  {
    headLine: String,
    subHead: String,
    content: String,
    category: String,
    category: {
      name: String,
      img: String,
    },
    author: [
      {
        type: Schema.Types.ObjectId,
        ref: "Author",
      },
    ],
    reviews: [
      {
        text: String,
        user: String,
      },
    ],
    cover: String,
  },
  {
    timestamps: true,
  }
);

module.exports = model("Article", ArticleSchema);

/**
 * {
    "headLine": "WELCOME",
  "subHead": "Just subtitle",
  "content": "YOU THINK YOU HOW TO DANCE",
  "category": "STUPID",
  "author": {
    "name": "DevRichard",
    "img": "https://source.unsplash.com/random"
  }, 
  "reviews": [
      {
        "text": "WONDERFUL ARTICLE LIKE IT.",
        "user": "Richard"
      }
    ],
  "cover": "random stufffffs"
}

{ type: Schema.Types.ObjectId, ref: "Author" }


 */
