import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateParticipantDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  room_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  user_id: number;
}
