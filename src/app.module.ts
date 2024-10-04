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
import { LanguageModule } from './language/language.module';


@Module({
  imports: [
    // Charger les variables d'environnement à partir du fichier .env
    ConfigModule.forRoot({
      isGlobal: true, // Rend les variables d'environnement disponibles globalement
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
        synchronize: false, // Ne pas synchroniser en production
      }),
    }),
    CustomerModule,  // Module pour gérer les clients
    RentalModule,    // Module pour gérer les locations
    FilmModule, // Module pour gérer les films
    StaffModule,
    StoreModule, 
    AddressModule,
    CityModule,
    CountryModule,
    InventoryModule,
    TaskModule,
    LanguageModule,
  ],
})
export class AppModule { }
