import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from 'nestjs-prisma'
import { Mock, vi } from 'vitest'
import { AuthService } from './auth.service'
import { SignupInput } from './dto/signup.input'
import { Token } from './models/token.model'
import { PasswordService } from './password.service'

describe('AuthService', () => {
  let authService: AuthService
  let prismaService: PrismaService
  let passwordService: PasswordService
  let jwtService: JwtService

  const mockJwtService = {
    sign: vi.fn().mockReturnValue('token'),
  }

  const mockPrismaService = {
    user: {
      create: vi.fn(),
    },
  }

  const mockPasswordService = {
    hashPassword: vi.fn(),
  }

  const mockConfigService = {
    get: vi.fn(),
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
      ;(passwordService.hashPassword as Mock).mockResolvedValue(hashedPassword)

      // Mock the Prisma service to return a user object when creating a user
      const createdUser = {
        email: signupInput.email,
        password: hashedPassword,
        role: 'USER',
      }

      const userMock = prismaService.user.create as Mock
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
      expect(result).toEqual({ accessToken: 'token', refreshToken: 'token' })
      expect(jwtService.sign).toHaveBeenCalledTimes(2)
    })

    it('should throw a ConflictException if email is already used', async () => {
      const signupInput: SignupInput = {
        email: 'test@example.com',
        password: 'password123',
      }

      // Mock the password service
      // eslint-disable-next-line prettier/prettier
      ;;(passwordService.hashPassword as Mock).mockResolvedValue(
        'hashedPassword',
      )

      // Mock Prisma to throw a conflict error
      ;(prismaService.user.create as Mock).mockRejectedValue({
        code: 'P2002',
      })

      await expect(authService.createUser(signupInput)).rejects.toThrow()
    })
  })
})
