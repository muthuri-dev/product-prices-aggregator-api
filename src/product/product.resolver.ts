import { Args, Query, Resolver } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { SearchService } from '../search/search.service';

@Resolver(() => Product)
export class ProductResolver {
  constructor(
    private readonly productService: ProductService,
    private readonly openSearchService: SearchService,
  ) {}

  @Query(() => [Product])
  async searchProductsByTitle(
    @Args('title') title: string,
  ): Promise<Product[]> {
    const index = 'products';
    return this.openSearchService.searchProductsByTitle(index, title);
  }

  // @Query(() => [Product], { name: 'product' })
  // findAll() {
  //   return this.productService.findAll();
  // }
}
