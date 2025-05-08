import { User } from '../authentication/account';
import { Img } from './img';

export interface Customer {
  id: string;
  account_name: string;
  account_number: string;
  logo: Img;
  user: User;
}
