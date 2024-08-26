import { AfterViewChecked, ChangeDetectionStrategy, Component } from "@angular/core";
import { AbstractChangeDetectionComponent } from "../abstract-change-detection.component";
import { template } from "../change-detection.component.template";
import { ColorService } from "../color.service";

const NAME = "comp-1-x-2-1";
const LEVEL = 4;
const CD_STRATEGY = ChangeDetectionStrategy.Default;

@Component({
  selector: `app-${NAME}`,
  template: template(),
  styleUrls: ["./../change-detection.component.scss"],
  providers: [ColorService],
  changeDetection: CD_STRATEGY,
  standalone: true,
})
export class Comp_1_x_2_1_Component extends AbstractChangeDetectionComponent implements AfterViewChecked {
  constructor() {
    super(NAME, LEVEL, CD_STRATEGY);
  }

  ngAfterViewChecked(): void {
    console.log("Comp_1_x_2_1_Component_ngAfterViewChecked");
  }
}
