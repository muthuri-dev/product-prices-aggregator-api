import { Injectable } from '@nestjs/common';
import { Client } from '@opensearch-project/opensearch';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SearchService {
  private readonly client: Client;

  constructor(private readonly configService: ConfigService) {
    this.client = new Client({
      node: this.configService.get<string>('OPEN_SEARCH_URL'),
      auth: {
        username: this.configService.get<string>('OPEN_SEARCH_USERNAME'),
        password: this.configService.get<string>('OPEN_SEARCH_PASSWORD'),
      },
    });
  }

  async indexProduct(index: string, product: any): Promise<void> {
    await this.client.index({
      index,
      id: product.asin,
      body: {
        title: product.title,
        price: product.price,
        availability: product.availability,
        categories: product.categories,
        rating: product.rating,
      },
    });
    console.log(`Product indexed: ${product.title}`);
  }

  async searchProductsByTitle(index: string, title: string): Promise<any> {
    const result = await this.client.search({
      index,
      body: {
        query: {
          match: {
            title: title,
          },
        },
      },
    });
    return result.body.hits.hits.map((hit) => hit._source);
  }
}
