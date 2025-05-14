export interface Counter {
  id: string | number;
  address: string;
  meter_serial: string;
  section: string;
  photos?: any[];
  gps?: {
    id: string | number;
    latitude: number;
    longitude: number;
  };
}
