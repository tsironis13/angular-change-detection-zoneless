import { ElementRef, Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { delay, delayWhen, distinctUntilChanged, take } from "rxjs/operators";
import { DelayedScheduler } from "./delayed-scheduler.service";

/**
 * Controls coloring of dirty checked components.
 */
@Injectable({ providedIn: "root" })
export class DirtyCheckColoringService {
  private _clearColoring$ = new Subject<void>();
  private _autoClearColoring = true;
  private _busy$ = new BehaviorSubject<boolean>(false);

  get isAutoClearColoring(): boolean {
    return this._autoClearColoring;
  }

  constructor(private _delayedScheduler: DelayedScheduler) {}

  public clearColoring(): void {
    this._clearColoring$.next();
  }

  public setAutoClearColoring(autoClear: boolean): void {
    this._autoClearColoring = autoClear;
    if (autoClear) {
      this.clearColoring();
    }
  }

  public colorDirtyCheck(elementRef: ElementRef<HTMLElement>): void {
    console.log("colorDirtyCheck");
    this._busy$.next(true);

    const element = elementRef.nativeElement;
    const cssClass = "dirty-check";
    this._delayedScheduler.schedule(() => {
      element.classList.add(cssClass);
    });

    if (this._autoClearColoring) {
      this._delayedScheduler.done$
        .pipe(
          take(1), // subscribe once
          delay(1000), // clear after 1s
        )
        .subscribe(() => {
          element.classList.remove(cssClass);
          this._busy$.next(false);
        });
    } else {
      this._delayedScheduler.done$
        .pipe(
          take(1), // subscribe once
          delayWhen(() => this._clearColoring$),
        )
        .subscribe(() => {
          element.classList.remove(cssClass);
          this._busy$.next(false);
        });
    }
  }

  public get busy$(): Observable<boolean> {
    return this._busy$.asObservable().pipe(distinctUntilChanged());
  }
}
