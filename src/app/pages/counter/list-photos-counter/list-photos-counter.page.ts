import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-list-photos-counter',
  templateUrl: './list-photos-counter.page.html',
  styleUrls: ['./list-photos-counter.page.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class ListPhotosCounterPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
