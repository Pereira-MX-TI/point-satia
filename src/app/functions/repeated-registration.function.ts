import { ErrorFileWaterMeter } from '../enums/errorFileWaterMeter.enum';
import { Type_place } from '../models/shared/place';
import { Section } from '../models/shared/section';
import { Product } from '../models/shared/watermeter';

export function repeatedDevEui(
  list: any[],
  dev_eui: string,
  listError: string[],
  indexG: number
): string[] {
  list.forEach((itrAddition: any, index: number) => {
    if (
      itrAddition.dev_eui &&
      itrAddition.dev_eui.toLowerCase() === dev_eui.toLowerCase() &&
      index != indexG
    ) {
      listError.push(`${ErrorFileWaterMeter.dev_eui} (fila ${index + 1})`);
    }
  });

  return listError;
}

export function repeatedAdditionSerie(
  list: any[],
  addition_serie: string,
  listError: string[],
  indexG: number
): string[] {
  list.forEach((itrAddition: any, index: number) => {
    if (
      itrAddition.addition_serie.toLowerCase() ===
        addition_serie.toLowerCase() &&
      index != indexG
    ) {
      listError.push(
        `${ErrorFileWaterMeter.addition_serie} (fila ${index + 1})`
      );
    }
  });

  return listError;
}

export function repeatedCounterSerie(
  list: any[],
  counter_serie: string,
  listError: string[],
  indexG: number
): string[] {
  list.forEach((itrAddition: any, index: number) => {
    if (
      itrAddition.counter_serie.toLowerCase() === counter_serie.toLowerCase() &&
      index != indexG
    ) {
      listError.push(
        `${ErrorFileWaterMeter.counter_serie} (fila ${index + 1})`
      );
    }
  });

  return listError;
}

export function validProduct(
  list: Product[],
  code: string,
  listError: string[],
  index: number,
  type: ErrorFileWaterMeter
): string[] {
  let insertError: boolean = true;
  list.forEach((itrProduct: Product) => {
    if (itrProduct.code.toLowerCase() === code.toLowerCase()) {
      insertError = false;
    }
  });

  if (insertError) {
    listError.push(`${type} (fila ${index + 1})`);
  }

  return listError;
}

export function validTypePlace(
  list: Type_place[],
  type_name_place: string,
  listError: string[],
  index: number
): string[] {
  let insertError: boolean = true;
  list.forEach((itrType: Type_place) => {
    if (itrType.name.toLowerCase() === type_name_place.toLowerCase())
      insertError = false;
  });
  if (insertError)
    listError.push(`${ErrorFileWaterMeter.type_place} (fila ${index + 1})`);

  return listError;
}

export function validSection(
  list: Section[],
  section_name: string,
  listError: string[],
  index: number
): string[] {
  let insertError: boolean = true;
  list.forEach((itrSection: Section) => {
    if (itrSection.name.toLowerCase() === section_name.toLowerCase())
      insertError = false;
  });
  if (insertError)
    listError.push(`${ErrorFileWaterMeter.section} (fila ${index + 1})`);

  return listError;
}
