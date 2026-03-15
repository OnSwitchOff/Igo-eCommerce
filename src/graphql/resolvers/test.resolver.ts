import { Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/gql-auth.guard';
import { CurrentUser } from '../../auth/current-user.decorator';

@Resolver(() => String)
export class TestResolver {
  @UseGuards(GqlAuthGuard)
  @Query(() => String)
  async hello(@CurrentUser() user: any): Promise<string> {
    return `Hello ${user.email}!`;
  }

  @Query(() => String)
  async ping(): Promise<string> {
    return `pong!`;
  }
}
