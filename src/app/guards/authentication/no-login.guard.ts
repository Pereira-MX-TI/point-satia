import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Account } from '../../models/authentication/account';
import { LoginObservable } from '../../observables/login.observable';

export const noLoginGuard: CanActivateFn = () => {
  const loginObservable: LoginObservable = inject(LoginObservable);
  const router: Router = inject(Router);

  const account: Account | null = loginObservable.getData();

  if (account) {
    if (account.user.type_user.id == 1) {
      router.navigateByUrl('/DataBases');
    } else if (
      account.user.type_user.id == 4 ||
      account.user.type_user.id == 6
    ) {
      router.navigateByUrl('/Routes');
    }
    return false;
  }

  return true;
};
