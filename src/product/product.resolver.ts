import { Args, Query, Resolver } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => [Product])
  async searchProducts(@Args('title') title: string) {
    return this.productService.searchProducts(title);
  }

  @Query(() => [Product])
  async fetchProducts(
    @Args('keywords') keywords: string,
    @Args('domain') domain: string,
    @Args('pagesToSearch') pagesToSearch: number,
  ) {
    return this.productService.fetchProducts(keywords, domain, pagesToSearch);
  }
}
