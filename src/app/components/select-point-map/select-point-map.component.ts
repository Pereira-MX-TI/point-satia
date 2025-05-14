import {
  Component,
  EventEmitter,
  inject,
  input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import { fromLonLat, toLonLat } from 'ol/proj';
import { OSM } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { defaults as defaultControls } from 'ol/control';
import Feature from 'ol/Feature';
import VectorSource from 'ol/source/Vector';
import { Subscription } from 'rxjs';
import { Point } from 'ol/geom';

import { Icon, Style } from 'ol/style';
import { defaults as defaultInteractions } from 'ol/interaction';
import { initializeListSubscription } from 'src/app/functions/subscription-list.function';
import { MaterialComponents } from 'src/app/material/material.module';
import { Gps } from 'src/app/models/map/gps';
import { PointMap } from 'src/app/models/map/pointMap';
import { MapInformationService } from 'src/app/services/map-information.service';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-select-point-map',
  imports: [MaterialComponents, IonicModule],
  standalone: true,
  templateUrl: './select-point-map.component.html',
  styleUrls: ['./select-point-map.component.scss'],
})
export class SelectPointMapComponent implements OnInit, OnDestroy {
  private mapInformationService: MapInformationService = inject(
    MapInformationService
  );

  type_point = input<'water_meter' | 'gateway' | 'point'>('point');
  @Output() changePosition: EventEmitter<PointMap>;
  @Output() getIdMap: EventEmitter<string>;

  listSubscription: Subscription[];
  map?: Map;
  useMap: boolean = false;
  zoom: number = 0;
  config: any;

  constructor() {
    this.listSubscription = initializeListSubscription(2);

    this.changePosition = new EventEmitter<PointMap>();
    this.getIdMap = new EventEmitter<string>();

    this.config = {
      id: String(new Date().getTime()),
      start: false,
    };
  }

  ngOnInit(): void {
    this.subscriptionInitMap();
    this.subscriptionChangePosition();
  }

  ngOnDestroy(): void {
    this.listSubscription.forEach((itrSub) => {
      itrSub.unsubscribe();
    });
  }

  private subscriptionInitMap(): void {
    this.listSubscription[0] = this.mapInformationService.initMap$.subscribe(
      (res: PointMap) => {
        if (this.config.start) return;

        this.initializeMap(res);
        this.addOnlyPointPosition({ ...res });
      }
    );
  }

  private subscriptionChangePosition(): void {
    this.listSubscription[1] =
      this.mapInformationService.changeOnlyPosition$.subscribe(
        (res: PointMap) => {
          this.map?.removeLayer(this.map.getLayers().getArray()[1]);
          this.reloadMap(res.gps, res.zoom);
          this.addOnlyPointPosition({ ...res });
        }
      );
  }

  initializeMap(point: PointMap): void {
    const mapConfig = {
      target: this.config.id,
      view: new View({
        center: fromLonLat([point.gps.longitude, point.gps.latitude]),
        zoom: point.zoom,
      }),
      controls: defaultControls({ attribution: false }),
      interactions: defaultInteractions({ doubleClickZoom: false }), // Deshabilita el zoom con doble clic
    };

    this.map = new Map({
      ...mapConfig,
      layers: [new TileLayer({ source: new OSM() })],
    });

    this.config.start = true;
    this.getIdMap.emit(this.config.id);
  }

  reloadMap(gps: Gps, zoom: number): void {
    this.map?.setView(
      new View({
        center: fromLonLat([gps.longitude, gps.latitude]),
        zoom,
      })
    );

    this.map?.render();
  }

  addOnlyPointPosition(pointMap: PointMap): void {
    const pointFeature = new Feature({
      name: pointMap.name,
      geometry: new Point(
        fromLonLat([pointMap.gps.longitude, pointMap.gps.latitude])
      ),
    });

    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: [pointFeature],
      }),
      style: new Style({
        image: new Icon({
          crossOrigin: 'anonymous',
          scale: 0.09,
          src: 'assets/map/point_icon.png',
        }),
      }),
    });

    this.map?.addLayer(vectorLayer);
  }

  changePositionMarker(lat: number, lon: number, zoom: number): void {
    this.map?.removeLayer(this.map!.getLayers().getArray()[1]!);
    this.addOnlyPointPosition({
      name: '',
      gps: { id: 0, latitude: lat, longitude: lon },
      zoom,
      type: this.type_point(),
    });

    this.changePosition.emit({
      gps: { id: 0, latitude: lat, longitude: lon },
      zoom,
      name: '',
      type: this.type_point(),
    });

    this.reloadMap({ id: 0, latitude: lat, longitude: lon }, zoom);
  }

  myLocation(): void {
    navigator.geolocation.getCurrentPosition((res: any) => {
      const { latitude, longitude } = res.coords;
      this.changePositionMarker(latitude, longitude, 16);
    });
  }
}
