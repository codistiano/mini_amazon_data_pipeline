const productsRouter = require("express").Router();
const Product = require("../models/Product");
const { scrapeAmazonProduct } = require("../scraper/amazonScraper");

productsRouter.get("/", async (req, res) => {
  const products = await Product.find().sort({ scrapedAt: -1 });
  if (products.length < 1) {
    res.json({ error: "No data have been uploaded yet" });
  } else {
    res.json(products);
  }
});

productsRouter.post("/scrape", async (req, res) => {
  const { searchTerm } = req.body;
  if (!searchTerm) {
    return res.status(400).json({ error: "Enter a search keyword" });
  }

  try {
    const products = await scrapeAmazonProduct(searchTerm);

    for (const p of products.slice(0, 10)) {
      const pricePoint = {
        price: p.price,
        rating: p.rating,
        scrapedAt: new Date(),
      };

      await Product.findOneAndUpdate(
        { asin: p.asin },
        {
          $set: {
            title: p.title,
            currentPrice: p.price,
            currentRating: p.rating,
            url: p.url,
          },
          $push: { history: pricePoint }, // Adding to history
        },
        { upsert: true, new: true }
      );
    }
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = productsRouter;
