// src/App.jsx
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAsin, setSelectedAsin] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); 

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/products");
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

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(p =>
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

        <div className="search-container">
          <input
            type="text"
            placeholder="Search by title, ASIN, or price..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>
              ×
            </button>
          )}
        </div>
        <button className="refresh-btn" onClick={fetchProducts}>
          Refresh Data
        </button>
      </header>

      {products.length > 0 && (
        <p className="last-updated">
          Last updated: {new Date(products[0].scrapedAt).toLocaleString()}
        </p>
      )}

      <div className="product-grid">
        {filteredProducts.length === 0 ? (
          <p className="no-results">
            {searchTerm ? `No products match "${searchTerm}"` : 'No products found.'}
          </p>
        ) : (
          filteredProducts.map(product => {
            const chartData = product.history
              .map(h => ({
                date: new Date(h.scrapedAt).toLocaleDateString(),
                price: h.price,
              }))
              .reverse();

            const isChartOpen = selectedAsin === product.asin;

            return (
              <div key={product.asin} className="product-card">
                {product.image && (
                  <img src={product.image} alt={product.title} className="product-image" />
                )}
                <div className="product-info">
                  <h3>{product.title}</h3>
                  <p className="price">${product.currentPrice?.toFixed(2)}</p>
                  <p className="rating">Rating: {product.currentRating} / 5</p>
                  <p className="asin">ASIN: {product.asin}</p>

                  <a href={product.url} target="_blank" rel="noopener noreferrer" className="amazon-link">
                    View on Amazon
                  </a>

                  {product.history?.length > 1 && (
                    <button className="chart-toggle" onClick={() => toggleChart(product.asin)}>
                      {isChartOpen ? 'Hide' : 'Show'} Price History
                    </button>
                  )}

                  {isChartOpen && chartData.length > 0 && (
                    <div className="chart-container">
                      <ResponsiveContainer width="100%" height={180}>
                        <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="date" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={60} />
                          <YAxis tick={{ fontSize: 10 }} domain={['dataMin - 5', 'dataMax + 5']} />
                          <Tooltip formatter={(v) => `$${v.toFixed(2)}`} />
                          <Line
                            type="monotone"
                            dataKey="price"
                            stroke="#B12704"
                            strokeWidth={2}
                            dot={{ fill: '#B12704', r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {products.length === 0 && !loading && (
        <p className="no-data">No products found. Start scraping!</p>
      )}
    </div>
  );
}

export default App;
