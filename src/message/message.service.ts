import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SendMessageDto } from './dto/send-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { REQUEST } from '@nestjs/core';
import { HelpersService } from 'src/helpers/helpers.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessageService {
  constructor(
    private prisma: PrismaService,
    private helpers: HelpersService,
    @Inject(REQUEST) private req: any,
  ) {}
  async sendMessage(sendMessageDto: SendMessageDto) {
    try {
      const checkRoom = await this.prisma.rooms.findFirst({
        where: {
          id: sendMessageDto.room_id,
          participants: {
            some: {
              user_id: this.req.user.id,
            },
          },
        },
      });
      if (!checkRoom) {
        return this.helpers.generateFailedResponse(
          'Room Not Found',
          HttpStatus.BAD_REQUEST,
        );
      }
      const chats = await this.prisma.messages.create({
        data: sendMessageDto,
      });
      return this.helpers.generateResponse('Success create room', chats);
    } catch (error) {
      return this.helpers.catchError(error);
    }
  }

  async findAll(room_id: number) {
    try {
      const chats = await this.prisma.messages.findMany({
        where: {
          room_id: room_id,
        },
      });
      return this.helpers.generateResponse('Success get chats', chats);
    } catch (error) {
      return this.helpers.catchError(error);
    }
  }

  async findOne(id: number) {
    try {
      const chats = await this.prisma.messages.findFirst({
        where: {
          id: id,
        },
      });
      return this.helpers.generateResponse('Success update message', chats);
    } catch (error) {
      return this.helpers.catchError(error);
    }
  }

  async updateMessage(id: number, updateMessageDto: UpdateMessageDto) {
    try {
      const chats = await this.prisma.messages.update({
        where: {
          id: id,
        },
        data: updateMessageDto,
      });
      return this.helpers.generateResponse('Success update message', chats);
    } catch (error) {
      return this.helpers.catchError(error);
    }
  }

  async removeMessage(id: number) {
    try {
      const chats = await this.prisma.messages.delete({
        where: {
          id: id,
        },
      });
      return this.helpers.generateResponse('Success remove message', chats);
    } catch (error) {
      return this.helpers.catchError(error);
    }
  }
}
