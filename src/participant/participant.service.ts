import { Inject, Injectable } from '@nestjs/common';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { HelpersService } from 'src/helpers/helpers.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class ParticipantService {
  constructor(
    private prisma: PrismaService,
    private helpers: HelpersService,
    @Inject(REQUEST) private req: any,
  ) {}

  async create(createParticipantDto: CreateParticipantDto) {
    try {
      const participant = await this.prisma.participants.findFirst({
        where: {
          user_id: createParticipantDto.user_id,
          room_id: createParticipantDto.room_id,
        },
      });

      if (participant) {
        return this.helpers.generateResponse(
          'Participants already created',
          participant,
        );
      }

      const createParticipant = await this.prisma.participants.create({
        data: createParticipantDto,
      });
      return this.helpers.generateResponse(
        'Success add participant',
        createParticipant,
      );
    } catch (error) {
      return this.helpers.catchError(error);
    }
  }

  async findAll(room_id: number) {
    try {
      const participants = await this.prisma.participants.findMany({
        where: {
          room_id: room_id,
        },
        include: {
          user: true,
        },
      });
      return this.helpers.generateResponse(
        'Success find participants',
        participants,
      );
    } catch (error) {
      return this.helpers.catchError(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} participant`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updatePartsicipantDto: UpdateParticipantDto) {
    return `This action updates a #${id} participant`;
  }

  async remove(id: number) {
    try {
      const participant = await this.prisma.participants.delete({
        where: {
          id: id,
        },
      });
      return this.helpers.generateResponse(
        'Success remove participant',
        participant,
      );
    } catch (error) {
      return this.helpers.catchError(error);
    }
  }
}
