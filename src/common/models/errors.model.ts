import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class GraphqlError {
  @Field({ description: 'Error message' }) message: string

  @Field({ description: 'Error code' }) code: string
}

@ObjectType()
export class GraphqlErrors {
  @Field(() => [GraphqlError], { description: 'List of errors' })
  errors: GraphqlError[]
}
