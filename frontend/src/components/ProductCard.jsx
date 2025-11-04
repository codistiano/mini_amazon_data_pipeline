import React from "react";
import PriceChart from "./PriceChart";

export default function ProductCard({ product, isChartOpen, toggleChart }) {
  const history = product.history || [];
  const lastPricePoint = history[history.length - 2]; // previous scrape
  const hasDropped =
    lastPricePoint && product.currentPrice < lastPricePoint.price;
  const dropAmount = hasDropped
    ? (lastPricePoint.price - product.currentPrice).toFixed(2)
    : 0;

  const chartData = (product.history || [])
    .map((h) => ({
      date: new Date(h.scrapedAt).toLocaleDateString(),
      price: h.price,
    }))
    .reverse();

  return (
    <div className="product-card">
      {product.image && (
        <img
          src={product.image}
          alt={product.title}
          className="product-image"
        />
      )}
      <div className="product-info">
        <h3>{product.title}</h3>

        {hasDropped && (
          <div className="price-drop-badge">↓ ${dropAmount} cheaper</div>
        )}

        <p className="price">${product.currentPrice?.toFixed(2)}</p>
        <p className="rating">Rating: {product.currentRating} / 5</p>
        <p className="asin">ASIN: {product.asin}</p>

        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="amazon-link"
        >
          View on Amazon
        </a>

        {product.history?.length > 1 && (
          <button className="chart-toggle" onClick={toggleChart}>
            {isChartOpen ? "Hide" : "Show"} Price History
          </button>
        )}

        {isChartOpen && chartData.length > 0 && (
          <div className="chart-container">
            <PriceChart data={chartData} />
          </div>
        )}
      </div>
    </div>
  );
}
