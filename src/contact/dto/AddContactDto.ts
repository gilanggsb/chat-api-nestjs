import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddContactDto {
  user_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  friend_id: number;
}
