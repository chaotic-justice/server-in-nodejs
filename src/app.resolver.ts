import { Resolver, Query, Args } from '@nestjs/graphql'

@Resolver()
export class AppResolver {
  @Query(() => String)
  helloWorld(): string {
    return 'Hello jolyne?'
  }
  @Query(() => String)
  hello(@Args('name') name: string): string {
    return `Hello ${name}!`
  }
}
