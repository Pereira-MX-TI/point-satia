import { LoginObservable } from '../observables/login.observable';
import { RouteObservable } from '../observables/route.observable';

export function initializeApp(
  loginObservable: LoginObservable,
  routeObservable: RouteObservable
): () => Promise<void> {
  return async () => {
    await loginObservable.checkLocalStoreData();
    await routeObservable.checkLocalStoreData();
  };
}
