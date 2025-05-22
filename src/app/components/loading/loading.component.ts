import { trigger, transition, style, animate } from '@angular/animations';
import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('200ms ease-out', style({ opacity: 0 }))]),
    ]),
  ],
})
export class LoadingComponent {
  background = input<string>('rgba(var(--color-new-3-1))');
  view = input<boolean>(false);

  gif: string = 'assets/loaders/loading_5.gif';
  @Input() set type(res: 'download' | 'loading' | 'upload') {
    if (res === 'download') {
      this.gif = 'assets/loaders/download.gif';
      return;
    }

    if (res === 'upload') {
      this.gif = 'assets/loaders/upload.gif';
      return;
    }

    this.gif = 'assets/loaders/loading_5.gif';
  }
}
