import { AfterViewChecked, ChangeDetectionStrategy, Component, DoCheck, signal, viewChild } from "@angular/core";

import { AbstractChangeDetectionComponent } from "../abstract-change-detection.component";

import { template } from "../change-detection.component.template";
import { ColorService } from "../color.service";
import { Comp_1_2_Component } from "./comp-1-2.component";
import { Comp_1_1_Component } from "./comp-1-1.component";
import { BellComponent } from "../bell/bell.component";

const NAME = "comp-1";
const LEVEL = 1;
const CD_STRATEGY = ChangeDetectionStrategy.Default;
const CHILD_TEMPLATE = ` 
  <div style="position:absolute;top: 0;left: 0;">
    <div>Signal Value</div>
    <div style="font-weight: bold;">{{testSignal()}}</div>
    <button class="custom-button" (click)="onTimeout()">after 3s timeout</button>
  </div>
  <div style="position:absolute;top: 85px;left: 0;">
    <div>Signal Input After 3 seconds</div>    
    <button class="custom-button" (click)="onInputSignalTimeout()">singal input after 3s timeout</button>
  </div>
  <div>{{test}}</div>
  <app-bell #cdBell
        class="absolute top-0 right-0 -translate-x-0 -translate-y-0"
      />
  <app-comp-1-1 [inputSignal]="inputSignal()" [inputSignalAfterTimeout]="inputSignalAfterTimeout()" [inputByVal]="inputByVal" [inputByRef]="inputByRef" [inputObservable]="inputObservable">  
  <!--     <app-comp-1-x-3 [inputByVal]="inputByVal" [inputByRef]="inputByRef" [inputObservable]="inputObservable">
        <app-comp-1-x-3-3 [inputByVal]="inputByVal" [inputByRef]="inputByRef" [inputObservable]="inputObservable"></app-comp-1-x-3-3>
        <app-comp-1-x-3-4 [inputByVal]="inputByVal" [inputByRef]="inputByRef" [inputObservable]="inputObservable"></app-comp-1-x-3-4>
    
     </app-comp-1-x-3>
     <app-comp-1-x-4 [inputByVal]="inputByVal" [inputByRef]="inputByRef" [inputObservable]="inputObservable">
      <app-comp-1-x-4-3 [inputByVal]="inputByVal" [inputByRef]="inputByRef" [inputObservable]="inputObservable"></app-comp-1-x-4-3>
        <app-comp-1-x-4-4 [inputByVal]="inputByVal" [inputByRef]="inputByRef" [inputObservable]="inputObservable"></app-comp-1-x-4-4> 
        
     </app-comp-1-x-4>-->
  </app-comp-1-1>
  <app-comp-1-2 [inputSignal]="inputSignal()" [inputByVal]="inputByVal" [inputByRef]="inputByRef" [inputObservable]="inputObservable">
  <!--

     <app-comp-1-x-3 [inputByVal]="inputByVal" [inputByRef]="inputByRef" [inputObservable]="inputObservable">
        <app-comp-1-x-3-3 [inputByVal]="inputByVal" [inputByRef]="inputByRef" [inputObservable]="inputObservable"></app-comp-1-x-3-3>
        <app-comp-1-x-3-4 [inputByVal]="inputByVal" [inputByRef]="inputByRef" [inputObservable]="inputObservable"></app-comp-1-x-3-4>
        
      </app-comp-1-x-3>
     <app-comp-1-x-4 [inputByVal]="inputByVal" [inputByRef]="inputByRef" [inputObservable]="inputObservable">
     
        <app-comp-1-x-4-3 [inputByVal]="inputByVal" [inputByRef]="inputByRef" [inputObservable]="inputObservable"></app-comp-1-x-4-3>
        <app-comp-1-x-4-4 [inputByVal]="inputByVal" [inputByRef]="inputByRef" [inputObservable]="inputObservable"></app-comp-1-x-4-4>
      </app-comp-1-x-4>
      -->

  </app-comp-1-2>`;

@Component({
  selector: `app-${NAME}`,
  template: template(CHILD_TEMPLATE),
  styleUrls: ["./../change-detection.component.scss"],
  providers: [ColorService],
  changeDetection: CD_STRATEGY,
  standalone: true,
  imports: [Comp_1_1_Component, Comp_1_2_Component, BellComponent],
})
export class Comp_1_Component extends AbstractChangeDetectionComponent implements DoCheck, AfterViewChecked {
  cdBell = viewChild.required<BellComponent>("cdBell");
  test = 0;

  constructor() {
    super(NAME, LEVEL, CD_STRATEGY);

    setTimeout(() => (this.test = Math.floor(Math.random() * 101)), 4000);
  }

  testSignal = signal("Signal Data");
  inputSignalAfterTimeout = signal(0);

  onTimeout() {
    setTimeout(() => this.testSignal.set("Signal Updated After 3 seconds"), 3000);
  }

  onInputSignalTimeout() {
    setTimeout(() => this.inputSignalAfterTimeout.set(1), 3000);
  }

  ngDoCheck(): void {
    //console.log("Comp_1_Component_ngDoCheck");
  }

  ngAfterViewChecked(): void {
    console.log("Comp_1_Component_ngAfterViewChecked");
    this.cdBell().ring();
  }
}
