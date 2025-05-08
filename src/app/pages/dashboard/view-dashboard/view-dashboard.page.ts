import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-view-dashboard',
  templateUrl: './view-dashboard.page.html',
  styleUrls: ['./view-dashboard.page.scss'],
  standalone:true,
  imports:[
    IonicModule
  ]
})
export class ViewDashboardPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
