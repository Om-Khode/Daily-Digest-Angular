import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

export const AuthGuard: CanActivateFn = (route, state) => {
  if (!localStorage.getItem('token')) {
    return true;
  } else {
    const router = new Router();
    router.navigate(['/news/general']);
    return false;
  }
};
