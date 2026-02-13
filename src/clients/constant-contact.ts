import axios, { AxiosInstance, AxiosError } from 'axios';
import type { ConstantContactConfig, PaginatedResponse } from '../types/index.js';

export class ConstantContactClient {
  private client: AxiosInstance;
  private accessToken: string;
  private baseUrl: string;
  private rateLimitRemaining: number = 10000;
  private rateLimitReset: number = Date.now();

  constructor(config: ConstantContactConfig) {
    this.accessToken = config.accessToken;
    this.baseUrl = config.baseUrl || 'https://api.cc.email/v3';
    
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 30000
    });

    // Response interceptor for rate limit tracking
    this.client.interceptors.response.use(
      (response) => {
        const remaining = response.headers['x-ratelimit-remaining'];
        const reset = response.headers['x-ratelimit-reset'];
        
        if (remaining) this.rateLimitRemaining = parseInt(remaining);
        if (reset) this.rateLimitReset = parseInt(reset) * 1000;
        
        return response;
      },
      async (error) => {
        if (error.response?.status === 429) {
          const retryAfter = error.response.headers['retry-after'] || 60;
          await this.sleep(retryAfter * 1000);
          return this.client.request(error.config);
        }
        throw error;
      }
    );
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async checkRateLimit(): Promise<void> {
    if (this.rateLimitRemaining < 10 && Date.now() < this.rateLimitReset) {
      const waitTime = this.rateLimitReset - Date.now();
      console.warn(`Rate limit low, waiting ${waitTime}ms`);
      await this.sleep(waitTime);
    }
  }

  async get<T>(endpoint: string, params?: any): Promise<T> {
    await this.checkRateLimit();
    try {
      const response = await this.client.get<T>(endpoint, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    await this.checkRateLimit();
    try {
      const response = await this.client.post<T>(endpoint, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    await this.checkRateLimit();
    try {
      const response = await this.client.put<T>(endpoint, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    await this.checkRateLimit();
    try {
      const response = await this.client.patch<T>(endpoint, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete<T>(endpoint: string): Promise<T> {
    await this.checkRateLimit();
    try {
      const response = await this.client.delete<T>(endpoint);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Paginated GET with automatic pagination handling
  async getPaginated<T>(
    endpoint: string,
    params?: any,
    maxResults?: number
  ): Promise<T[]> {
    const results: T[] = [];
    let nextUrl: string | undefined = undefined;
    let limit = params?.limit || 50;
    
    do {
      await this.checkRateLimit();
      
      try {
        const currentParams: any = nextUrl ? undefined : { ...params, limit };
        const url: string = nextUrl ? nextUrl.replace(this.baseUrl, '') : endpoint;
        
        const response: any = await this.client.get<PaginatedResponse<T>>(url, {
          params: currentParams
        });

        // Handle different response formats
        const data = response.data.results || 
                    response.data.contacts || 
                    response.data.lists || 
                    response.data.segments ||
                    response.data.campaigns ||
                    response.data.pages ||
                    response.data.posts ||
                    response.data.tags ||
                    [];
        
        results.push(...data);
        nextUrl = response.data._links?.next;
        
        if (maxResults && results.length >= maxResults) {
          return results.slice(0, maxResults);
        }
      } catch (error) {
        throw this.handleError(error);
      }
    } while (nextUrl);

    return results;
  }

  private handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<any>;
      
      if (axiosError.response) {
        const status = axiosError.response.status;
        const data = axiosError.response.data;
        
        let message = `Constant Contact API Error (${status})`;
        
        if (data?.error_message) {
          message += `: ${data.error_message}`;
        } else if (data?.error_key) {
          message += `: ${data.error_key}`;
        } else if (typeof data === 'string') {
          message += `: ${data}`;
        }
        
        return new Error(message);
      } else if (axiosError.request) {
        return new Error('No response from Constant Contact API');
      }
    }
    
    return error instanceof Error ? error : new Error('Unknown error occurred');
  }

  // Utility method to get rate limit status
  getRateLimitStatus(): { remaining: number; resetAt: Date } {
    return {
      remaining: this.rateLimitRemaining,
      resetAt: new Date(this.rateLimitReset)
    };
  }
}
