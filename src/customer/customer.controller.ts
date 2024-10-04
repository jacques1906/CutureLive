import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';


@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  findAll(): Promise<Customer[]> {
    return this.customerService.findAllCustomers();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Customer> {
    return this.customerService.findCustomerById(id);
  }

  @Post()
  create(@Body() data: CreateCustomerDto): Promise<Customer>{
    return this.customerService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<Customer>): Promise<Customer> {
    return this.customerService.updateCustomer(id, data);
  }
}