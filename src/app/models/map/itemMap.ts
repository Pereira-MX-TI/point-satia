export interface ItemMap {
  meter_serial: string;
  place_id: number;
}

export interface ItemMapPickup extends ItemMap {
  pickup_id: number;
}
