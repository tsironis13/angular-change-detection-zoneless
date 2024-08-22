import { ChangeDetectionStrategy, Component } from "@angular/core";
import { AbstractChangeDetectionComponent } from "../abstract-change-detection.component";
import { template } from "../change-detection.component.template";
import { ColorService } from "../color.service";
import { Comp_1_x_3_2_Component } from "./comp-1-x-3-2.component";
import { Comp_1_x_3_1_Component } from "./comp-1-x-3-1.component";

const NAME = "comp-1-x-3";
const LEVEL = 3;
const CD_STRATEGY = ChangeDetectionStrategy.Default;
const CHILD_TEMPLATE = `
  <app-comp-1-x-3-1 [inputByVal]="inputByVal" [inputByRef]="inputByRef" [inputObservable]="inputObservable"></app-comp-1-x-3-1>
  <app-comp-1-x-3-2 [inputByVal]="inputByVal" [inputByRef]="inputByRef" [inputObservable]="inputObservable"></app-comp-1-x-3-2>
`;

@Component({
  selector: `app-${NAME}`,
  template: template(CHILD_TEMPLATE),
  styleUrls: ["./../change-detection.component.scss"],
  providers: [ColorService],
  changeDetection: CD_STRATEGY,
  standalone: true,
  imports: [Comp_1_x_3_1_Component, Comp_1_x_3_2_Component],
})
export class Comp_1_x_3_Component extends AbstractChangeDetectionComponent {
  constructor() {
    super(NAME, LEVEL, CD_STRATEGY);
  }
}
