import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create-customer.dto';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
  first_name?: string;
  last_name?: string;
  email?: string;
  store_id?: number;  
  address?: string;  
  district?: string;
  postal_code?: string;
  phone?: string;
  city?: string;
  country?: string;
}
