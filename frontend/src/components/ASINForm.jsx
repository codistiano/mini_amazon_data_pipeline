export default function ASINForm({
  asinInput,
  setAsinInput,
  handleScrapeAsin,
  scrapingAsin,
  scrapeError,
}) {
  return (
    <>
      <div className="asin-input-container">
        <input
          type="text"
          placeholder="Paste Amazon URL or ASIN (e.g., B07VGRJDFY)"
          value={asinInput}
          onChange={(e) => setAsinInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleScrapeAsin()}
          className="asin-input"
        />
        <button
          onClick={handleScrapeAsin}
          disabled={scrapingAsin}
          className="scrape-asin-btn"
        >
          {scrapingAsin ? "Scraping..." : "Track Product"}
        </button>
      </div>

      {scrapeError && <div className="scrape-error">{scrapeError}</div>}
    </>
  );
}
