import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { HelpersService } from 'src/helpers/helpers.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddContactDto } from './dto/AddContactDto';

@Injectable()
export class ContactService {
  constructor(
    private prisma: PrismaService,
    private helpers: HelpersService,
    @Inject(REQUEST) private req: any,
  ) {}

  async addContact(data: AddContactDto) {
    try {
      data.user_id = this.req.user.id;
      const contact = await this.prisma.contacts.create({
        data,
      });
      return this.helpers.generateResponse('Success add contact', contact);
    } catch (error) {
      this.helpers.catchError(error);
    }
  }

  async getContacts() {
    try {
      const contacts = await this.prisma.contacts.findMany({
        where: {
          user_id: this.req.user.id,
        },
        include: {
          friend: {
            select: this.prisma.excludeUser(),
          },
        },
      });
      return this.helpers.generateResponse('Success get all contact', contacts);
    } catch (error) {
      this.helpers.catchError(error);
    }
  }
  async removeContact(contact_id: number) {
    try {
      const contact = await this.prisma.contacts.delete({
        where: {
          id: contact_id,
        },
      });
      return this.helpers.generateResponse('Success remove contact', contact);
    } catch (error) {
      return this.helpers.catchError(error);
    }
  }
  async searchUser(username: string) {
    try {
      const users = await this.prisma.users.findMany({
        where: {
          name: {
            contains: username,
          },
        },
        select: this.prisma.excludeUser(),
      });
      if (users.length == 0) {
        return this.helpers.generateResponse('User not found', users);
      }
      return this.helpers.generateResponse('User found', users);
    } catch (error) {
      return this.helpers.catchError(error);
    }
  }
}
