import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Product {
  @Field()
  title: string;

  @Field()
  price: number;

  @Field(() => [String])
  categories: string[];

  @Field()
  image_url: string;

  @Field()
  url: string;
}
