const mongoose = require("mongoose");

const PricePointSchema = new mongoose.Schema({
  price: Number,
  rating: Number,
  scrapedAt: { type: Date, default: Date.now },
});

const ProductSchema = new mongoose.Schema({
  asin: { type: String, unique: true, required: true },
  title: String,
  history: [PricePointSchema],
  currentPrice: Number,
  currentRating: Number,
  image: String,
  url: String,
  scrapedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", ProductSchema);
