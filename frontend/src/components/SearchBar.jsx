export default function SearchBar({ searchTerm, setSearchTerm, onRefresh }) {
  return (
    <>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by title, ASIN, or price..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button className="clear-search" onClick={() => setSearchTerm("")}>
            ×
          </button>
        )}
      </div>
      <button className="refresh-btn" onClick={onRefresh}>
        Refresh Data
      </button>
    </>
  );
}
