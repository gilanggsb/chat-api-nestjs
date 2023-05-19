import { PartialType } from '@nestjs/swagger';
import { RegisterDto } from './RegisterDto';

export class UpdateProfileDto extends PartialType(RegisterDto) {}
