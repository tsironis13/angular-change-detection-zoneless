import { ChangeDetectionStrategy, Component, ElementRef, inject, input, viewChild } from "@angular/core";
import { AnimateService } from "../services/animate.service";

@Component({
  selector: "app-bell",
  standalone: true,
  imports: [],
  template: `
    <div class="shadow-2xl border-1 bg-slate-700 w-fit px-7 py-5 rounded-full text-center text-slate-50">
      <div>{{ bellType() }}</div>
      <span #bellIcon class="bell material-symbols-outlined text-4xl"> notifications_active </span>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BellComponent {
  bellType = input<"render" | "cd">("cd");

  animateService = inject(AnimateService);

  private readonly bellIcon = viewChild.required<ElementRef<HTMLElement>>("bellIcon");

  public ring() {
    this.animateService.animateBell(this.bellIcon().nativeElement);
  }
}
