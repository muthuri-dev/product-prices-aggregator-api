import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @Column()
  username: string;

  @Field({ nullable: false })
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Field()
  @Column()
  refreshToken: string;

  @Field()
  @Column({ default: false })
  isEmailConfirmed: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  activationToken?: string | null;
}
