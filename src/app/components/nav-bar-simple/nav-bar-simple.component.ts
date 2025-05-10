import { Dialog } from '@angular/cdk/dialog';
import { Component, inject, input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SearchModalComponent } from '../search-modal/search-modal.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav-bar-simple',
  templateUrl: './nav-bar-simple.component.html',
  styleUrls: ['./nav-bar-simple.component.scss'],
  standalone:true,
  imports:[
    IonicModule,
    RouterLink
  ]
})
export class NavBarSimpleComponent {
  
  dialog: Dialog = inject(Dialog);
  urlBack = input<string>("");

  openSearchModal():void{
    this.dialog.open<void>(SearchModalComponent);

  }

}
