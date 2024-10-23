import { Field, InputType } from '@nestjs/graphql'
import { IsEmail } from 'class-validator'

@InputType()
export class OauthLoginInput {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  picture?: string

  @Field()
  @IsEmail()
  email: string

  @Field()
  provider: string
}
