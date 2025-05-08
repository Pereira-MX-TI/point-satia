import { Dialog } from '@angular/cdk/dialog';
import { Component, inject, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SearchModalComponent } from '../search-modal/search-modal.component';

@Component({
  selector: 'app-nav-bar-simple',
  templateUrl: './nav-bar-simple.component.html',
  styleUrls: ['./nav-bar-simple.component.scss'],
  standalone:true,
  imports:[
    IonicModule
  ]
})
export class NavBarSimpleComponent {
  dialog: Dialog = inject(Dialog);

  openSearchModal():void{
    this.dialog.open<void>(SearchModalComponent);

  }

}
