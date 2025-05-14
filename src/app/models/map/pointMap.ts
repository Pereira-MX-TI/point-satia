import { Gps } from '../shared/gps';

export interface PointMap {
  name: string;
  gps: Gps;
  zoom: number;
  type: 'water_meter' | 'gateway' | 'point';
  m_coverage?: number;
}
