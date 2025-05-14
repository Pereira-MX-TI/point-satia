import { trigger, transition, style, animate } from '@angular/animations';
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-no-found',
  templateUrl: './no-found.page.html',
  styleUrls: ['./no-found.page.scss'],
  imports: [IonicModule],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('0.5s', style({ opacity: 0 }))]),
    ]),
  ],
})
export class NoFoundPage {}
