import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { HelpersService } from 'src/helpers/helpers.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/LoginDto';
import { RegisterDto } from './dto/RegisterDto';
import { UpdateProfileDto } from './dto/UpdateProfileDto';

@Injectable()
export class AuthService {
  // eslint-disable-next-line prettier/prettier
  constructor(private prisma: PrismaService, private helpers: HelpersService) { }

  async register(data: RegisterDto) {
    try {
      const checkUser = await this.prisma.users.findFirst({
        where: { email: data.email },
      });
      if (checkUser) {
        return this.helpers.generateResponse('User already registered');
      }
      data.password = await hash(data.password, 12);
      const user = await this.prisma.users.create({
        data,
        select: this.prisma.excludeUser(),
      });
      return this.helpers.generateResponse('Register Successfully', user);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(error, HttpStatus.BAD_GATEWAY, {
        cause: new Error(error),
      });
    }
  }
  async login(data: LoginDto) {
    try {
      const user = await this.prisma.users.findFirst({
        where: { email: data.email },
      });
      let comparePassword: string;

      if (user) {
        comparePassword = await compare(data.password, user.password);
      }

      if (!user || !comparePassword) {
        throw new HttpException(
          'Email or password not match',
          HttpStatus.BAD_REQUEST,
        );
      }

      const excludeUser = this.exlcudeUser(user);

      const generateAccessToken = await this.helpers.generateJWT({
        sub: excludeUser.id,
        email: excludeUser.email,
        name: excludeUser.name,
      });

      return this.helpers.generateResponse('Login success', {
        ...excludeUser,
        accessToken: generateAccessToken,
      });
    } catch (error) {
      return this.helpers.catchError(error);
    }
  }

  async getDetailUser(user_id: number) {
    try {
      const user = await this.prisma.users.findFirst({
        where: { id: user_id },
      });
      const excludeUser = this.exlcudeUser(user);
      if (!excludeUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return {
        statusCode: HttpStatus.OK,
        data: user,
        message: 'Success get profile',
      };
    } catch (error) {
      this.helpers.catchError(error);
    }
  }

  async uploadAvatar(user_id: number, avatar: string) {
    try {
      const user = await this.prisma.users.findFirst({
        where: { id: user_id },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }
      const updatedUserAvatar = await this.prisma.users.update({
        where: {
          id: user_id,
        },
        data: {
          avatar: avatar,
        },
      });

      if (!updatedUserAvatar) {
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      }

      return this.helpers.generateResponse('Success Upload Avatar');
    } catch (error) {
      return this.helpers.catchError(error);
    }
  }
  async updateProfile(user_id: number, data: UpdateProfileDto) {
    try {
      const user = await this.prisma.users.update({
        where: { id: user_id },
        data,
        select: this.prisma.excludeUser(),
      });
      if (!user) {
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      }
      return this.helpers.generateResponse('Update Profile Success', user);
    } catch (error) {
      return this.helpers.catchError(error);
    }
  }

  exlcudeUser(user) {
    return this.prisma.manualExclude(user, ['password', 'created_at']);
  }
}
