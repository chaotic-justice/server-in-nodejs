import {
  Resolver,
  Mutation,
  Query,
  Args,
  Parent,
  ResolveField,
} from '@nestjs/graphql'
import { AuthService } from './auth.service'
import { Auth } from './models/auth.model'
import { Token } from './models/token.model'
import { LoginInput } from './dto/login.input'
import { SignupInput } from './dto/signup.input'
import { RefreshTokenInput } from './dto/refresh-token.input'
import { User } from '../users/models/user.model'
import { OauthLoginInput } from './dto/oauth-login.input'

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly auth: AuthService) {}

  @Mutation(() => Auth)
  async signup(@Args('data') data: SignupInput) {
    data.email = data.email.toLowerCase()
    const { accessToken, refreshToken } = await this.auth.createUser(data)
    return {
      accessToken,
      refreshToken,
    }
  }

  @Mutation(() => Auth)
  async login(@Args('data') { email, password }: LoginInput) {
    const { accessToken, refreshToken } = await this.auth.login(
      email.toLowerCase(),
      password,
    )
    return {
      accessToken,
      refreshToken,
    }
  }

  // create a new user if not exists
  @Mutation(() => Auth)
  async oAuthLogin(@Args('data') data: OauthLoginInput) {
    const { accessToken, refreshToken } = await this.auth.oAuthLogin(data)
    return {
      accessToken,
      refreshToken,
    }
  }

  @Mutation(() => Token)
  async refreshToken(@Args() { token }: RefreshTokenInput) {
    return this.auth.refreshToken(token)
  }

  @Query(() => User)
  async getUser(
    @Args({ name: 'token', type: () => String, nullable: true })
    token: string,
  ) {
    return await this.auth.getUserFromToken(token)
  }

  @ResolveField('user', () => User)
  async user(@Parent() auth: Auth) {
    return await this.auth.getUserFromToken(auth.accessToken)
  }
}
