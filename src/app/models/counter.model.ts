export interface Counter {
  id: string | number;
  address: string;
  meter_serial: string;
  section: string;
  photos?: number;
  gps?: {
    id: string | number;
    latitude: number;
    longitude: number;
  };
}
