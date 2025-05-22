import { AttachFile } from './attach-file.model';
import { Gps } from './map/gps';

export interface Counter {
  id: string | number;
  address: string;
  meter_serial: string;
  section: string;
  photos?: Array<AttachFile>;
  gps?: Gps;
}
