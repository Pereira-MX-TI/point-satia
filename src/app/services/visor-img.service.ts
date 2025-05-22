import { ElementRef, Injectable } from '@angular/core';
import Viewer from 'viewerjs';
import { AttachFile } from '../models/attach-file.model';

@Injectable({
  providedIn: 'root',
})
export class VisorImgService {
  viewer: any = null;

  viewImage(elementRef: ElementRef, file: AttachFile): void {
    if (!file) return;
    if (!file.id || !file.data) return;

    const img = elementRef.nativeElement.querySelector(`#img-${file.id}`);
    if (!img) return;

    if (this.viewer) this.viewer.destroy();

    this.viewer = new Viewer(img, { fullscreen: true });
    this.viewer.show();
  }
}
