import { Args, Query, Resolver } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  /**
   * Query to search products by title in Redis/OpenSearch.
   */
  @Query(() => [Product])
  async searchProductsByTitle(
    @Args('title') title: string,
  ): Promise<Product[]> {
    return this.productService.searchProducts(title);
  }

  /**
   * Query to fetch products by keywords using AmazonService.
   */
  @Query(() => [Product])
  async fetchProductsByKeywords(
    @Args('keywords') keywords: string,
    @Args('domain', { defaultValue: 'https://www.amazon.com' }) domain: string,
    @Args('pagesToSearch', { type: () => Number, defaultValue: 1 })
    pagesToSearch: number,
  ): Promise<any[]> {
    return this.productService.fetchProducts(keywords, domain, pagesToSearch);
  }
}
