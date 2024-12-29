import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SearchService } from '../search/search.service';
import { RedisService } from '../redis/redis.service';
import { BrightDataService } from '../bright-data/bright-data.service';

@Injectable()
export class AmazonService {
  private readonly apiUrl =
    this.configService.getOrThrow<string>('AMAZON_API_URL');
  private readonly apiToken =
    this.configService.getOrThrow<string>('AMAZON_API_TOKEN');

  constructor(
    private readonly configService: ConfigService,
    private readonly searchService: SearchService,
    private readonly redisService: RedisService,
    private readonly brightDataService: BrightDataService,
  ) {}

  /**
   * Fetch products from Amazon API, cache in Redis, and index in OpenSearch.
   * @param keywords Search keywords
   * @param domain Amazon domain (e.g., https://www.amazon.com)
   * @param pagesToSearch Number of pages to search
   */

  async fetchProducts(
    keywords: string,
    domain: string,
    pagesToSearch: number,
  ): Promise<any[]> {
    const snapshotId = await this.brightDataService.triggerDataCollection([
      { keywords, domain, pages_to_search: pagesToSearch },
    ]);

    const products = await this.brightDataService.fetchData(snapshotId);

    return products;
  }

  /**
   * Get cached products from Redis.
   */
  async getCachedProducts(keywords: string): Promise<any[]> {
    const cacheKey = `products:${keywords}`;
    return this.redisService.getJSON<any[]>(cacheKey);
  }

  /**
   * Cache products in Redis.
   */
  async cacheProducts(keywords: string, products: any[]): Promise<void> {
    const cacheKey = `products:${keywords}`;
    await this.redisService.setJSON(cacheKey, products, 3600); // Cache for 1 hour
  }

  /**
   * Get a specific product by title from the cached products.
   */
  async getCachedProduct(title: string): Promise<any | null> {
    const products = await this.getCachedProducts(title);
    if (!products) {
      return null;
    }

    return products.find((product) => product.title === title) || null;
  }
}
