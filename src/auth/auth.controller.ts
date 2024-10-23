import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Res,
  Inject,
  UseInterceptors,
} from '@nestjs/common'

import { AuthService } from './auth.service'
import { JwtDto } from './dto/jwt.dto'
import { ApiTags } from '@nestjs/swagger'
import { GoogleOauthGuard } from './google-oauth.guard'
import { Request, Response } from 'express'
import passport from 'passport'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuth(@Req() req: any, @Res() res: Response) {
    try {
      const user = req.user
      console.log('user', user)
      const token = await this.authService.oAuthLogin(req.user)
      console.log('redirecting..', token)
      // res.redirect(`${FRONTEND_URL}/oauth?token=${token.jwt}`)
      // res.redirect('http://localhost:3000')
      res.redirect('/auth')
    } catch (err) {
      res.status(500).send({ success: false, message: err.message })
    }
  }

  @Get('google/redirect')
  @UseGuards(GoogleOauthGuard)
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    // For now, we'll just show the user object
    return req.user
  }

  // @Get('callback/google')
  // @UseGuards(GoogleOauthGuard)
  // async googleAuthCallback(@Req() req: any, @Res() res: Response) {
  //   try {
  //     const token = await this.authService.oAuthLogin(req.user)
  //     console.log('token from oauth:', token)
  //     // res.redirect(`${FRONTEND_URL}/oauth?token=${token.jwt}`)
  //   } catch (err) {
  //     res.status(500).send({ success: false, message: err.message })
  //   }
  // }

  @Get()
  closing(): string {
    return 'clkosing hourse.'
  }

  // @Post('registerApplicant')
  // async create(@Body() existingUserDto: ExistingUserDto) {
  //   try {
  //     const user = await this.authService.registerUser(existingUserDto)
  //     return { success: true, data: user }
  //   } catch (err) {
  //     return { success: false, message: err.message }
  //   }
  // }

  // @Post('loginApplicant')
  // @HttpCode(HttpStatus.OK)
  // async login(@Body() loginUserDto: LoginUserDto) {
  //   try {
  //     const user = await this.authService.login(loginUserDto)
  //     return { success: true, data: user }
  //   } catch (err) {
  //     return { success: false, message: err.message }
  //   }
  // }

  // @Post('verify-jwt')
  // @HttpCode(HttpStatus.OK)
  // async verifyJwt(@Body() payload: JwtDto) {
  //   try {
  //     const user = await this.authService.verifyJwt(payload.jwt)
  //     return { success: true, data: user }
  //   } catch (err) {
  //     return { success: false, message: err.message }
  //   }
  // }
}
