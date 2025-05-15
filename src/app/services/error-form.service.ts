import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ErrorFormService {
  constructor(private matSnackBar: MatSnackBar) {}

  viewError(
    error: any,
    formGroup: FormGroup<any>,
    message: string = '',
    nameControl: string = ''
  ): void {
    formGroup.get(nameControl)?.markAsTouched();

    switch (error.status) {
      case 410:
        {
          formGroup.get(nameControl)?.setErrors({ 'code-notAvailable': true });
        }
        break;
      case 412:
        formGroup.get(nameControl)?.setErrors({ 'password-error': true });
        break;
      case 413:
        {
          formGroup.get(nameControl)?.setErrors({ 'email-notAvailable': true });
        }
        break;
      case 414:
        formGroup.get(nameControl)?.setErrors({ 'account-notAvailable': true });
        break;
      case 415:
        this.matSnackBar.open('Limite de rutas excedido', '', {
          duration: 2000,
          panelClass: 'snackBar_error',
        });
        break;
      case 416:
        this.matSnackBar.open('Medidores de agua excedido', '', {
          duration: 2000,
          panelClass: 'snackBar_error',
        });
        break;
      case 417:
        {
          formGroup
            .get('meter_serial')
            ?.setErrors({ 'serie-notAvailable': true });
        }
        break;
      case 418:
        formGroup
          .get('addition_serial')
          ?.setErrors({ 'addition-serial-notAvailable': true });
        break;
      case 419:
        formGroup.get(nameControl)?.setErrors({ 'name-notAvailable': true });
        break;

      case 420:
        this.matSnackBar.open('El token ha expirado', '', {
          duration: 2000,
          panelClass: 'snackBar_error',
        });
        break;

      case 421:
        formGroup.get('dev_eui')?.setErrors({ 'dev-eui-notAvailable': true });
        break;

      case 423:
        this.matSnackBar.open('Base de datos no existente', '', {
          duration: 2000,
          panelClass: 'snackBar_error',
        });
        break;

      case 424:
        this.matSnackBar.open('Base de datos con rutas', '', {
          duration: 2000,
          panelClass: 'snackBar_error',
        });
        break;

      case 425:
        this.matSnackBar.open('Ruta no existente', '', {
          duration: 2000,
          panelClass: 'snackBar_error',
        });
        break;

      case 426:
        this.matSnackBar.open('Ruta con medidores', '', {
          duration: 2000,
          panelClass: 'snackBar_error',
        });
        break;

      case 427:
        this.matSnackBar.open('Usuario no existente', '', {
          duration: 2000,
          panelClass: 'snackBar_error',
        });
        break;

      case 428:
        this.matSnackBar.open('Usuario con cuentas', '', {
          duration: 2000,
          panelClass: 'snackBar_error',
        });
        break;

      case 429:
        this.matSnackBar.open('Usuario con rutas a gestionar', '', {
          duration: 2000,
          panelClass: 'snackBar_error',
        });
        break;

      case 430:
        this.matSnackBar.open('Sección no existente', '', {
          duration: 2000,
          panelClass: 'snackBar_error',
        });
        break;

      case 431:
        this.matSnackBar.open('Sección con direcciones', '', {
          duration: 2000,
          panelClass: 'snackBar_error',
        });
        break;

      case 432:
        formGroup
          .get('mac_address')
          ?.setErrors({ 'mac-address-notAvailable': true });
        break;

      case 433:
        formGroup
          .get('serial_number')
          ?.setErrors({ 'number-serial-notAvailable': true });
        break;

      case 434:
        formGroup
          .get('name')
          ?.setErrors({ 'type-location-notAvailable': true });
        break;

      case 435:
        formGroup.get('name')?.setErrors({ 'type-place-notAvailable': true });
        break;

      case 436:
        formGroup.get('name')?.setErrors({ 'type-product-notAvailable': true });
        break;

      case 437:
        formGroup.get('name')?.setErrors({ 'ticket-notAvailable': true });
        break;

      case 438:
        formGroup.get('name')?.setErrors({ 'section-notAvailable': true });
        break;

      case 439:
        formGroup.get('command')?.setErrors({ 'command-notAvailable': true });
        break;

      default:
        this.matSnackBar.open(message, '', {
          duration: 2000,
          panelClass: 'snackBar_error',
        });
    }
  }
}
