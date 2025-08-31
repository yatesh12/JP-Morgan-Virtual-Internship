import { type User, type InsertUser, type StockData, type InsertStockData, type PriceHistory, type InsertPriceHistory, type MarketNews, type InsertMarketNews } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Stock data operations
  getStockData(symbol: string): Promise<StockData | undefined>;
  getAllStocks(): Promise<StockData[]>;
  upsertStockData(stock: InsertStockData): Promise<StockData>;
  
  // Price history operations
  getPriceHistory(symbol: string, limit?: number): Promise<PriceHistory[]>;
  addPriceHistory(priceHistory: InsertPriceHistory): Promise<PriceHistory>;
  
  // Market news operations
  getMarketNews(limit?: number): Promise<MarketNews[]>;
  addMarketNews(news: InsertMarketNews): Promise<MarketNews>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private stocks: Map<string, StockData>;
  private priceHistory: PriceHistory[];
  private marketNews: MarketNews[];

  constructor() {
    this.users = new Map();
    this.stocks = new Map();
    this.priceHistory = [];
    this.marketNews = [];
    this.initializeMockData();
  }

  private async initializeMockData() {
    // Add DJIA components with realistic stock data
    const djiaComponents = [
      { symbol: "AAPL", name: "Apple Inc.", basePrice: 175.84 },
      { symbol: "MSFT", name: "Microsoft Corp.", basePrice: 378.91 },
      { symbol: "UNH", name: "UnitedHealth Group Inc.", basePrice: 523.67 },
      { symbol: "GS", name: "Goldman Sachs Group Inc.", basePrice: 445.23 },
      { symbol: "HD", name: "Home Depot Inc.", basePrice: 312.45 },
      { symbol: "CAT", name: "Caterpillar Inc.", basePrice: 267.89 },
      { symbol: "AMGN", name: "Amgen Inc.", basePrice: 298.76 },
      { symbol: "MCD", name: "McDonald's Corp.", basePrice: 289.34 },
      { symbol: "V", name: "Visa Inc.", basePrice: 256.78 },
      { symbol: "BA", name: "Boeing Co.", basePrice: 203.45 },
    ];

    for (const component of djiaComponents) {
      const changePercent = (Math.random() - 0.5) * 4; // -2% to +2%
      const change = component.basePrice * (changePercent / 100);
      const currentPrice = component.basePrice + change;
      
      await this.upsertStockData({
        symbol: component.symbol,
        name: component.name,
        price: currentPrice,
        change: change,
        changePercent: changePercent,
        volume: Math.floor(Math.random() * 5000000) + 1000000, // 1M to 6M
        marketCap: this.generateMarketCap(),
        dayHigh: currentPrice + Math.random() * 10,
        dayLow: currentPrice - Math.random() * 10,
        yearHigh: currentPrice + Math.random() * 50 + 20,
        yearLow: currentPrice - Math.random() * 50 - 20,
      });

      // Add price history for each stock
      for (let i = 0; i < 30; i++) {
        const timestamp = new Date(Date.now() - i * 30 * 60 * 1000); // Every 30 minutes
        const historicalPrice = component.basePrice + (Math.random() - 0.5) * 20;
        
        await this.addPriceHistory({
          symbol: component.symbol,
          timestamp: timestamp,
          price: historicalPrice,
          volume: Math.floor(Math.random() * 1000000) + 100000,
        });
      }
    }

    // Add market news
    const newsItems = [
      {
        headline: "Fed Signals Potential Rate Cuts in Q4 2024",
        summary: "Federal Reserve officials hint at possible interest rate reductions as inflation shows signs of cooling.",
        source: "MarketWatch",
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        url: "https://example.com/fed-rate-cuts",
      },
      {
        headline: "Tech Stocks Rally on AI Optimism",
        summary: "Major technology companies see significant gains as artificial intelligence developments drive investor confidence.",
        source: "Financial Times",
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        url: "https://example.com/tech-rally",
      },
      {
        headline: "Energy Sector Gains on Oil Price Surge",
        summary: "Oil prices climb to multi-month highs, boosting energy company valuations across the board.",
        source: "Bloomberg",
        publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        url: "https://example.com/energy-gains",
      },
    ];

    for (const newsItem of newsItems) {
      await this.addMarketNews(newsItem);
    }
  }

  private generateMarketCap(): string {
    const caps = ["$1.2T", "$2.8T", "$487B", "$123B", "$89B", "$456B", "$234B", "$678B"];
    return caps[Math.floor(Math.random() * caps.length)];
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getStockData(symbol: string): Promise<StockData | undefined> {
    return this.stocks.get(symbol);
  }

  async getAllStocks(): Promise<StockData[]> {
    return Array.from(this.stocks.values());
  }

  async upsertStockData(stockData: InsertStockData): Promise<StockData> {
    const existing = this.stocks.get(stockData.symbol);
    const stock: StockData = {
      id: existing?.id || randomUUID(),
      ...stockData,
      marketCap: stockData.marketCap || null,
      dayHigh: stockData.dayHigh || null,
      dayLow: stockData.dayLow || null,
      yearHigh: stockData.yearHigh || null,
      yearLow: stockData.yearLow || null,
      lastUpdated: new Date(),
    };
    this.stocks.set(stockData.symbol, stock);
    return stock;
  }

  async getPriceHistory(symbol: string, limit = 100): Promise<PriceHistory[]> {
    return this.priceHistory
      .filter(item => item.symbol === symbol)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async addPriceHistory(priceHistoryData: InsertPriceHistory): Promise<PriceHistory> {
    const priceHistory: PriceHistory = {
      id: randomUUID(),
      ...priceHistoryData,
      volume: priceHistoryData.volume || null,
    };
    this.priceHistory.push(priceHistory);
    return priceHistory;
  }

  async getMarketNews(limit = 10): Promise<MarketNews[]> {
    return this.marketNews
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
      .slice(0, limit);
  }

  async addMarketNews(newsData: InsertMarketNews): Promise<MarketNews> {
    const news: MarketNews = {
      id: randomUUID(),
      ...newsData,
      summary: newsData.summary || null,
      source: newsData.source || null,
      url: newsData.url || null,
    };
    this.marketNews.push(news);
    return news;
  }
}

export const storage = new MemStorage();
