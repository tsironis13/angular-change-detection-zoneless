import {ElementRef, Injectable, NgZone} from '@angular/core';

import {DirtyCheckColoringService} from './dirty-check-coloring.service';

@Injectable()
export class ColorService {
  private ngOnChangesHandle?: number;

  constructor(
      private _zone: NgZone, private _dirtyCheckColoringService: DirtyCheckColoringService) {}

  public colorNgOnChanges(elementRef: ElementRef<HTMLElement>): void {
    this._zone.runOutsideAngular(() => {
      clearTimeout(this.ngOnChangesHandle);
      this.ngOnChangesHandle = this.blink(elementRef.nativeElement, 'ng-on-changes');
    });
  }

  public colorDirtyCheck(elementRef: ElementRef): void {
    this._zone.runOutsideAngular(() => {
      this._dirtyCheckColoringService.colorDirtyCheck(elementRef);
    });
  }

  public colorChangeDetectorDetached(hostRef: ElementRef<HTMLElement>): void {
    this._zone.runOutsideAngular(() => {
      hostRef.nativeElement.classList.add('cd-detached');
    });
  }

  public colorChangeDetectorAttached(hostRef: ElementRef<HTMLElement>): void {
    this._zone.runOutsideAngular(() => {
      hostRef.nativeElement.classList.remove('cd-detached');
    });
  }

  private blink(element: HTMLElement, cssClass: string): number {
    element.classList.add(cssClass);
    return window.setTimeout(() => element.classList.remove(cssClass), 1500);
  }
}
