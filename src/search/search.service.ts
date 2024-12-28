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

  async indexProduct(product: any) {
    await this.client.index({
      index: 'products',
      body: {
        title: product.title,
        price: product.final_price,
        categories: product.categories,
        image_url: product.image_url,
        url: product.url,
      },
    });
  }

  async searchByTitle(title: string) {
    const { body } = await this.client.search({
      index: 'products',
      body: {
        query: {
          match: { title },
        },
      },
    });
    return body.hits.hits.map((hit) => hit._source);
  }
}
