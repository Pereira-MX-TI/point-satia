import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { trigger, transition, style, animate } from '@angular/animations';
import { MaterialComponents } from 'src/app/material/material.module';
import { HttpAuthService } from 'src/app/services/authentication/http-auth.service';
import { finalize } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Account } from 'src/app/models/authentication/account';
import { LoginObservable } from 'src/app/observables/login.observable';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [MaterialComponents, IonicModule, FormsModule, ReactiveFormsModule],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('0.5s', style({ opacity: 0 }))]),
    ]),
  ],
})
export class LoginPage {
  httpAuthService: HttpAuthService = inject(HttpAuthService);
  private loginObservable: LoginObservable = inject(LoginObservable);
  private snackBar: MatSnackBar = inject(MatSnackBar);
  private router: Router = inject(Router);

  hide: boolean = true;
  loading: boolean = false;
  formGroup: FormGroup;

  private formBuilder: FormBuilder = inject(FormBuilder);

  constructor() {
    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      token: ['-'],
    });
  }

  register(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { email, password } = this.formGroup.getRawValue();

    this.httpAuthService
      .login({
        email,
        password,
      })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        ({ data }) => {
          const account: Account = data;

          if (account.user.type_user.id == 1) {
            this.loginObservable.updateData(account);
            this.router.navigateByUrl('/DataBases');
          } else if (
            account.user.type_user.id == 4 ||
            account.user.type_user.id == 6
          ) {
            if (account.quantity_locations == 0) {
              this.snackBar.open('El usuario no tiene rutas', '', {
                duration: 2500,
                panelClass: ['snackBar_error'],
              });
              return;
            }

            this.loginObservable.updateData(account);
            this.router.navigateByUrl('/DashBoard/Routes');
          } else {
            this.snackBar.open('Usuario no valido', '', {
              duration: 2500,
              panelClass: ['snackBar_error'],
            });
          }
        },
        () => {
          this.snackBar.open('Usuario o Contraseña incorrecto', '', {
            duration: 2500,
            panelClass: ['snackBar_error'],
          });
        }
      );
  }
}
