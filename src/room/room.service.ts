import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HelpersService } from 'src/helpers/helpers.service';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class RoomService {
  constructor(
    private prisma: PrismaService,
    private helpers: HelpersService,
    @Inject(REQUEST) private req: any,
  ) {}

  async create(createRoomDto: CreateRoomDto) {
    try {
      createRoomDto.admin_id = this.req.user.id;
      const checkRoom = await this.prisma.rooms.findFirst({
        where: createRoomDto,
      });
      if (checkRoom) {
        return this.helpers.generateResponse('Room already exists', checkRoom);
      }
      const room = await this.prisma.rooms.create({
        data: createRoomDto,
      });
      return this.helpers.generateResponse('Success create room', room);
    } catch (error) {
      return this.helpers.catchError(error);
    }
  }

  async findAll() {
    try {
      const participants = await this.prisma.participants.findMany({
        where: {
          user_id: this.req.user.id,
        },
        include: {
          room: {
            include: {
              messages: {
                include: {
                  user: {
                    select: this.prisma.excludeUser(),
                  },
                },
              },
              last_message: {
                include: {
                  user: {
                    select: this.prisma.excludeUser(),
                  },
                },
              },
              participants: {
                include: {
                  user: {
                    select: this.prisma.excludeUser(),
                  },
                },
              },
            },
          },
        },
      });
      const rooms = participants.map((participant) => participant.room);
      return this.helpers.generateResponse('Success get rooms', rooms);
    } catch (error) {
      return this.helpers.catchError(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} room`;
  }

  async update(room_id: number, updateRoomDto: UpdateRoomDto) {
    try {
      const checkRoom = await this.prisma.rooms.findFirst({
        where: {
          id: room_id,
        },
      });
      if (!checkRoom) {
        return this.helpers.generateFailedResponse('Room not found');
      }
      const checkAdmin = await this.prisma.rooms.findFirst({
        where: {
          admin_id: this.req.user.id,
          id: room_id,
        },
      });
      if (!checkAdmin) {
        return this.helpers.generateFailedResponse(
          'Only admin can change this room',
        );
      }

      const room = await this.prisma.rooms.update({
        where: {
          id: room_id,
        },
        data: updateRoomDto,
        include: {
          participants: true,
          messages: true,
        },
      });
      return this.helpers.generateResponse('Success update room', room);
    } catch (error) {
      return this.helpers.catchError(error);
    }
  }

  async remove(room_id: number) {
    try {
      const room = await this.prisma.rooms.delete({
        where: {
          id: room_id,
        },
        include: {
          participants: true,
          messages: true,
        },
      });
      return this.helpers.generateResponse('Success remove room', room);
    } catch (error) {
      return this.helpers.catchError(error);
    }
  }

  async updateLastMessage(room_id: number, message_id: number) {
    try {
      const room = await this.prisma.rooms.update({
        where: {
          id: room_id,
        },
        data: {
          last_message_id: message_id,
        },
      });
      return this.helpers.generateResponse(
        'Success update last message in room',
        room,
      );
    } catch (error) {
      return this.helpers.catchError(error);
    }
  }
  async uploadImageRoom(room_id: number, avatar: string) {
    try {
      // const user = await this.prisma.users.findFirst({
      //   where: { id: user_id },
      // });
      // if (!user) {
      //   throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      // }
      // const updatedUserAvatar = await this.prisma.users.update({
      //   where: {
      //     id: user_id,
      //   },
      //   data: {
      //     avatar: avatar,
      //   },
      // });
      // if (!updatedUserAvatar) {
      //   throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      // }
      // return this.helpers.generateResponse('Success Upload Avatar');
    } catch (error) {
      return this.helpers.catchError(error);
    }
  }
}
