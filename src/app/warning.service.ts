import { Injectable } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Subject } from "rxjs";

@Injectable({ providedIn: "root" })
export class WarningService {
  private _showWarning = new Subject<boolean>();
  shouldShouldWarning = this._showWarning.asObservable();

  constructor() {
    this._showWarning.pipe(takeUntilDestroyed()).subscribe((show) => {
      (document.querySelector(".cd-warning") as HTMLElement).style["opacity"] = show ? "1" : "0";
    });
  }

  showWarning() {
    this._showWarning.next(true);
  }

  hideWarning() {
    this._showWarning.next(false);
  }
}
