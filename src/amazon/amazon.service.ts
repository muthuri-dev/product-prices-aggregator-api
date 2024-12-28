import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { SearchService } from '../search/search.service';
import { firstValueFrom } from 'rxjs';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AmazonService {
  private readonly apiUrl = this.configService.get<string>('AMAZON_API_URL');
  private readonly apiToken =
    this.configService.get<string>('AMAZON_API_TOKEN');

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly openSearchService: SearchService,
    private readonly redisService: RedisService,
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
  ): Promise<any> {
    const cacheKey = `products:${keywords}:${domain}`;
    const cachedData = await this.redisService.getJSON<any[]>(cacheKey);

    if (cachedData) {
      console.log('Returning cached data from Redis');
      return cachedData;
    }

    const payload = [
      {
        keywords,
        domain,
        pages_to_search: pagesToSearch,
      },
    ];

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.apiUrl}/trigger`, payload, {
          headers: {
            Authorization: `Bearer ${this.apiToken}`,
            'Content-Type': 'application/json',
          },
        }),
      );

      const products = response.data; // Assuming the API response contains a `data` array of products

      // Cache the fetched data in Redis for 1 hour
      await this.redisService.setJSON(cacheKey, products, 3600);

      // Index the important fields in OpenSearch
      for (const product of products) {
        await this.openSearchService.indexProduct({
          title: product.title,
          price: product.final_price,
          categories: product.categories,
          image_url: product.image_url,
          url: product.url,
        });
      }

      return products;
    } catch (error) {
      console.error('Error fetching products from Amazon API:', error.message);
      throw error;
    }
  }
}
