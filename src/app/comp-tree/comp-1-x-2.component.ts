import { AfterViewChecked, ChangeDetectionStrategy, Component, DoCheck, viewChild } from "@angular/core";
import { AbstractChangeDetectionComponent } from "../abstract-change-detection.component";
import { template } from "../change-detection.component.template";
import { ColorService } from "../color.service";
import { Comp_1_x_2_1_Component } from "./comp-1-x-2-1.component";
import { Comp_1_x_2_2_Component } from "./comp-1-x-2-2.component";
import { BellComponent } from "../bell/bell.component";

const NAME = "comp-1-x-2";
const LEVEL = 3;
const CD_STRATEGY = ChangeDetectionStrategy.OnPush;
const CHILD_TEMPLATE = `
  <app-bell #cdBell
        class="absolute top-0 right-0 -translate-x-0 -translate-y-0"
      />
  <app-comp-1-x-2-1 [inputSignal]="inputSignal()" [inputByVal]="inputByVal" [inputByRef]="inputByRef" [inputObservable]="inputObservable"></app-comp-1-x-2-1>
  <app-comp-1-x-2-2 [inputSignal]="inputSignal()" [inputByVal]="inputByVal" [inputByRef]="inputByRef" [inputObservable]="inputObservable"></app-comp-1-x-2-2>
`;

@Component({
  selector: `app-${NAME}`,
  template: template(CHILD_TEMPLATE),
  styleUrls: ["./../change-detection.component.scss"],
  providers: [ColorService],
  changeDetection: CD_STRATEGY,
  standalone: true,
  imports: [Comp_1_x_2_1_Component, Comp_1_x_2_2_Component, BellComponent],
})
export class Comp_1_x_2_Component extends AbstractChangeDetectionComponent implements DoCheck, AfterViewChecked {
  cdBell = viewChild.required<BellComponent>("cdBell");

  constructor() {
    super(NAME, LEVEL, CD_STRATEGY);
  }

  ngDoCheck(): void {
    // console.log("Comp_1_x_2_Component_ngDoCheck");
  }

  ngAfterViewChecked(): void {
    this.cdBell().ring();
    console.log("Comp_1_x_2_Component_ngAfterViewChecked");
  }
}
