import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStockDataSchema, insertPriceHistorySchema, insertMarketNewsSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Stock data endpoints
  app.get("/api/stocks", async (req, res) => {
    try {
      const stocks = await storage.getAllStocks();
      res.json(stocks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stocks" });
    }
  });

  app.get("/api/stocks/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const stock = await storage.getStockData(symbol.toUpperCase());
      if (!stock) {
        return res.status(404).json({ error: "Stock not found" });
      }
      res.json(stock);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stock data" });
    }
  });

  app.post("/api/stocks", async (req, res) => {
    try {
      const stockData = insertStockDataSchema.parse(req.body);
      const stock = await storage.upsertStockData(stockData);
      res.json(stock);
    } catch (error) {
      res.status(400).json({ error: "Invalid stock data" });
    }
  });

  // Price history endpoints
  app.get("/api/stocks/:symbol/history", async (req, res) => {
    try {
      const { symbol } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const history = await storage.getPriceHistory(symbol.toUpperCase(), limit);
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch price history" });
    }
  });

  app.post("/api/stocks/:symbol/history", async (req, res) => {
    try {
      const { symbol } = req.params;
      const priceData = insertPriceHistorySchema.parse({
        ...req.body,
        symbol: symbol.toUpperCase(),
      });
      const history = await storage.addPriceHistory(priceData);
      res.json(history);
    } catch (error) {
      res.status(400).json({ error: "Invalid price history data" });
    }
  });

  // Market news endpoints
  app.get("/api/news", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const news = await storage.getMarketNews(limit);
      res.json(news);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch market news" });
    }
  });

  app.post("/api/news", async (req, res) => {
    try {
      const newsData = insertMarketNewsSchema.parse(req.body);
      const news = await storage.addMarketNews(newsData);
      res.json(news);
    } catch (error) {
      res.status(400).json({ error: "Invalid news data" });
    }
  });

  // External API integration for real-time data
  app.get("/api/external/djia", async (req, res) => {
    try {
      const apiKey = process.env.ALPHA_VANTAGE_API_KEY || process.env.VITE_ALPHA_VANTAGE_API_KEY || "demo";
      
      if (apiKey === "demo") {
        // Return demo data structure when no API key is available
        const demoData = {
          symbol: "DJI",
          name: "Dow Jones Industrial Average",
          price: 34256.89,
          change: 127.34,
          changePercent: 0.37,
          volume: 2400000,
          marketCap: "$8.2T",
          dayHigh: 34401.23,
          dayLow: 34012.45,
          yearHigh: 36799.65,
          yearLow: 28660.94,
        };
        
        await storage.upsertStockData(demoData);
        res.json(demoData);
        return;
      }

      const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=DJI&apikey=${apiKey}`);
      
      if (!response.ok) {
        throw new Error(`Alpha Vantage API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data["Error Message"]) {
        throw new Error(data["Error Message"]);
      }
      
      const quote = data["Global Quote"];
      if (!quote) {
        throw new Error("Invalid response format from Alpha Vantage");
      }
      
      const stockData = {
        symbol: quote["01. symbol"],
        name: "Dow Jones Industrial Average",
        price: parseFloat(quote["05. price"]),
        change: parseFloat(quote["09. change"]),
        changePercent: parseFloat(quote["10. change percent"].replace("%", "")),
        volume: parseInt(quote["06. volume"]),
        marketCap: "$8.2T", // Static value as this isn't provided by the API
        dayHigh: parseFloat(quote["03. high"]),
        dayLow: parseFloat(quote["04. low"]),
        yearHigh: parseFloat(quote["03. high"]), // Approximation
        yearLow: parseFloat(quote["04. low"]), // Approximation
      };
      
      await storage.upsertStockData(stockData);
      res.json(stockData);
    } catch (error) {
      console.error("Error fetching DJIA data:", error);
      res.status(500).json({ error: "Failed to fetch external DJIA data" });
    }
  });

  // DJIA components endpoint
  app.get("/api/djia/components", async (req, res) => {
    try {
      // Static DJIA components - these don't change frequently
      const components = [
        { symbol: "AAPL", name: "Apple Inc." },
        { symbol: "MSFT", name: "Microsoft Corp." },
        { symbol: "UNH", name: "UnitedHealth Group Inc." },
        { symbol: "GS", name: "Goldman Sachs Group Inc." },
        { symbol: "HD", name: "Home Depot Inc." },
        { symbol: "CAT", name: "Caterpillar Inc." },
        { symbol: "AMGN", name: "Amgen Inc." },
        { symbol: "MCD", name: "McDonald's Corp." },
        { symbol: "V", name: "Visa Inc." },
        { symbol: "BA", name: "Boeing Co." },
        { symbol: "TRV", name: "Travelers Companies Inc." },
        { symbol: "AXP", name: "American Express Co." },
        { symbol: "JPM", name: "JPMorgan Chase & Co." },
        { symbol: "IBM", name: "International Business Machines Corp." },
        { symbol: "WMT", name: "Walmart Inc." },
        { symbol: "JNJ", name: "Johnson & Johnson" },
        { symbol: "PG", name: "Procter & Gamble Co." },
        { symbol: "CVX", name: "Chevron Corp." },
        { symbol: "MRK", name: "Merck & Co. Inc." },
        { symbol: "DIS", name: "Walt Disney Co." },
        { symbol: "NKE", name: "Nike Inc." },
        { symbol: "KO", name: "Coca-Cola Co." },
        { symbol: "CRM", name: "Salesforce Inc." },
        { symbol: "VZ", name: "Verizon Communications Inc." },
        { symbol: "INTC", name: "Intel Corp." },
        { symbol: "CSCO", name: "Cisco Systems Inc." },
        { symbol: "WBA", name: "Walgreens Boots Alliance Inc." },
        { symbol: "DOW", name: "Dow Inc." },
        { symbol: "HON", name: "Honeywell International Inc." },
        { symbol: "MMM", name: "3M Co." }
      ];
      
      res.json(components);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch DJIA components" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
