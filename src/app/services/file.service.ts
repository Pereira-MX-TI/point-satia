import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { NgxImageCompressService } from 'ngx-image-compress';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(
    private imageCompressService: NgxImageCompressService,
    private ngZone: NgZone
  ) {}

  readFileImage(files: FileList): Observable<any> {
    return new Observable<any>((observer) => {
      try {
        if (!files.item(0)) throw new Error('Error en archivo');
        const file = files.item(0);
        if (!file) throw new Error('Error en archivo');

        const format = file.type.toLowerCase();

        if (!['image/png', 'image/jpg', 'image/jpeg'].includes(format)) {
          throw new Error('Formato de archivo no válido');
        }

        if (file.size > 5_242_880) throw new Error('Tamaño máximo 5 MB');

        this.readFileImgContent(file).subscribe(
          (result) => {
            observer.next(result);
            observer.complete();
          },
          (err) => {
            observer.error(err);
          }
        );
      } catch (err) {
        observer.error(err);
      }
    });
  }

  private readFileImgContent(file: File): Observable<any> {
    return new Observable<any>((observer) => {
      this.imageCompressService
        .compressFile(URL.createObjectURL(file), -1, 50, 50) // 50% calidad, 50% tamaño
        .then((compressedImage: string) => {
          this.ngZone.run(() => {
            const nameFile: string = `${new Date().getTime()}.${
              file.type.split('/')[1]
            }`;

            const newFile = {
              name: nameFile,
              type: file.type,
              data: compressedImage,
            };

            observer.next({ data: newFile });
            observer.complete();
          });
        })
        .catch((error: any) => {
          observer.error(error);
        });
    });
  }

  clearInputFile(inputFile: any): void {
    inputFile.value = null;
  }
}
