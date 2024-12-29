import { Injectable } from '@nestjs/common';
import { NotificationsService } from '../notifications/notifications.service';
import { SearchService } from '../search/search.service';
import { AmazonService } from '../amazon/amazon.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly openSearchService: SearchService,
    private readonly notificationsService: NotificationsService,
    private readonly amazonService: AmazonService,
  ) {}

  async searchProducts(title: string) {
    // Check Redis cache
    const cachedProducts = await this.amazonService.getCachedProducts(title);
    if (cachedProducts) {
      return cachedProducts;
    }

    // Fallback to OpenSearch
    const openSearchResults = await this.openSearchService.searchByTitle(title);
    if (openSearchResults.length > 0) {
      return openSearchResults;
    }

    // Fetch products from Amazon API
    const products = await this.fetchProducts(
      title,
      'https://www.amazon.com',
      1,
    );
    return products;
  }

  /**
   * Fetch products from Amazon API, cache them in Redis, and index them in OpenSearch.
   */
  async fetchProducts(keywords: string, domain: string, pagesToSearch: number) {
    const products = await this.amazonService.fetchProducts(
      keywords,
      domain,
      pagesToSearch,
    );

    // Cache products in Redis--
    await this.amazonService.cacheProducts(keywords, products);

    // Index products in OpenSearch
    for (const product of products) {
      await this.openSearchService.indexProduct(product);
    }

    return products;
  }

  /**
   * Notify users about price drops for their selected products.
   */
  async notifyPriceDrop(product: any, userId: string, threshold: number) {
    // Check if the product is cached
    const cachedProduct = await this.amazonService.getCachedProduct(
      product.title,
    );
    const currentProduct = cachedProduct || product;

    if (currentProduct.price <= threshold) {
      await this.notificationsService.sendNotification('price-drop', {
        userId,
        product: currentProduct,
      });
    }
  }
}
