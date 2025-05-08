import { Address } from '../shared/address';
import { Gps } from '../shared/gps';
import { Img } from '../shared/img';

export interface Location_route {
  id: number;
  name: string;
  type: string;
  type_location: Type_location;
  logo: Img;
  sketch: Img;
  invoice: Invoice;
  gps: Gps;
  address: Address;
  select?: boolean;
  gateways: any[];
}

interface Type_location {
  id: number;
  name: string;
}

interface Invoice {
  id: number;
  account_key: string;
  account_number_bank: string;
  beneficiary: string;
  concept: string;
  email: string;
  invoice_day: string;
  name_bank: string;
  round_index: number;
}
