import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomerModule } from './customer/customer.module';
import { RentalModule } from './rental/rental.module';
import { FilmModule } from './film/film.module';
import { StoreModule } from './store/store.module';
import { AddressModule } from './address/address.module';
import { StaffModule } from './staff/staff.module';
import { CityModule } from './city/city.module';
import { CountryModule } from './country/country.module';
import { InventoryModule } from './inventory/inventory.module';
import { TaskModule } from './task/task.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: String(configService.get<string | number>('DATABASE_PASSWORD')),
        database: configService.get<string>('DATABASE_NAME'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    CustomerModule, 
    RentalModule,   
    FilmModule, 
    StaffModule,
    StoreModule, 
    AddressModule,
    CityModule,
    CountryModule,
    InventoryModule,
    TaskModule,
  ],
})
export class AppModule { }
