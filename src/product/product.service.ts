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
    return this.openSearchService.searchByTitle(title);
  }

  async fetchProducts(keywords: string, domain: string, pagesToSearch: number) {
    return this.amazonService.fetchProducts(keywords, domain, pagesToSearch);
  }

  async notifyPriceDrop(product: any, userId: string, threshold: number) {
    if (product.price <= threshold) {
      await this.notificationsService.sendNotification('price-drop', {
        userId,
        product,
      });
    }
  }
}
