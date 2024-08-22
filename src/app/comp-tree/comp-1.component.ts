import { ChangeDetectionStrategy, Component } from "@angular/core";

import { AbstractChangeDetectionComponent } from "../abstract-change-detection.component";

import { template } from "../change-detection.component.template";
import { ColorService } from "../color.service";
import { Comp_1_2_Component } from "./comp-1-2.component";
import { Comp_1_1_Component } from "./comp-1-1.component";

const NAME = "comp-1";
const LEVEL = 1;
const CD_STRATEGY = ChangeDetectionStrategy.Default;
const CHILD_TEMPLATE = ` 
  <app-comp-1-1 [inputSignal]="inputSignal()" [inputByVal]="inputByVal" [inputByRef]="inputByRef" [inputObservable]="inputObservable">  
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
  imports: [Comp_1_1_Component, Comp_1_2_Component],
})
export class Comp_1_Component extends AbstractChangeDetectionComponent {
  constructor() {
    super(NAME, LEVEL, CD_STRATEGY);
  }
}
