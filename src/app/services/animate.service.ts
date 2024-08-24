import { Injectable } from "@angular/core";
import { animate } from "motion";

@Injectable({
  providedIn: "root",
})
export class AnimateService {
  animateBell(element: HTMLElement) {
    animate(
      element,
      {
        transform: ["rotate(45deg)", "rotate(-45deg)", "none"],
      },
      {
        offset: [0, 0.5, 1],
      },
    );
  }
}
