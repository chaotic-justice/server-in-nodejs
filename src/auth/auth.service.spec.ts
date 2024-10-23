import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'nestjs-prisma'
import { ConfigService } from '@nestjs/config'
import { PasswordService } from './password.service'
import { SignupInput } from './dto/signup.input'
import { Token } from './models/token.model'

describe('AuthService', () => {
  let authService: AuthService
  let prismaService: PrismaService
  let passwordService: PasswordService
  let jwtService: JwtService

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('token'),
  }

  const mockPrismaService = {
    user: {
      create: jest.fn(),
    },
  }

  const mockPasswordService = {
    hashPassword: jest.fn(),
  }

  const mockConfigService = {
    get: jest.fn(), // Mock the get method if needed
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: PasswordService, useValue: mockPasswordService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile()

    authService = module.get<AuthService>(AuthService)
    prismaService = module.get<PrismaService>(PrismaService)
    passwordService = module.get<PasswordService>(PasswordService)
    jwtService = module.get<JwtService>(JwtService)
  })

  it('should be defined', () => {
    expect(authService).toBeDefined()
  })

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const signupInput: SignupInput = {
        email: 'test@example.com',
        password: 'password123',
      }

      const hashedPassword = 'hashedPassword'

      // Mock the password service to return a hashed password
      ;(passwordService.hashPassword as jest.Mock).mockResolvedValue(
        hashedPassword,
      )

      // Mock the Prisma service to return a user object when creating a user
      const createdUser = {
        email: signupInput.email,
        password: hashedPassword,
        role: 'USER',
      }

      const userMock = prismaService.user.create as jest.Mock
      userMock.mockResolvedValue(createdUser)

      // Call the createUser method
      const result: Token = await authService.createUser(signupInput)

      // Assertions
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          ...signupInput,
          password: hashedPassword,
          role: 'USER',
        },
      })
      console.log('result', result)
      expect(result).toEqual({ accessToken: 'token', refreshToken: 'token' })
      expect(jwtService.sign).toHaveBeenCalledTimes(2)
    })

    it('should throw a ConflictException if email is already used', async () => {
      const signupInput: SignupInput = {
        email: 'test@example.com',
        password: 'password123',
      }

      // Mock the password service
      ;(passwordService.hashPassword as jest.Mock).mockResolvedValue(
        'hashedPassword',
      )

      // Mock Prisma to throw a conflict error
      ;(prismaService.user.create as jest.Mock).mockRejectedValue({
        code: 'P2002',
      })

      await expect(authService.createUser(signupInput)).rejects.toThrow()
    })
  })
})
