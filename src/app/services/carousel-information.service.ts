import { Injectable, EventEmitter } from '@angular/core';
import { CarouselDto } from '../models/carousel-dto.model';

@Injectable({
  providedIn: 'root',
})
export class CarouselInformationService {
  inputFiles$: EventEmitter<CarouselDto> = new EventEmitter<CarouselDto>();
}
