import { Subscription } from 'rxjs';

export function initializeListSubscription(res: number): Subscription[] {
  const list: Subscription[] = [];
  for (let index = 0; index <= res; index++) list.push(new Subscription());
  return list;
}
