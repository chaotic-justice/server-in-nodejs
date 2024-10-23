import { InputType, Field } from '@nestjs/graphql'
import { UpdateUserInput } from './update-user.input'

@InputType()
export class UpsertUserInput extends UpdateUserInput {
  @Field({ nullable: true })
  provider?: string
}
