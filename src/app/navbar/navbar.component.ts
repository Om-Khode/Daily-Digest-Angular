import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';
import { NavigationEnd, RouterModule } from '@angular/router';
import { ToggleModeComponent } from '../toggle-mode/toggle-mode.component';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ToggleModeComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          backgroundColor: 'rgba(33, 37, 41,1)',
          color: 'rgba(255, 255, 255)',
        })
      ),
      state('closed', style({})),
      transition('open <=> closed', [animate('0.2s ease-in-out')]),
    ]),
  ],
})
export class NavbarComponent {
  isDarkMode: boolean = false;
  isLoggedIn: boolean = false;
  category: any;
  title: string = '';

  constructor(
    private themeService: ThemeService,
    private userService: UserService,
    private router: Router
  ) {
    this.router.events.forEach((e) => {
      if (e instanceof NavigationEnd) {
        this.title = e.url;
      }
    });
  }

  ngOnInit() {
    this.themeService.darkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
    });
    this.userService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  logout() {
    this.userService.logout();
  }

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }
}
