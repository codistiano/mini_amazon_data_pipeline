const scrapingBeeAPI = process.env.SCRAPINGBEE_API_KEY;

async function scrapeAmazonProduct(searchTerm) {
  const url = `https://app.scrapingbee.com/api/v1/amazon/search?api_key=${scrapingBeeAPI}&query=${searchTerm}&light_request=true&sort_by=bestsellers&domain=com&start_page=1&pages=1`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.products || data.products.length === 0) {
      throw new Error("No products found");
    }

    // Map to your schema
    return data.products.slice(0, 10).map(p => ({
      asin: p.asin,
      title: p.title,
      price: p.price,
      rating: p.rating,
      image: p.url_image || "",
      url: p.url.includes("amazon.com") ? p.url : `https://www.amazon.com/dp/${p.asin}`,
    }));
  } catch (err) {
    throw new Error(`Scraping failed: ${err.message}`);
  }
}

// for single product using ASIN
async function scrapeAmazonProductByAsin(asin) {
  const url = `https://app.scrapingbee.com/api/v1/amazon/product?api_key=${scrapingBeeAPI}&query=${asin}&light_request=true&domain=com`;
 
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.asin) {
      throw new Error("Product not found");
    }

    return {
      asin: data.asin,
      title: data.title,
      price: data.price,
      rating: data.rating,
      image: data.url_image || data.images?.[0] || "",
      url: data.url || `https://www.amazon.com/dp/${asin}`,
    };
  } catch (err) {
    throw new Error(`ASIN scrape failed: ${err.message}`);
  }
}
module.exports = { scrapeAmazonProduct, scrapeAmazonProductByAsin };
