import { DOCUMENT } from "@angular/common";
import { inject, Injectable } from "@angular/core";
import { EventManagerPlugin } from "@angular/platform-browser";

@Injectable()
export class ZoneEventPlugin extends EventManagerPlugin {
  constructor() {
    super(inject(DOCUMENT));
  }

  protected readonly modifier = ".outside";

  override addEventListener(element: HTMLElement, eventName: string, handler: Function): Function {
    console.log("Zone Event Plugin");
    return this.manager.getZone().runOutsideAngular(() => {
      return this.manager.addEventListener(element, this.unwrap(eventName), handler);
    });
  }

  supports(event: string): boolean {
    return event.includes(this.modifier);
  }

  /** This is not used in Ivy anymore */
  addGlobalEventListener(): Function {
    return () => {};
  }

  protected unwrap(event: string): string {
    return event
      .split(".")
      .filter((v) => !this.modifier.includes(v))
      .join(".");
  }
}
