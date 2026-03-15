import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PageInfo {
  @Field(() => ID, { nullable: true })
  cursor?: string;

  @Field(() => Boolean)
  hasNextPage: Boolean;
}
