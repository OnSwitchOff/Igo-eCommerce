import {ArgsType, Field, ID, Int} from "@nestjs/graphql";

@ArgsType()
export class PaginationArgs {
    @Field(() => ID, {nullable: true})
    cursor?: string;

    @Field(() => Int)
    limit: number = 10;
}
