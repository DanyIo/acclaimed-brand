import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgFor, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  navigationMenu: any = [
    { name: 'Home', routerLink: '/' },
    { name: 'Products', routerLink: '/search/:all' },
    { name: 'Contact Us', routerLink: '/search/:contact-us' },
  ];
}
