const puppeteer = require("puppeteer");

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function scrapeAmazonProduct(productName) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
  );
  await page.setViewport({ width: 1280, height: 800 });

  const url = `https://www.amazon.com/s?k=${encodeURIComponent(productName)}`;

  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await delay(2000);

    const products = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".s-result-item"))
        .map((el) => {
          const title = el.querySelector("h2")?.innerText.trim();
          const priceWhole = el.querySelector(".a-price-whole")?.innerText.replace(/[^0-9]/g, "");
          const priceFraction =
            el.querySelector(".a-price-fraction")?.innerText;
          const price =
            priceWhole && priceFraction
              ? `${priceWhole}.${priceFraction}`
              : null;
          const ratingText = el.querySelector(".a-icon-alt")?.innerText || "";
          const rating = ratingText
            ? parseFloat(ratingText.split(" ")[0])
            : null;
          const asin = el.getAttribute("data-asin");
          console.log(asin);
          const url = `https://www.amazon.com/dp/${asin}`;

          return { title, price, rating, asin, url };
        })
        .filter((p) => p.asin && p.price);
    });

    return products;
  } catch (err) {
    throw new Error(`Scraping failed: ${err.message}`);
  } finally {
    await browser.close();
  }
}

module.exports = { scrapeAmazonProduct };
