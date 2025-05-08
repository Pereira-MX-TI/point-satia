import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Account } from '../../models/authentication/account';
import { LoginObservable } from '../../observables/login.observable';

export const LoginGuard: CanActivateFn = () => {
  const loginObservable: LoginObservable = inject(LoginObservable);
  const router: Router = inject(Router);

  const account: Account | null = loginObservable.getData();

  if (!account) {
    router.navigateByUrl('/');
    return false;
  }

  return true;
};
