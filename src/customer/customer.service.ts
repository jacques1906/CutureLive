import { Injectable } from '@nestjs/common';
import { Controller, Get, Post, Body, Patch, Param, Delete, Put, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { Store } from 'src/store/entities/store.entity';
import { Address } from 'src/address/entities/address.entity';
import { AddressService } from 'src/address/address.service';
import { UpdateAddressDto } from 'src/address/dto/update-address.dto';
import { City } from 'src/city/entities/city.entity';
import { Country } from 'src/country/entities/country.entity';
import { FindCustomersQueryDto } from './dto/find-customers-query.dto';

@Injectable()
export class CustomerService {
  updateCustomerAddress(customerId: number, updateAddressDto: UpdateAddressDto) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,

    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,

    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,

    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,

    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,

    private readonly addressService: AddressService,
  ) { }

  async findCustomerById(id: number): Promise<Customer> {
    return this.customerRepository.findOne({ where: { customer_id: id } });
  }

  async updateCustomer(id: number, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.customerRepository.findOne({ where: { customer_id: id }, relations: ['address', 'address.city', 'address.city.country'] });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    if (updateCustomerDto.first_name) customer.first_name = updateCustomerDto.first_name;
    if (updateCustomerDto.last_name) customer.last_name = updateCustomerDto.last_name;
    if (updateCustomerDto.email) customer.email = updateCustomerDto.email;

    const address = customer.address;

    if (!address) {
      throw new NotFoundException(`Address for customer with ID ${id} not found`);
    }


    if (updateCustomerDto.address) address.address = updateCustomerDto.address;
    if (updateCustomerDto.district) address.district = updateCustomerDto.district;
    if (updateCustomerDto.postal_code) address.postal_code = updateCustomerDto.postal_code;
    if (updateCustomerDto.phone) address.phone = updateCustomerDto.phone;


    if (updateCustomerDto.city || updateCustomerDto.country) {

      const city = await this.cityRepository.findOne({
        where: { name: updateCustomerDto.city },
        relations: ['country'],
      });

      if (!city) {
        throw new NotFoundException(`City with name ${updateCustomerDto.city} not found`);
      }


      if (updateCustomerDto.country && city.country.country !== updateCustomerDto.country) {
        const country = await this.countryRepository.findOne({ where: { country: updateCustomerDto.country } });
        if (!country) {
          throw new NotFoundException(`Country with name ${updateCustomerDto.country} not found`);
        }

        city.country = country;
      }

      address.city = city;
    }

    await this.addressRepository.save(address);


    return this.customerRepository.save(customer);
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

  async update(addressId: number, updateAddressDto: UpdateAddressDto): Promise<Address> {
    const address = await this.addressRepository.findOne({ where: { address_id: addressId } });

    if (!address) {
      throw new NotFoundException(`Address with ID ${addressId} not found`);
    }

    Object.assign(address, updateAddressDto);

    return this.addressRepository.save(address);
  }

  async findAllCustomers(query: FindCustomersQueryDto) {
    const { firstName, lastName, email, page, limit, sortBy, sortOrder } = query;

    const queryBuilder = this.customerRepository.createQueryBuilder('customer');

    if (firstName) {
      queryBuilder.andWhere('customer.first_name ILIKE :firstName', { firstName: `%${firstName}%` });
    }

    if (lastName) {
      queryBuilder.andWhere('customer.last_name ILIKE :lastName', { lastName: `%${lastName}%` });
    }

    if (email) {
      queryBuilder.andWhere('customer.email ILIKE :email', { email: `%${email}%` });
    }

    queryBuilder.orderBy(`customer.${sortBy}`, sortOrder);
    try {
      const total = await queryBuilder.getCount();

      const customers = await queryBuilder
        .skip((page - 1) * limit)
        .take(limit)
        .getMany();

      return {
        data: customers,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    } catch (error) {
      console.error('error', error);
      throw error;
    }

  }

  async deleteCustomer(id: number): Promise<void> {
    await this.customerRepository.delete(id);
  }
}
