import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { ContactService } from './contact.service';
import { AddContactDto } from './dto/AddContactDto';

@ApiTags('contact')
@Controller('contact')
export class ContactController {
  constructor(private service: ContactService) {}

  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @Post()
  async addContact(@Body() data: AddContactDto) {
    return await this.service.addContact(data);
  }

  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @Get()
  async getContacts() {
    return await this.service.getContacts();
  }

  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @Delete(':contact_id')
  async removeContact(@Param('contact_id') friend_id: string) {
    return await this.service.removeContact(+friend_id);
  }
  @UseGuards(AuthGuard)
  @Get('/search')
  async searchUser(@Query('name') name) {
    return await this.service.searchUser(name);
  }
}
