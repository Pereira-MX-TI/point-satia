import { Component, inject } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { MaterialComponents } from 'src/app/material/material.module';
import { SearchAutocompleteComponent } from '../search-autocomplete/search-autocomplete.component';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-search-modal',
  imports: [MaterialComponents, SearchAutocompleteComponent, IonicModule],
  standalone: true,
  templateUrl: './search-modal.component.html',
  styleUrls: ['./search-modal.component.scss'],
})
export class SearchModalComponent {
  dataModal: string = inject(DIALOG_DATA);

  constructor() {}
}
