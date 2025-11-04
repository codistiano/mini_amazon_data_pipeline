import { useState, useEffect } from "react";
import "./App.css";
import ASINForm from "./components/ASINForm";
import SearchBar from "./components/SearchBar";
import ProductCard from "./components/ProductCard";
import API_BASE_URL from './api/config';

function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedAsin, setSelectedAsin] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [asinInput, setAsinInput] = useState("");
  const [scrapingAsin, setScrapingAsin] = useState(false);
  const [scrapeError, setScrapeError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/products`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setProducts(data);
      setFilteredProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleScrapeAsin = async (rawInput) => {
    let asin = rawInput.trim();

    const urlMatch =
      asin.match(/\/dp\/([A-Z0-9]{10})/) ||
      asin.match(/\/gp\/product\/([A-Z0-9]{10})/);
    if (urlMatch) asin = urlMatch[1];

    if (!/^[A-Z0-9]{10}$/.test(asin)) {
      setScrapeError("Please enter a valid ASIN or Amazon URL");
      return false;
    }

    setScrapingAsin(true);
    setScrapeError("");

    try {
      const res = await fetch(
        `${API_BASE_URL}/products/scrape-asin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ asin }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to scrape");
      await fetchProducts();
      setAsinInput("");
      setScrapeError("");
      return true;
    } catch (err) {
      setScrapeError(err.message);
      return false;
    } finally {
      setScrapingAsin(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) {
      setFilteredProducts(products);
      return;
    }
    const filtered = products.filter(
      (p) =>
        p.title?.toLowerCase().includes(term) ||
        p.asin?.toLowerCase().includes(term) ||
        p.currentPrice?.toString().includes(term)
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const toggleChart = (asin) => {
    setSelectedAsin(selectedAsin === asin ? null : asin);
  };

  if (loading) return <div className="loading">Loading products...</div>;
  if (error)
    return (
      <div className="error">
        Error: {error} <button onClick={fetchProducts}>Retry</button>
      </div>
    );

  return (
    <div className="app">
      <header>
        <h1>Amazon Products Tracker</h1>

        <ASINForm
          asinInput={asinInput}
          setAsinInput={setAsinInput}
          handleScrapeAsin={() => handleScrapeAsin(asinInput)}
          scrapingAsin={scrapingAsin}
          scrapeError={scrapeError}
        />

        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onRefresh={fetchProducts}
        />
      </header>

      {products.length > 0 && (
        <p className="last-updated">
          Last updated: {new Date(products[0].scrapedAt).toLocaleString()}
        </p>
      )}

      <div className="product-grid">
        {filteredProducts.length === 0 ? (
          <p className="no-results">
            {searchTerm
              ? `No products match "${searchTerm}"`
              : "No products found."}
          </p>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.asin}
              product={product}
              isChartOpen={selectedAsin === product.asin}
              toggleChart={() => toggleChart(product.asin)}
            />
          ))
        )}
      </div>

      {products.length === 0 && !loading && (
        <p className="no-data">No products found. Start scraping!</p>
      )}
    </div>
  );
}

export default App;
