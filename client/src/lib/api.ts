import { apiRequest } from "./queryClient";

export const stockApi = {
  getDjiaData: async () => {
    const response = await apiRequest('GET', '/api/external/djia');
    return response.json();
  },
  
  getAllStocks: async () => {
    const response = await apiRequest('GET', '/api/stocks');
    return response.json();
  },
  
  getStockData: async (symbol: string) => {
    const response = await apiRequest('GET', `/api/stocks/${symbol}`);
    return response.json();
  },
  
  getPriceHistory: async (symbol: string, limit?: number) => {
    const url = limit ? `/api/stocks/${symbol}/history?limit=${limit}` : `/api/stocks/${symbol}/history`;
    const response = await apiRequest('GET', url);
    return response.json();
  },
  
  getDjiaComponents: async () => {
    const response = await apiRequest('GET', '/api/djia/components');
    return response.json();
  },
  
  getMarketNews: async (limit?: number) => {
    const url = limit ? `/api/news?limit=${limit}` : '/api/news';
    const response = await apiRequest('GET', url);
    return response.json();
  }
};
