import { Address } from './address';
import { Watermeter } from './watermeter';
import { Customer } from './customer';
import { Section } from './section';
import { Sketch } from './sketch.model';

export interface Place {
  id: string;
  location_id: string;
  type_place: Type_place;
  water_meter: Watermeter[];
  address: Address;
  customer: Customer | null;
  section: Section;
  sketch?: Sketch;
}

export interface Type_place {
  id: string;
  name: string;
}
