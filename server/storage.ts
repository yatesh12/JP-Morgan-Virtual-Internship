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
    };
    this.marketNews.push(news);
    return news;
  }
}

export const storage = new MemStorage();
