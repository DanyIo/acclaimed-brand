import { Component } from "@angular/core";
import { NavbarComponent } from "./navbar/navbar.component";
import { LogoComponent } from "./logo/logo.component";
import { RouterOutlet, RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [
    NavbarComponent,
    LogoComponent,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css",
})
export class HeaderComponent {}
