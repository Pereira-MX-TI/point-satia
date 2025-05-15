import { Dialog } from '@angular/cdk/dialog';
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { initializeListSubscription } from 'src/app/functions/subscription-list.function';
import { MaterialComponents } from 'src/app/material/material.module';
import { ListInformationService } from 'src/app/services/list-information.service';

@Component({
  selector: 'app-search-autocomplete',
  standalone: true,
  imports: [MaterialComponents, FormsModule, ReactiveFormsModule],
  templateUrl: './search-autocomplete.component.html',
  styleUrls: ['./search-autocomplete.component.scss'],
})
export class SearchAutocompleteComponent implements OnInit, OnDestroy {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private listInformationService: ListInformationService = inject(
    ListInformationService
  );
  dialog: Dialog = inject(Dialog);

  @Input('backgroundColor') backgroundColor: string = 'var(--color3-1)';

  listObservable: string[] = [];
  formControl: FormControl = new FormControl('', Validators.required);
  listSubscription: Subscription[];

  constructor() {
    this.listSubscription = initializeListSubscription(3);
  }

  ngOnInit(): void {
    this.subscriptionAutoComplete();
    this.subscriptionResetInput();
    this.subscriptionQueryParams();
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

  private subscriptionResetInput(): void {
    this.listSubscription[1] =
      this.listInformationService.resetInput$.subscribe(() => {
        this.formControl.reset();
      });
    return;
  }

  private subscriptionQueryParams(): void {
    this.listSubscription[2] = this.activatedRoute.queryParams.subscribe(
      ({ pagination }) => {
        if (!pagination) return;

        const { search } = JSON.parse(atob(pagination));
        this.formControl.setValue(search, { emitEvent: false });
      }
    );
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
}
