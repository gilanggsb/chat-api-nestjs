import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { SendMessageDto } from './dto/send-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('message')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @Post()
  async sendMessage(@Body() sendMessageDto: SendMessageDto) {
    return await this.messageService.sendMessage(sendMessageDto);
  }

  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  @Get()
  async findAll(@Query('room_id') roomId: string) {
    return await this.messageService.findAll(+roomId);
  }

  @Get()
  async findOne(@Query('message_id') id: string) {
    return await this.messageService.findOne(+id);
  }

  @Patch()
  async updateMessage(
    @Query('message_id') id: string,
    @Body() updateMessageDto: UpdateMessageDto,
  ) {
    return await this.messageService.updateMessage(+id, updateMessageDto);
  }

  @Delete()
  async removeMessage(@Query('message_id') id: string) {
    return await this.messageService.removeMessage(+id);
  }
}
