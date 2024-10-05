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

    // Mettre à jour les informations de base du client
    if (updateCustomerDto.first_name) customer.first_name = updateCustomerDto.first_name;
    if (updateCustomerDto.last_name) customer.last_name = updateCustomerDto.last_name;
    if (updateCustomerDto.email) customer.email = updateCustomerDto.email;

    const address = customer.address;

    if (!address) {
      throw new NotFoundException(`Address for customer with ID ${id} not found`);
    }

    // Mettre à jour l'adresse
    if (updateCustomerDto.address) address.address = updateCustomerDto.address;
    if (updateCustomerDto.district) address.district = updateCustomerDto.district;
    if (updateCustomerDto.postal_code) address.postal_code = updateCustomerDto.postal_code;
    if (updateCustomerDto.phone) address.phone = updateCustomerDto.phone;

    // Mettre à jour la ville et le pays si fournis
    if (updateCustomerDto.city || updateCustomerDto.country) {
      // Rechercher la nouvelle ville
      const city = await this.cityRepository.findOne({
        where: { name: updateCustomerDto.city },
        relations: ['country'],
      });

      if (!city) {
        throw new NotFoundException(`City with name ${updateCustomerDto.city} not found`);
      }

      // Vérifier que le pays est cohérent avec la ville
      if (updateCustomerDto.country && city.country.country !== updateCustomerDto.country) {
        const country = await this.countryRepository.findOne({ where: { country: updateCustomerDto.country } });
        if (!country) {
          throw new NotFoundException(`Country with name ${updateCustomerDto.country} not found`);
        }
        // Mettre à jour la ville et le pays de l'adresse
        city.country = country;
      }

      address.city = city;
    }

    // Enregistrer l'adresse mise à jour
    await this.addressRepository.save(address);

    // Enregistrer les informations du client mises à jour
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

  async findAllCustomers(): Promise<Customer[]> {
    return this.customerRepository.find()
  }

  async deleteCustomer(id: number): Promise<void> {
    await this.customerRepository.delete(id);
  }
}
