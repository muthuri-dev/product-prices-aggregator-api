import { Injectable } from '@nestjs/common';
import { SearchService } from '../search/search.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class ProductService {
  private readonly indexName = 'products';

  constructor(
    private readonly redisService: RedisService,
    private readonly openSearchService: SearchService,
  ) {}

  async getProductById(id: string): Promise<any> {
    const cacheKey = `product:${id}`;

    // Check Redis Cache
    const cachedProduct = await this.redisService.get(cacheKey);
    if (cachedProduct) {
      console.log('Cache hit:', cacheKey);
      return JSON.parse(cachedProduct);
    }

    // Fetch from Amazon API
    const fetchedProduct = await this.fetchFromAmazonAPI(id);

    // Cache the data
    await this.redisService.set(cacheKey, JSON.stringify(fetchedProduct), 3600);

    // Index in OpenSearch
    await this.openSearchService.indexProduct(this.indexName, fetchedProduct);

    return fetchedProduct;
  }

  private async fetchFromAmazonAPI(id: string): Promise<any> {
    console.log(`Fetching product data for ID: ${id}`);
    // Simulate API call
    return {
      asin: id,
      title: 'Sample Product',
      price: 99.99,
      availability: 'In Stock',
      categories: ['Electronics', 'Accessories'],
      rating: 4.5,
    };
  }
}
