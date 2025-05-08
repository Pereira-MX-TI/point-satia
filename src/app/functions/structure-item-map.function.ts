import { ItemMapConsumption } from '../models/consumption/item-map-consumption.model';
import { PickupMap } from '../models/map/pickupMap';

export function structureMapPickup(list: PickupMap): PickupMap {
  const listPoint: PickupMap = {
    readAll: [],
    readWithAlarm: [],
    readWithoutAlarm: [],
    readFraud: [],
    readFlowReturn: [],
    readLeakage: [],
    readStopped: [],

    waterMeterWithReads: [],
    waterMeterWithoutReads: [],
    waterMeterWithAlarm: [],
    waterMeterWithoutAlarm: [],

    waterMeterFraud: [],
    waterMeterFlowReturn: [],
    waterMeterLeakage: [],
    waterMeterStopped: [],
  };

  for (const key in listPoint) {
    if (listPoint.hasOwnProperty(key) && list[key as keyof PickupMap]) {
      list[key as keyof PickupMap].forEach((itrW: any) => {
        listPoint[key as keyof PickupMap].push({
          name: `${itrW.water_meter.meter_serial}~${itrW.pickup.id}~${itrW.water_meter.place_id}`,
          gps: itrW.gps,
          zoom: 0,
          type: 'point',
        });
      });
    }
  }

  return listPoint;
}

export function structureMapConsumption(
  waterMeterWithConsumptions: ItemMapConsumption[],
  waterMeterWithoutConsumptions: ItemMapConsumption[]
): ItemMapConsumption[] {
  const list: ItemMapConsumption[] = [];

  waterMeterWithConsumptions.forEach((itr: ItemMapConsumption) => {
    list.push({ ...itr, status: 'done' });
  });

  waterMeterWithoutConsumptions.forEach((itr: ItemMapConsumption) => {
    list.push({ ...itr, status: 'fail' });
  });

  return list;
}
