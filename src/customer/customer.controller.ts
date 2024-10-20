import { Controller, Get, Post, Body, Patch, Param, Delete, Put, NotFoundException, Query } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { FindCustomersQueryDto } from './dto/find-customers-query.dto';


@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  findAll(@Query() query: FindCustomersQueryDto) {
    return this.customerService.findAllCustomers(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Customer> {
    const customer = await this.customerService.findCustomerById(id);
    
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer;
  }

  @Post()
  create(@Body() data: CreateCustomerDto): Promise<Customer>{
    return this.customerService.create(data);
  }

  @Put(':id')
  async updateCustomers(
    @Param('id') id: number,
    @Body() updateCustomerDto: UpdateCustomerDto
  ): Promise<Customer> {
    return this.customerService.updateCustomer(id, updateCustomerDto);
  }
}
