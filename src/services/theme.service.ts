import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  darkModeInLocalStorage = localStorage.getItem('darkMode') === 'true';

  private darkModeSubject = new BehaviorSubject<boolean>(
    this.darkModeInLocalStorage
  );
  darkMode$ = this.darkModeSubject.asObservable();

  toggleDarkMode() {
    this.darkModeSubject.next(!this.darkModeSubject.value);
    localStorage.setItem('darkMode', String(this.darkModeSubject.value));
  }
}
