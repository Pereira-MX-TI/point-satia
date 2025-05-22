import { Dialog } from '@angular/cdk/dialog';
import {
  Component,
  inject,
  Input,
  input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { initializeListSubscription } from 'src/app/functions/subscription-list.function';
import { MaterialComponents } from 'src/app/material/material.module';
import { ListInformationService } from 'src/app/services/list-information.service';

@Component({
  selector: 'app-search-autocomplete',
  standalone: true,
  imports: [MaterialComponents, FormsModule, ReactiveFormsModule, IonicModule],
  templateUrl: './search-autocomplete.component.html',
  styleUrls: ['./search-autocomplete.component.scss'],
})
export class SearchAutocompleteComponent implements OnInit, OnDestroy {
  private listInformationService: ListInformationService = inject(
    ListInformationService
  );
  dialog: Dialog = inject(Dialog);

  @Input('valueSearch') set valueSearch(res: string) {
    this.formControl.setValue(res, { emitEvent: false });
  }
  listObservable: string[] = [];
  formControl: FormControl = new FormControl('', Validators.required);
  listSubscription: Subscription[];

  constructor() {
    this.listSubscription = initializeListSubscription(2);
  }

  ngOnInit(): void {
    this.subscriptionAutoComplete();
  }

  private subscriptionAutoComplete(): void {
    this.listSubscription[0] =
      this.listInformationService.autoComplete$.subscribe(
        (response: string[]) => {
          this.listObservable = response;
        }
      );
    return;
  }

  ngOnDestroy() {
    this.listSubscription.forEach((itrSub) => {
      itrSub.unsubscribe();
    });
  }

  setAutoComplete(): void {
    if (this.formControl.invalid || !this.formControl.value) {
      this.listObservable = [];
      return;
    }
    this.listInformationService.dataInput$.emit(this.formControl.value);
  }

  setSearch(): void {
    if (this.formControl.invalid || !this.formControl.value) return;

    this.listInformationService.search$.emit(this.formControl.value);
    this.dialog.closeAll();
  }

  setSearchAutoComplete(data: string): void {
    if (data == '') return;

    this.listInformationService.search$.emit(data);
    this.dialog.closeAll();
  }

  clearSearch(): void {
    this.formControl.setValue('', { emitEvent: false });
    this.listInformationService.resetInput$.emit();
    this.listObservable = [];
  }
}
