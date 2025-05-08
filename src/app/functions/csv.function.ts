export function downloadCsv(name: string, content: string) {
  const blob = new Blob(['\ufeff', content], {
    type: 'text/csv;charset=utf-8',
  });
  const download = document.createElement('a');
  const url = URL.createObjectURL(blob);
  if (
    navigator.userAgent.includes('Safari') &&
    !navigator.userAgent.includes('Chrome')
  )
    download.setAttribute('target', '_blank');

  download.setAttribute('href', url);
  download.setAttribute('download', name + '.csv');
  download.style.visibility = 'hidden';
  document.body.appendChild(download);
  download.click();
  document.body.removeChild(download);
}

interface ItemFileGps {
  meter_serial: string;
  route_name: string;
  section: string;
  address: string;
  latitude: number | string;
  longitude: number | string;
}

interface ItemPickup {
  meter_serial: string;
  section: string;
  address: string;
  readTime: string;
  index_m: number | string;
  leakage: number;
  fraud: number;
  flowReturn: number;
  stopped: number;
}

interface ItemConsumption {
  id: string;
  date: string;
  initial_date: string;
  end_date: string;

  initial_index: string;
  end_index: number;
  index: number;
  water_meter_id: string | number;
}

interface ItemDailyConsumption {
  meter_serial: string;
  index: number;
  section: string;
  address: string;
}

interface ItemCalculateConsumption {
  id: string;
  meter_serial: string;
  index: number;
  section: string;
  address: string;
}

export function fileGpsCsv(list: ItemFileGps[]): void {
  const name: string = `gps_${new Date().getTime()}`;
  const header: string = 'CONTADOR,RUTA,SECCIÓN,UBICACIÓN,COORDENADAS\n';
  let content: string = '';
  list.forEach((itr: ItemFileGps) => {
    const meter_serial: string = `"${itr.meter_serial}"`;
    const route_name: string = `"${itr.route_name}"`;
    const section: string = `"${itr.section}"`;
    const address: string = `"${itr.address}"`;
    const coords: string =
      itr.latitude == 0 && itr.longitude == 0
        ? '"-"'
        : `"${itr.latitude},${itr.longitude}"`;

    content += `${meter_serial},${route_name},${section},${address},${coords}\n`;
  });

  downloadCsv(name, header + content);
}

export function filePickupCsv(list: ItemPickup[], alias: string): void {
  const name: string = `${alias}_${new Date().getTime()}`;
  const header: string =
    'CONTADOR,SECCIÓN,UBICACIÓN,FECHA-HORA,LECTURA M3,PICO-ALTO,FRAUDE,RETORNO-AGUA,DETENIDO\n';
  let content: string = '';
  list.forEach((itr: ItemPickup) => {
    const meter_serial: string = `"${itr.meter_serial}"`;
    const section: string = `"${itr.section}"`;
    const address: string = `"${itr.address}"`;
    const readTime: string = `"${itr.readTime}"`;

    const index_m: string = `"${itr.index_m}"`;
    const leakage: string = itr.leakage == 1 ? 'si' : 'no';
    const fraud: string = itr.fraud == 1 ? 'si' : 'no';
    const flowReturn: string = itr.flowReturn == 1 ? 'si' : 'no';
    const stopped: string = itr.stopped == 1 ? 'si' : 'no';
    content += `${meter_serial},${section},${address},${readTime},${index_m},${leakage},${fraud},${flowReturn},${stopped}\n`;
  });

  downloadCsv(name, header + content);
}

export function fileWaterMeterPickupCsv(
  list: ItemPickup[],
  alias: string
): void {
  const name: string = `${alias}_${new Date().getTime()}`;
  const header: string =
    'FECHA-HORA,LECTURA M3,PICO-ALTO,FRAUDE,RETORNO-AGUA,DETENIDO\n';
  let content: string = '';
  list.forEach((itr: ItemPickup) => {
    const readTime: string = `"${itr.readTime}"`;
    const index_m: string = `"${itr.index_m}"`;
    const leakage: string = itr.leakage == 1 ? 'si' : 'no';
    const fraud: string = itr.fraud == 1 ? 'si' : 'no';
    const flowReturn: string = itr.flowReturn == 1 ? 'si' : 'no';
    const stopped: string = itr.stopped == 1 ? 'si' : 'no';
    content += `${readTime},${index_m},${leakage},${fraud},${flowReturn},${stopped}\n`;
  });

  downloadCsv(name, header + content);
}

export function fileDailyConsumptionCsv(
  list: ItemDailyConsumption[],
  alias: string
): void {
  const name: string = `${alias}_${new Date().getTime()}`;
  const header: string = 'CONTADOR,SECCIÓN,UBICACIÓN,CONSUMO M3\n';
  let content: string = '';
  list.forEach((itr: ItemDailyConsumption) => {
    const meter_serial: string = `"${itr.meter_serial}"`;
    const section: string = `"${itr.section}"`;
    const address: string = `"${itr.address}"`;
    const index: string = `"${itr.index}"`;
    content += `${meter_serial},${section},${address},${index}\n`;
  });

  downloadCsv(name, header + content);
}

export function fileCalculateConsumptionCsv(
  list: ItemCalculateConsumption[],
  alias: string
): void {
  const name: string = `${alias}_${new Date().getTime()}`;
  const header: string = 'CONTADOR,SECCIÓN,UBICACIÓN,CONSUMO M3\n';
  let content: string = '';
  list.forEach((itr: ItemDailyConsumption) => {
    const meter_serial: string = `"${itr.meter_serial}"`;
    const section: string = `"${itr.section}"`;
    const address: string = `"${itr.address}"`;
    const index: string = `"${itr.index}"`;
    content += `${meter_serial},${section},${address},${index}\n`;
  });

  downloadCsv(name, header + content);
}

export function fileWaterMeterConsumptionCsv(
  list: ItemConsumption[],
  alias: string
): void {
  const name: string = `${alias}_${new Date().getTime()}`;
  const header: string = 'FECHA-HORA,CONSUMO M3\n';
  let content: string = '';
  list.forEach((itr: ItemConsumption) => {
    const date: string = `"${itr.date}"`;
    const index: string = `"${itr.index}"`;

    content += `${date},${index}\n`;
  });

  downloadCsv(name, header + content);
}
