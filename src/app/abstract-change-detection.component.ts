import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  DestroyRef,
  Directive,
  ElementRef,
  HostBinding,
  inject,
  Injectable,
  input,
  Input,
  OnChanges,
  signal,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { fromEvent, Observable, Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";

import { ColorService } from "./color.service";
import { DirtyCheckColoringService } from "./dirty-check-coloring.service";
import { NumberHolder } from "./number-holder";
import { WarningService } from "./warning.service";

@Directive()
export abstract class AbstractChangeDetectionComponent implements AfterViewInit, OnChanges {
  private destroyRef = inject(DestroyRef);
  private _destroyInputObservable$ = new Subject<void>();
  private cdRef = inject(ChangeDetectorRef);

  @ViewChild("execute_button", { static: true })
  private _executeButton!: ElementRef<HTMLButtonElement>;
  @ViewChild("hidden_button", { static: true }) private _hiddenButton!: ElementRef<HTMLButtonElement>;
  @ViewChild("action_list", { static: true }) private _actionSelect!: ElementRef<HTMLSelectElement>;

  @ViewChild("cd_state_box", { static: true }) private _cdStateBox!: ElementRef;

  @ViewChild("ng_on_changes_box", { static: true }) private _ngOnChangesBox!: ElementRef;
  @ViewChild("ng_marked", { static: true }) private _ngMarked!: ElementRef;

  @Input() public inputByRef!: NumberHolder;
  @Input() public inputByVal!: number;
  @Input() public inputObservable!: Observable<number>;
  public inputSignal = input<number>(0);

  @HostBinding("attr.class")
  public get hostClass(): string {
    return `${this.cdStrategyName} level-${this._level}`;
  }

  public inputObservableValue!: number;
  public cdStrategyName: string;

  private _hostRef = inject(ElementRef);
  private _colorService = inject(ColorService);
  private _dirtyCheckColoringService = inject(DirtyCheckColoringService);
  private _cd = inject(ChangeDetectorRef);
  private _warningService = inject(WarningService);
  private _stateService = inject(StateService);
  protected signal = signal(0);

  constructor(
    public name: string,
    private _level: number,
    cdStrategy: ChangeDetectionStrategy,
  ) {
    this.cdStrategyName = ChangeDetectionStrategy[cdStrategy];

    this._stateService.state$.pipe(takeUntilDestroyed()).subscribe((force) => {
      const cdStatus = this.getCdStatus(this._cd);
      if (cdStatus || force) {
        this._ngMarked.nativeElement.innerHTML = cdStatus;
        this._ngMarked.nativeElement.className = "";
        this._ngMarked.nativeElement.classList.add("tag", cdStatus?.replace(" ", "-"));
      }
    });
  }

  public ngAfterViewInit(): void {
    this._dirtyCheckColoringService.busy$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((busy) => {
      //console.log("Is Busy: " + busy);
      this._actionSelect.nativeElement.disabled = busy;
      this._executeButton.nativeElement.disabled = busy;
      if (!busy) {
        this._stateService.updateState(true);
      }
    });

    // Signal change
    fromEvent(this._executeButton.nativeElement, "click")
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => this._dirtyCheckColoringService.clearColoring()),
      )
      .subscribe(() => {
        const action = this._actionSelect.nativeElement.value;
        switch (action) {
          case "click":
            // we click on the hidden button to trigger a
            // template binding event
            this._hiddenButton.nativeElement.click();
            break;
          case "detach":
            this.onDetach();
            break;
          case "attach":
            this.onAttach();
            break;
          case "dc":
            this.onDetectChanges();
            break;
          case "mfc":
            this.onMarkForCheck();
            break;
          case "signal":
            this.onSignal();

            break;
        }
        if (action != "click") {
          this._stateService.updateState();
        }
      });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.inputObservable) {
      this._destroyInputObservable$.next();
      this.inputObservable
        .pipe(takeUntilDestroyed(this.destroyRef), takeUntil(this._destroyInputObservable$))
        .subscribe((value) => (this.inputObservableValue = value));
    }
    this._colorService.colorNgOnChanges(this._ngOnChangesBox);
  }

  public get touch(): void {
    return this._colorService.colorDirtyCheck(this._hostRef);
  }

  public onClick(): void {
    this._warningService.hideWarning();
    this._stateService.updateState();
    console.log(`Click for ${this.name}`);
  }

  private onDetectChanges(): void {
    console.log(`ChangeDetectorRef.detectChanges() for ${this.name}`);
    this._cd.detectChanges();
  }

  private onMarkForCheck(): void {
    console.log(`ChangeDetectorRef.markForCheck() for ${this.name}`);
    this._cd.markForCheck();
  }

  private onDetach(): void {
    console.log(`ChangeDetectorRef.detach() for ${this.name}`);
    this._cd.detach();
    this._colorService.colorChangeDetectorDetached(this._cdStateBox);
  }

  private onAttach(): void {
    console.log(`ChangeDetectorRef.reattach() for ${this.name}`);
    this._cd.reattach();
    this._colorService.colorChangeDetectorAttached(this._cdStateBox);
  }

  private onSignal(): void {
    this.signal.update((v) => v + 1);
  }

  private getCdStatus(cdRef: ChangeDetectorRef): CdStatus {
    let lView = (cdRef as any)._lView;

    const flags: number = lView[2]; // FLAGS=2
    const consumer = lView[23]; // REACTIVE_TEMPLATE_CONSUMER =  23

    if (flags & 64) {
      // LViewFlags.Dirty = 1 << 6 = 64
      return "dirty";
    } else if (flags & 8192) {
      // LViewFlags.HasChildViewsToRefresh = 8192
      return "HasChildViewsToRefresh";
    } else if (flags & 1024) {
      return "RefreshView";
    } else if (consumer.dirty) {
      return "Consumer dirty";
    } else {
      return null;
    }
  }
}

type CdStatus = "HasChildViewsToRefresh" | "RefreshView" | "dirty" | "Consumer dirty" | null;

@Injectable({ providedIn: "root" })
export class StateService {
  private _state = new Subject<boolean>();

  public get state$(): Observable<boolean> {
    return this._state.asObservable();
  }

  public updateState(cleanup = false): void {
    this._state.next(cleanup);
  }
}
