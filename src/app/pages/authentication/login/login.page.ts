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
import { finalize, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Account } from 'src/app/models/authentication/account';
import { LoginObservable } from 'src/app/observables/login.observable';
import { Router } from '@angular/router';
import { NetworkStatusService } from 'src/app/services/network-status.service';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { IonicStorageService } from 'src/app/services/ionic-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    MaterialComponents,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingComponent,
  ],
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
  private readonly ionicStorageService: IonicStorageService =
    inject(IonicStorageService);
  httpAuthService: HttpAuthService = inject(HttpAuthService);
  private loginObservable: LoginObservable = inject(LoginObservable);
  private snackBar: MatSnackBar = inject(MatSnackBar);
  private router: Router = inject(Router);
  private formBuilder: FormBuilder = inject(FormBuilder);
  networkStatusService: NetworkStatusService = inject(NetworkStatusService);

  hide: boolean = true;
  loading: boolean = false;
  formGroup: FormGroup;

  subscription: Subscription = new Subscription();
  online: boolean = true;

  constructor() {
    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.subscriptionStatusNetwork();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  subscriptionStatusNetwork() {
    this.subscription = this.networkStatusService.networkStatus$.subscribe(
      (status) => {
        this.online = status;

        this.formGroup
          .get('password')
          ?.setValue(status ? '' : '-', { emitEvent: false });
      }
    );
  }

  register(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { email, password } = this.formGroup.getRawValue();

    if (this.online) {
      this.httpAuthService
        .login({
          email,
          password,
        })
        .pipe(finalize(() => (this.loading = false)))
        .subscribe(
          ({ data }) => {
            this.redirectPageByLogin(data);
          },
          () => {
            this.snackBar.open('Usuario o Contraseña incorrecto', '', {
              duration: 2500,
              panelClass: 'snackBar_error',
            });
          }
        );

      return;
    }

    this.ionicStorageService.get('cacc-offline').then((res: Account | null) => {
      if (!res) {
        this.snackBar.open(
          'Inicie sesión una vez con conexión a internet',
          '',
          {
            duration: 2500,
            panelClass: 'snackBar_error',
          }
        );

        return;
      }

      if (email !== res.user.email) {
        this.snackBar.open('Usuario o Contraseña incorrecto', '', {
          duration: 2500,
          panelClass: 'snackBar_error',
        });

        return;
      }

      this.redirectPageByLogin(res);
    });
  }

  redirectPageByLogin(account: Account): void {
    this.ionicStorageService.get('routes').then((res) => {
      switch (account.user.type_user.id) {
        case 1:
          {
            if (this.online) {
              this.loginObservable.updateData(account);
              this.router.navigateByUrl('/DataBases');
            } else if (res) {
              this.loginObservable.updateData(account);
              this.router.navigateByUrl('/Routes');
            } else {
              this.snackBar.open('Es necesario descargar 1 ruta', '', {
                duration: 2500,
                panelClass: 'snackBar_error',
              });
            }
          }
          break;
        case 2:
        case 4:
          {
            if (this.online && account.quantity_locations == 0) {
              this.snackBar.open('El usuario no tiene rutas', '', {
                duration: 2500,
                panelClass: 'snackBar_error',
              });
            } else if (this.online) {
              this.loginObservable.updateData(account);
              this.router.navigateByUrl('/Routes');
            } else if (res) {
              this.loginObservable.updateData(account);
              this.router.navigateByUrl('/Routes');
            } else {
              this.snackBar.open('Es necesario descargar 1 ruta', '', {
                duration: 2500,
                panelClass: 'snackBar_error',
              });
            }
          }
          break;

        case 6:
          {
            if (this.online) {
              this.loginObservable.updateData(account);
              this.router.navigateByUrl('/Routes');
            } else if (res) {
              this.loginObservable.updateData(account);
              this.router.navigateByUrl('/Routes');
            } else {
              this.snackBar.open('Es necesario descargar 1 ruta', '', {
                duration: 2500,
                panelClass: 'snackBar_error',
              });
            }
          }
          break;
      }
    });
  }
}
