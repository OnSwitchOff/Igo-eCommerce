import {Query,  Resolver} from "@nestjs/graphql";

@Resolver(() => String)
export class TestResolver {

    @Query(() => String)
    async hello(): Promise<String> {
        return "Hello!";
    }
}