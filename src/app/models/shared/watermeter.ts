import { Read } from '../consumption/read';
import { Gps } from './gps';

export interface Watermeter {
  id: string;
  meter_serial: string;
  module: Product;
  product: Product;
  gps: Gps;
  addition_serial: string;
  appKey: string;
  devEui: string;
  listRead: Array<Read>;
  is_macro: boolean;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  type_product: Type_product;
  images: ImageProduct[];
}

interface Type_product {
  id: string;
  name: string;
  rf_technology: string;
  action: 'counter' | 'counter-module' | 'module' | 'gateway';
}

export interface ImageProduct {
  id: string;
  url: string;
}
