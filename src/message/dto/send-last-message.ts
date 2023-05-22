import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateLastMessageDto {
  user_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  room_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  message: string;
}
