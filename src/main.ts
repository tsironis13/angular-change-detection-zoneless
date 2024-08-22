import { enableProdMode } from "@angular/core";
import {
  bootstrapApplication,
  EVENT_MANAGER_PLUGINS,
} from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { ZoneEventPlugin } from "./app/zone.event-plugin";

enableProdMode();

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: EVENT_MANAGER_PLUGINS,
      useClass: ZoneEventPlugin,
      multi: true,
    },
  ],
}).catch((err) => console.error(err));
