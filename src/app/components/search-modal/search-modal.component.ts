import { Component, inject } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { MaterialComponents } from 'src/app/material/material.module';
import { SearchAutocompleteComponent } from '../search-autocomplete/search-autocomplete.component';

@Component({
  selector: 'app-search-modal',
  imports: [MaterialComponents, SearchAutocompleteComponent],
  standalone:true,
  templateUrl: './search-modal.component.html',
  styleUrls: ['./search-modal.component.scss'],
})
export class SearchModalComponent {
  dialogRef: DialogRef<boolean> = inject<DialogRef<boolean>>(
    DialogRef<boolean>
  );
}
