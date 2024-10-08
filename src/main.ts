import { enableProdMode, provideExperimentalZonelessChangeDetection } from "@angular/core";
import {
  bootstrapApplication
} from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";

enableProdMode();

bootstrapApplication(AppComponent, {
  providers: [
    provideExperimentalZonelessChangeDetection(),    
  ],
}).catch((err) => console.error(err));
