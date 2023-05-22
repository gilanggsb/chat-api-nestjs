import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { HelpersService } from 'src/helpers/helpers.service';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/LoginDto';
import { RegisterDto } from './dto/RegisterDto';
import { UpdateProfileDto } from './dto/UpdateProfileDto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('register')
  async register(@Body() data: RegisterDto) {
    return await this.service.register(data);
  }

  @Post('login')
  async login(@Body() data: LoginDto) {
    return await this.service.login(data);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('accessToken')
  @Get('profile')
  async getDetailUser(@Req() req) {
    return await this.service.getDetailUser(req.user.id);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('avatar', HelpersService.avatarMulterOptions),
  )
  @Post('avatar')
  async uploadAvatar(@Req() req, @UploadedFile() file: Express.Multer.File) {
    return await this.service.uploadAvatar(
      req.user.id,
      'uploads/images/' + file.filename,
    );
  }

  @UseGuards(AuthGuard)
  @Patch(':user_id')
  @ApiBearerAuth('accessToken')
  async updateProfile(
    @Param('user_id') user_id: any,
    @Body() data: UpdateProfileDto,
  ) {
    return await this.service.updateProfile(+user_id, data);
  }
}
