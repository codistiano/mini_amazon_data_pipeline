# Mini Amazon data pipeline
A focused MERN-based ETL pipeline for scraping Amazon product data (via ScrapingBee), transforming it, and persisting to MongoDB. This README gives the minimal, practical steps to run and extend the project.

## What this repo does
- Scrapes product pages using ScrapingBee (headless browser + proxy).
- Runs an ETL: Extract (scraper) → Transform (clean/normalize) → Load (MongoDB).
- Provides a Node/Express API to query persisted data (part of the MERN backend).
- Simple client using React with plain CSS.

## Tech stack
- MongoDB
- Express / Node.js
- React 
- ScrapingBee API (scraping)

## Quick start (local)
1. Clone
    - git clone <repo-url>
2. Create env file
    - cp backend/.env.example backend/.env
    - Edit backend/.env and set:
      - MONGO_URI=...
      - SCRAPINGBEE_API_KEY=...
3. Install
    - cd backend && npm install
    - cd ../frontend && npm install
4. Start services
    - Start MongoDB (local or container)
    - Start the backend: `cd backend && npm run dev`
    - Start the frontend: `cd ../frontend && npm run dev`


## ETL flow (high level overview)
1. Extract
    - Call ScrapingBee endpoint with the Amazon URL and any JS rendering options.
    - Save raw JSON to a "raw" collection or storage for replay/debug.
2. Transform
    - Parse markup, extract fields (title, price, ASIN, images, ratings).
    - Normalize types (numbers, timestamps), strip currency symbols, validate.
    - Enrich (optional): add computed fields, price history tags.
3. Load
    - Upsert into MongoDB collection(s): products, price_history, raw_scrapes.
    - Emit simple metrics (processed_count, error_count).

## Troubleshooting
- 401 from ScrapingBee: verify SCRAPINGBEE_API_KEY and quota.
- Empty selectors: update transform selectors to match Amazon markup (changes often).
- Mongo connection errors: check MONGO_URI and network settings.
- Rate limits: add delays and respect ScrapingBee quotas.

## Features TODO with more time
- Categorize products for easier lookup.
- Serving deep details of a product.
- Implement a feature for comparison between two products.
- Making a specific page for products with available discounts/sales.
- etc...
