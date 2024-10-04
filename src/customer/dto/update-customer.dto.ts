import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create-customer.dto';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
    first_name?: string;
    last_name?: string;
    email?: string;
    timezone?: string;
  }
  