export interface Sketch {
  id?: string | number;
  water_meter_id?: string | number;
  meter_serial?: string;

  x: number;
  y: number;

  x_transform: number;
  y_transform: number;
  scale_transform: number;
}

export interface PointSketch {
  x: number;
  y: number;
}
