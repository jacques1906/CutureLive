import { FindOperator } from "typeorm";

export class CreateCustomerDto {
  first_name: string;
  last_name: string;
  email: string;
  store_id: number;  // Utiliser store_id pour associer le client à un magasin
  activebool: boolean;
  active: number;
  address_id: number;
  address: string;
  district: string;
  phone: string;
  postal_code: string;
  city: string;
  country: string;
}