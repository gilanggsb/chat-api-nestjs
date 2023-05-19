import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Prisma } from '@prisma/client';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { jwt_config } from 'src/config/config_jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HelpersService {
  constructor(private jwtService: JwtService, private prisma: PrismaService) {}

  //generate jwt
  async generateJWT(payload: any) {
    return this.jwtService.sign(payload, {
      secret: jwt_config.secret,
      expiresIn: jwt_config.expired,
    });
  }

  //generate response
  generateResponse(message: string, data?: any, statusCode?: number) {
    return {
      statusCode: statusCode | HttpStatus.OK,
      message,
      data,
    };
  }

  //generateFailedResponse
  generateFailedResponse(errorMessage: string, statusCode?: number) {
    throw new HttpException(
      errorMessage,
      statusCode || HttpStatus.BAD_REQUEST,
      {
        cause: new Error(errorMessage),
      },
    );
  }

  static avatarMulterOptions: MulterOptions = {
    // limits: {
    //   fileSize: +process.env.MAX_FILE_SIZE,
    // },
    // Check the mimetypes to allow for upload
    fileFilter: (req: any, file: any, cb: any) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        // Reject file
        return cb(
          new HttpException(
            `Unsupported file type ${extname(file.originalname)}`,
            HttpStatus.BAD_REQUEST,
          ),
          false,
        );
      }
      // Allow storage of file
      cb(null, true);
    },
    storage: diskStorage({
      destination: 'public/uploads/images',
      filename: (req, file, cb) => {
        cb(null, file.originalname);
      },
    }),
  };

  catchError(error: any, message?: string) {
    let errorMessage = message || 'Unknown error occurred';
    if (error instanceof HttpException) {
      throw error;
    }
    console.log(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (error.code === 'P2002') {
        errorMessage =
          'There is a unique constraint violation, a new user cannot be created with this email';
        throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST, {
          cause: new Error(errorMessage),
        });
      }

      if (error.code === 'P2025') {
        errorMessage = error.meta.cause.toString() || 'Unknown error occurred';
        throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST, {
          cause: new Error(errorMessage),
        });
      }
    }
    throw new HttpException(errorMessage, HttpStatus.BAD_GATEWAY, {
      cause: new Error(errorMessage),
    });
  }
}
