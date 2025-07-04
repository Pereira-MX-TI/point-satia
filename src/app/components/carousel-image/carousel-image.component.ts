import {
  Component,
  inject,
  output,
  Input,
  input,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { AttachFile } from '../../models/attach-file.model';
import { FileService } from '../../services/file.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialComponents } from '../../material/material.module';
import {
  CarouselModule,
  OwlOptions,
  CarouselComponent,
} from 'ngx-owl-carousel-o';
import { CarouselInformationService } from '../../services/carousel-information.service';
import { CarouselDto } from '../../models/carousel-dto.model';
import { OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageEmptyComponent } from '../message-empty/message-empty.component';
import { IonicModule, Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { VisorImgService } from 'src/app/services/visor-img.service';
import { PermissionService } from 'src/app/services/permission.service';

@Component({
  selector: 'app-carousel-image',
  imports: [
    MaterialComponents,
    MessageEmptyComponent,
    CarouselModule,
    IonicModule,
  ],
  templateUrl: './carousel-image.component.html',
  styleUrl: './carousel-image.component.scss',
})
export class CarouselImageComponent implements OnInit, OnDestroy {
  public visorImgService: VisorImgService = inject(VisorImgService);
  public elementRef: ElementRef = inject(ElementRef);

  permissionService: PermissionService = inject(PermissionService);

  public platform: Platform = inject(Platform);
  public fileService: FileService = inject(FileService);
  private matSnackBar: MatSnackBar = inject(MatSnackBar);
  public carouselInformationService: CarouselInformationService = inject(
    CarouselInformationService
  );

  @ViewChild('owlCarousel') owlCarousel: CarouselComponent | null = null;

  listFile: AttachFile[] = [];
  output_files = output<AttachFile[]>();
  attach = input<boolean>(false);
  id = input<string>('');
  subscription: Subscription = new Subscription();

  @Input() set input_files(res: AttachFile[]) {
    this.listFile = res;
  }

  customOptions: OwlOptions = {
    lazyLoad: true,
    autoHeight: true,
    loop: false,
    autoplay: false,
    autoplayHoverPause: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: false,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      740: {
        items: 1,
      },
      940: {
        items: 1,
      },
    },
    nav: false,
    animateOut: '', // Evita animaciones de salida
    animateIn: '',
  };

  ngOnInit(): void {
    this.subscriptionInputFiles();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  subscriptionInputFiles(): void {
    this.carouselInformationService.inputFiles$.subscribe(
      (res: CarouselDto) => {
        if (this.id() !== res.id) return;
        this.listFile = res.data;
      }
    );
  }

  handlePhotoClick(fileBtn: HTMLInputElement): void {
    if (
      Capacitor.isNativePlatform() &&
      (this.platform.is('android') || this.platform.is('ios'))
    ) {
      this.takePhoto();
    } else {
      this.fileService.clearInputFile(fileBtn);
      fileBtn.click();
    }
  }

  fileChanged({ files }: any): void {
    this.subscription = this.fileService.readFileImage(files).subscribe(
      ({ data: res }) => {
        if (this.listFile.length > 2) {
          this.matSnackBar.open('Solo 3 fotos', '', {
            duration: 2000,
            panelClass: 'snackBar_error',
          });
          return;
        }

        this.listFile.push({
          id: new Date().getTime(),
          name: res.name,
          url: '',
          data: res.data,
          status: 'insert',
        });

        this.output_files.emit(this.listFile);

        setTimeout(() => {
          if (this.listFile.length > 1)
            this.owlCarousel?.to(this.owlCarousel.slides.last.id);
        }, 100);
      },
      (error) => {
        this.matSnackBar.open(error, '', {
          duration: 2000,
          panelClass: 'snackBar_error',
        });
      }
    );
  }

  deleteFile(item: AttachFile, index: number): void {
    if (item.status === 'none') {
      item.status = 'delete';
      this.output_files.emit(this.listFile);
      this.listFile.splice(index, 1);
      return;
    }

    this.listFile.splice(index, 1);
    this.output_files.emit(this.listFile);
  }

  async takePhoto() {
    if (this.listFile.length > 2) {
      this.matSnackBar.open('Solo 3 fotos', '', {
        duration: 2000,
        panelClass: 'snackBar_error',
      });
      return;
    }
    (async () => {
      try {
        const { dataUrl } = await this.permissionService.myPhoto();
        if (!dataUrl) {
          this.matSnackBar.open('Imagen no reconocida', '', {
            duration: 2000,
            panelClass: 'snackBar_error',
          });
          return;
        }

        const id: number = new Date().getTime();
        this.listFile.push({
          id,
          name: `${String(id)}.jpeg`,
          url: '',
          data: dataUrl,
          status: 'insert',
        });

        this.output_files.emit(this.listFile);

        setTimeout(() => {
          if (this.listFile.length > 1)
            this.owlCarousel?.to(this.owlCarousel.slides.last.id);
        }, 100);
      } catch (error) {}
    })();
  }
}
