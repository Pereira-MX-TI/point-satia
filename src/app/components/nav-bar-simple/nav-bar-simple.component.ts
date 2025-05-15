import { Dialog } from '@angular/cdk/dialog';
import { Component, inject, input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SearchModalComponent } from '../search-modal/search-modal.component';
import { RouterLink } from '@angular/router';
import { MaterialComponents } from 'src/app/material/material.module';
import { LoginObservable } from 'src/app/observables/login.observable';

@Component({
  selector: 'app-nav-bar-simple',
  templateUrl: './nav-bar-simple.component.html',
  styleUrls: ['./nav-bar-simple.component.scss'],
  standalone: true,
  imports: [MaterialComponents, IonicModule, RouterLink],
})
export class NavBarSimpleComponent {
  private loginObservable: LoginObservable = inject(LoginObservable);

  dialog: Dialog = inject(Dialog);
  urlBack = input<string>('');

  openSearchModal(): void {
    this.dialog.open<void>(SearchModalComponent);
  }

  closeSession(): void {
    this.loginObservable.updateData(null);
  }
}
