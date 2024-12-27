// src/products/models/product.model.ts
import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProductVariation {
  @Field(() => ID)
  asin: string;

  @Field({ nullable: true })
  name: string;

  @Field(() => Float, { nullable: true })
  price: number;

  @Field({ nullable: true })
  currency: string;
}

@ObjectType()
export class ProductDetail {
  @Field()
  type: string;

  @Field()
  value: string;
}

@ObjectType()
export class Product {
  @Field(() => ID)
  asin: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  seller_name: string;

  @Field()
  brand: string;

  @Field()
  description: string;

  @Field(() => Float)
  initial_price: number;

  @Field(() => Float, { nullable: true })
  final_price: number;

  @Field()
  currency: string;

  @Field()
  availability: string;

  @Field(() => Int)
  reviews_count: number;

  @Field(() => [String])
  categories: string[];

  @Field(() => Float)
  rating: number;

  @Field(() => [String])
  images: string[];

  @Field(() => [ProductVariation], { nullable: true })
  variations: ProductVariation[];

  @Field(() => [ProductDetail], { nullable: true })
  product_details: ProductDetail[];

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
