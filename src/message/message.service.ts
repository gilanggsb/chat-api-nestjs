import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SendMessageDto } from './dto/send-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { REQUEST } from '@nestjs/core';
import { HelpersService } from 'src/helpers/helpers.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoomService } from 'src/room/room.service';

@Injectable()
export class MessageService {
  constructor(
    private prisma: PrismaService,
    private helpers: HelpersService,
    private roomService: RoomService,
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
        data: {
          message: sendMessageDto.message,
          user_id: this.req.user.id,
          room_id: sendMessageDto.room_id,
        },
      });
      await this.roomService.updateLastMessage(chats.room_id, chats.id);
      return this.helpers.generateResponse('Success send message', chats);
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
        include: {
          user: {
            select: this.prisma.excludeUser(),
          },
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
      const chat = await this.prisma.messages.findFirst({ where: { id: id } });
      await this.roomService.updateLastMessage(chat.room_id, null);
      const deletedChat = await this.prisma.messages.delete({
        where: {
          id: id,
        },
      });
      return this.helpers.generateResponse(
        'Success remove message',
        deletedChat,
      );
    } catch (error) {
      return this.helpers.catchError(error);
    }
  }
}
