import {Field, ID, ObjectType} from "@nestjs/graphql";

@ObjectType()
export class ProductType {
    @Field(() => ID)
    id: string;

    @Field(() => String)
    title: string;

    @Field(() => String)
    price: string;
}