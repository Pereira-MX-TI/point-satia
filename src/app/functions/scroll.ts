import { IonicStorageService } from '../services/ionic-storage.service';

export function scrollTo(element: HTMLElement, to: number, duration: number) {
  const start = element.scrollTop;
  const change = to - start;
  let currentTime = 0;
  const increment = 20;

  const animateScroll = () => {
    currentTime += increment;
    const val = easeInOutQuad(currentTime, start, change, duration);
    element.scrollTop = val;

    if (currentTime < duration) {
      requestAnimationFrame(animateScroll);
    }
  };

  animateScroll();
}

export function easeInOutQuad(
  t: number,
  b: number,
  c: number,
  d: number
): number {
  t /= d / 2;
  if (t < 1) {
    return (c / 2) * t * t + b;
  }
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
}

export function restoreScroll(
  ionicStorageService: IonicStorageService,
  nameList: string,
  containerList: any,
  time: number
): void {
  ionicStorageService.get(nameList).then((dataStore: any) => {
    if (!dataStore) return 0;
    const positionScroll = Number(dataStore);
    ionicStorageService.remove(nameList);

    setTimeout(() => {
      scrollTo(containerList.nativeElement, positionScroll, time);
      containerList.nativeElement.scrollTop += positionScroll;
    }, time);

    return positionScroll;
  });
}
