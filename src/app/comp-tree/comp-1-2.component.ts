import { ChangeDetectionStrategy, Component } from "@angular/core";

import { AbstractChangeDetectionComponent } from "../abstract-change-detection.component";

import { template } from "../change-detection.component.template";
import { ColorService } from "../color.service";
import { Comp_1_x_1_Component } from "./comp-1-x-1.component";
import { Comp_1_x_2_Component } from "./comp-1-x-2.component";

const NAME = "comp-1-2";
const LEVEL = 2;
const CD_STRATEGY = ChangeDetectionStrategy.OnPush;
const CHILD_TEMPLATE = `
  <app-comp-1-x-1 [inputSignal]="inputSignal()" [inputByVal]="inputByVal" [inputByRef]="inputByRef" [inputObservable]="inputObservable">
   <!-- <app-comp-1-x-1-3 [inputByVal]="inputByVal" [inputByRef]="inputByRef" [inputObservable]="inputObservable"></app-comp-1-x-1-3>
    <app-comp-1-x-1-4 [inputByVal]="inputByVal" [inputByRef]="inputByRef" [inputObservable]="inputObservable"></app-comp-1-x-1-4>
    -->
  </app-comp-1-x-1>
  <app-comp-1-x-2 [inputSignal]="inputSignal()" [inputByVal]="inputByVal" [inputByRef]="inputByRef" [inputObservable]="inputObservable">
  <!--
    <app-comp-1-x-2-3 [inputByVal]="inputByVal" [inputByRef]="inputByRef" [inputObservable]="inputObservable"></app-comp-1-x-2-3>
    <app-comp-1-x-2-4 [inputByVal]="inputByVal" [inputByRef]="inputByRef" [inputObservable]="inputObservable"></app-comp-1-x-2-4>
  -->
  </app-comp-1-x-2>
`;

@Component({
  selector: `app-${NAME}`,
  template: template(CHILD_TEMPLATE),
  styleUrls: ["./../change-detection.component.scss"],
  providers: [ColorService],
  changeDetection: CD_STRATEGY,
  standalone: true,
  imports: [Comp_1_x_1_Component, Comp_1_x_2_Component],
})
export class Comp_1_2_Component extends AbstractChangeDetectionComponent {
  constructor() {
    super(NAME, LEVEL, CD_STRATEGY);
  }
}
