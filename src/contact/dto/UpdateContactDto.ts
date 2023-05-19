import { PartialType } from '@nestjs/swagger';
import { AddContactDto } from './AddContactDto';

export class UpdateContactDto extends PartialType(AddContactDto) {}
