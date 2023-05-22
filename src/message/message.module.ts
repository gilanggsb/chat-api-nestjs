import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { RoomService } from 'src/room/room.service';

@Module({
  controllers: [MessageController],
  providers: [MessageService, RoomService],
})
export class MessageModule {}
