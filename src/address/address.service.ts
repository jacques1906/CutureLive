import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { City } from '../city/entities/city.entity';
import { Country } from 'src/country/entities/country.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,

    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,

    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,

  ) {}

  findAll(): Promise<Address[]> {
    return this.addressRepository.find({ relations: ['city'] });
  }

  findOne(address_id: number): Promise<Address> {
    return this.addressRepository.findOne({ where: { address_id }, relations: ['city'] });
  }

  async createAddress(createAddressDto: CreateAddressDto): Promise<Address> {
    const country = await this.countryRepository.findOne({ where: { country : createAddressDto.country_name } });
    if (!country) {
      throw new Error(`Country with name '${createAddressDto.country_name}' not found`);
    }
    const city = await this.cityRepository.findOne({ where: { name: createAddressDto.city_name } });
    if (!city) {
      throw new Error(`City with name '${createAddressDto.city_name}' not found`);
    }

    const address = this.addressRepository.create({
      ...createAddressDto,
      city,
    });

    return this.addressRepository.save(address);
  }

  update(id: number, addressData: Partial<Address>): Promise<Address> {
    return this.addressRepository.save({ id, ...addressData });
  }

  delete(id: number): Promise<void> {
    return this.addressRepository.delete(id).then(() => undefined);
  }
}
