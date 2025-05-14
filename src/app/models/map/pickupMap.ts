import { PointMap } from './pointMap';

export interface PickupMap {
  readAll: PointMap[];
  readWithAlarm: PointMap[];
  readWithoutAlarm: PointMap[];
  readFraud: PointMap[];
  readFlowReturn: PointMap[];
  readLeakage: PointMap[];
  readStopped: PointMap[];

  waterMeterWithReads: PointMap[];
  waterMeterWithoutReads: PointMap[];
  waterMeterWithAlarm: PointMap[];
  waterMeterWithoutAlarm: PointMap[];

  waterMeterFraud: PointMap[];
  waterMeterFlowReturn: PointMap[];
  waterMeterLeakage: PointMap[];
  waterMeterStopped: PointMap[];
}
