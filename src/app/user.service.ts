import { Injectable } from '@angular/core';
import { environment } from '../enviroments/enviroment';
import axios from 'axios';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  url = environment.API_URL;
  isLoggedIn = localStorage.getItem('token') ? true : false;

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  loggedIn() {
    this.isLoggedInSubject.next(true);
    localStorage.setItem('darkMode', String(true));
  }

  logout() {
    this.isLoggedInSubject.next(false);
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  showError(err: any) {
    const errors = err.response.data.msg;
    if (typeof errors == 'string') {
      this.toastr.error(errors);
    } else if (typeof errors == 'object') {
      const message = errors.map((obj: any) => obj.msg);
      this.toastr.error(message.join('<br> '), '', {
        enableHtml: true,
      });
    }
  }

  constructor(private toastr: ToastrService, private router: Router) {
    if (localStorage.getItem('token')) {
      this.loggedIn();
    }
  }

  async signup(data: any) {
    if (
      data.name === '' ||
      data.email === '' ||
      data.password === '' ||
      data.confPassword === ''
    ) {
      this.toastr.error('Please fill all the fields');
      return;
    }

    if (data.password !== data.confPassword) {
      this.toastr.error('Passwords do not match');
      return;
    }

    const body = JSON.stringify(data);

    try {
      const res = await axios.post(
        `${this.url}/api/auth/createuser`,
        body,
        this.config
      );
      if (res.data.success === true) {
        this.toastr.success(res.data.msg);
        this.router.navigate(['/email']);
        localStorage.setItem('token', res.data.authtoken);
      } else {
        this.toastr.error(res.data.msg);
      }
    } catch (err) {
      this.showError(err);
    }
  }

  async login(data: any) {
    if (data.email === '' || data.password === '') {
      this.toastr.error('Please fill all the fields');
      return;
    }

    const body = JSON.stringify(data);

    try {
      const res = await axios.post(
        `${this.url}/api/auth/login`,
        body,
        this.config
      );
      if (res.data.success === true) {
        this.toastr.success(res.data.msg);
        localStorage.setItem('token', res.data.authtoken);
        this.loggedIn();
        this.router.navigate(['/']);
      } else {
        this.toastr.error(res.data.msg);
      }
    } catch (err) {
      this.showError(err);
    }
  }

  async verifyEmail({ id, code }: { id: string; code: string }) {
    try {
      const res = await axios.get(
        `${this.url}/api/auth/verify/` + id + '/' + code,
        this.config
      );
      return { success: res.data.success, message: res.data.msg };
    } catch (err) {
      this.showError(err);
      return { success: false, message: 'Internal Server Error' };
    }
  }
}
