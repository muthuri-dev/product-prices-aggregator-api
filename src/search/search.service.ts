import { Injectable } from '@nestjs/common';
import { Client } from '@opensearch-project/opensearch';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SearchService {
  private readonly client: Client;
  private readonly indexName = 'products';

  constructor(private readonly configService: ConfigService) {
    this.client = new Client({
      node: this.configService.get<string>('OPEN_SEARCH_URL'),
      auth: {
        username: this.configService.get<string>('OPEN_SEARCH_USERNAME'),
        password: this.configService.get<string>('OPEN_SEARCH_PASSWORD'),
      },
    });
  }

  async indexProduct(product: any): Promise<void> {
    await this.ensureIndexExists();
    await this.client.index({
      index: this.indexName,
      body: product,
    });
  }

  async ensureIndexExists(): Promise<void> {
    const exists = await this.client.indices.exists({ index: this.indexName });
    if (!exists.body) {
      await this.client.indices.create({
        index: this.indexName,
        body: {
          mappings: {
            properties: {
              title: { type: 'text' },
              price: { type: 'float' },
              categories: { type: 'keyword' },
              image_url: { type: 'text' },
              url: { type: 'text' },
            },
          },
        },
      });
    }
  }

  async searchByTitle(title: string): Promise<any[]> {
    const { body } = await this.client.search({
      index: this.indexName,
      body: {
        query: {
          match: { title },
        },
      },
    });

    return body.hits.hits.map((hit) => hit._source);
  }
}
