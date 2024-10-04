import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { Store } from 'src/store/entities/store.entity';
import { Address } from 'src/address/entities/address.entity';
import { AddressService } from 'src/address/address.service';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,

    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,

    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,

    private readonly addressService: AddressService,
  ) { }

  async findCustomerById(id: number): Promise<Customer> {
    return this.customerRepository.findOne({ where: { customer_id: id } });
  }

  async create(customerData: CreateCustomerDto): Promise<Customer> {
    const store = await this.storeRepository.findOne({ where: { store_id: customerData.store_id } });

    if (!store) {
      throw "No store"
    }

    let customerAddress = await this.addressRepository.findOne({
      where: {
        address: customerData.address,
        district: customerData.district,
        postal_code: customerData.postal_code,
        city: {
          name: customerData.city,
          country: {
            country: customerData.country
          }
        }
      },
      relations: ['city', 'city.country'],
    });

    if (!customerAddress) {
      customerAddress = await this.addressService.createAddress({
        "address": customerData.address,
        "district": customerData.district,
        "postal_code": customerData.postal_code,
        "phone": customerData.phone,
        "city_name": customerData.city,
        "country_name": customerData.country,
      })
    }

    const customer = this.customerRepository.create({
      ...customerData,
      store,
      address: customerAddress,
    });

    return this.customerRepository.save(customer);
  }

  async updateCustomer(id: number, data: Partial<Customer>): Promise<Customer> {
    await this.customerRepository.update(id, data);
    return this.findCustomerById(id);
  }

  async findAllCustomers(): Promise<Customer[]> {
    return this.customerRepository.find()
  }

  async deleteCustomer(id: number): Promise<void> {
    await this.customerRepository.delete(id);
  }
}
