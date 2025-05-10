import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-tab-counter',
  templateUrl: './tab-counter.page.html',
  styleUrls: ['./tab-counter.page.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class TabCounterPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
