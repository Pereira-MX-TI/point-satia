import { Injectable } from '@angular/core';
import { CanDeactivate, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ExitPage } from '../models/shared/exitPage';

@Injectable({
  providedIn: 'root',
})
export class ExitPageGuard implements CanDeactivate<unknown> {
  canDeactivate(
    component: ExitPage
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return component.onExit ? component.onExit() : true;
  }
}
