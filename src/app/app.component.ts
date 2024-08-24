import {
  afterRender,
  AfterViewChecked,
  AfterViewInit,
  ApplicationRef,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  NgZone,
  OnInit,
  signal,
  viewChild,
  ViewChild,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { toCanvas } from "qrcode";
import { Subject } from "rxjs";

import { DirtyCheckColoringService } from "./dirty-check-coloring.service";
import { NumberHolder } from "./number-holder";
import { WarningService } from "./warning.service";
import { Comp_1_Component } from "./comp-tree/comp-1.component";
import { BellComponent } from "./bell/bell.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: true,
  imports: [Comp_1_Component, BellComponent],
})
export class AppComponent implements OnInit, AfterViewInit, AfterViewChecked {
  private destroyRef = inject(DestroyRef);

  private value = 0;
  public inputSignal = signal(0);
  public inputByVal!: number;
  public inputByRef = new NumberHolder();
  public inputObservable = new Subject<number>();

  @ViewChild("apptick_button", { static: true }) private _apptickButton!: ElementRef;

  @ViewChild("timeout_button", { static: true }) private _timeoutButton!: ElementRef;

  @ViewChild("interval_button", { static: true }) private _intervalButton!: ElementRef;

  @ViewChild("click_button", { static: true }) private _clickButton!: ElementRef;

  @ViewChild("trigger_change", { static: true }) private _triggerChangeButton!: ElementRef;

  //@ViewChild("clear", { static: true }) private _clearButton!: ElementRef;

  @ViewChild("auto_clear", { static: true })
  private _autoClearCheckbox!: ElementRef<HTMLInputElement>;

  @ViewChild("toggle_content_children", { static: true })
  private _toggleContentChildren!: ElementRef<HTMLElement>;

  @ViewChild("input_value_field", { static: true })
  private _inputValueField!: ElementRef<HTMLElement>;

  @ViewChild("propagate_by_value_checkbox", { static: true })
  private _propagateByValueCheckbox!: ElementRef<HTMLInputElement>;

  @ViewChild("propagate_by_input_signal_checkbox", { static: true })
  private _propagateByInputSignalCheckbox!: ElementRef<HTMLInputElement>;

  @ViewChild("propagate_by_ref_checkbox", { static: true })
  private _propagateByRefCheckbox!: ElementRef<HTMLInputElement>;

  @ViewChild("propagate_by_observable_checkbox", { static: true })
  private _propagateByObservableCheckbox!: ElementRef<HTMLInputElement>;

  @ViewChild("qrcode_canvas", { static: true }) private _canvas!: ElementRef<HTMLCanvasElement>;

  _propagateByInputSignalAfterTimeoutCheckbox = viewChild.required<ElementRef<HTMLInputElement>>(
    "propagate_by_input_signal_checkbox_after_timeout",
  );

  cdBell = viewChild.required<BellComponent>("cdBell");
  renderBell = viewChild.required<BellComponent>("renderBell");

  constructor(
    private _appRef: ApplicationRef,
    private _dirtyCheckColoringService: DirtyCheckColoringService,
    private _warningService: WarningService,
    private _cdr: ChangeDetectorRef,
  ) {
    afterRender(() => this.renderBell().ring());
  }

  ngOnInit(): void {
    var canvas = document.getElementById("canvas");

    toCanvas(this._canvas.nativeElement, window.location.href, function (error) {
      if (error) console.error(error);
      console.log("success!");
    });
  }

  ngAfterViewChecked(): void {
    console.log("AppComponent_ngAfterViewChecked");
    this.cdBell().ring();
  }

  onTick() {
    this._dirtyCheckColoringService.clearColoring();
    this._appRef.tick();
    this._cdr.markForCheck();
    this._warningService.hideWarning();
  }

  onTimeout() {
    setTimeout(() => {
      this._warningService.hideWarning();
      console.log(`setTimeout(...)`);
    }, 3000);
  }

  onInterval() {
    const interval = setInterval(() => console.log("hello from interval"), 4000);

    setTimeout(() => clearInterval(interval), 10000);
  }

  onClear() {
    this._warningService.hideWarning();
    this._dirtyCheckColoringService.clearColoring();
  }

  clickNoop(): void {
    console.log(`click`);
  }

  onAutoCheckboxChange(event: Event) {
    const element = event.target as HTMLInputElement;
    this._dirtyCheckColoringService.setAutoClearColoring(element.checked);
  }

  onChange() {
    this._dirtyCheckColoringService.clearColoring();
    this.updateInputValue();
  }

  public ngAfterViewInit(): void {
    //this._dirtyCheckColoringService.setAutoClearColoring(this.isAutoClear());

    // Busy
    this._dirtyCheckColoringService.busy$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((busy) => {
      this._apptickButton.nativeElement.disabled = busy;
      this._timeoutButton.nativeElement.disabled = busy;
      this._intervalButton.nativeElement.disabled = busy;
      this._clickButton.nativeElement.disabled = busy;
      //this._autoClearCheckbox.nativeElement.disabled = busy;
      this._triggerChangeButton.nativeElement.disabled = busy;
      this._propagateByValueCheckbox.nativeElement.disabled = busy;
      this._propagateByInputSignalCheckbox.nativeElement.disabled = busy;
      this._propagateByInputSignalAfterTimeoutCheckbox().nativeElement.disabled = busy;
      this._propagateByRefCheckbox.nativeElement.disabled = busy;
      this._propagateByObservableCheckbox.nativeElement.disabled = busy;

      // if (busy && !this._dirtyCheckColoringService.isAutoClearColoring) {
      //   this._clearButton.nativeElement.classList.add("emphasize");
      // } else {
      //   this._clearButton.nativeElement.classList.remove("emphasize");
      // }
    });
  }

  private updateInputValue(): void {
    this.value++;
    if (this.isPropagateByValue()) {
      this.inputByVal = this.value;
    }
    if (this.isPropagateByInputSignal()) {
      this.inputSignal.set(this.value);
    }
    if (this.isPropagateByInputSignalAfterTimeout()) {
      setTimeout(() => this.inputSignal.set(this.value), 3000);
    }
    if (this.isPropagateByRef()) {
      this.inputByRef.value = this.value;
    }
    if (this.isPropagateByObservable()) {
      this.inputObservable.next(this.value);
    }

    // Update DOM directly because outside Angular zone to not trigger change
    // detection
    const valueElement = this._inputValueField.nativeElement;
    valueElement.innerHTML = this.value.toString(10);
  }

  // private isAutoClear(): boolean {
  //   return this._autoClearCheckbox.nativeElement.checked;
  // }

  private isPropagateByValue(): boolean {
    return this._propagateByValueCheckbox.nativeElement.checked;
  }

  private isPropagateByInputSignal(): boolean {
    return this._propagateByInputSignalCheckbox.nativeElement.checked;
  }

  private isPropagateByInputSignalAfterTimeout(): boolean {
    return this._propagateByInputSignalAfterTimeoutCheckbox().nativeElement.checked;
  }

  private isPropagateByRef(): boolean {
    return this._propagateByRefCheckbox.nativeElement.checked;
  }

  private isPropagateByObservable(): boolean {
    return this._propagateByObservableCheckbox.nativeElement.checked;
  }
}
