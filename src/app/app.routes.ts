import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { EmailComponent } from './email/email.component';
import { VerifiedComponent } from './verified/verified.component';
import { NewsComponent } from './news/news.component';
import { BookmarkComponent } from './bookmark/bookmark.component';
import { AuthGuard } from './guards/auth.guard';
import { leaveGuard } from './guards/leave.guard';

export const routes: Routes = [
  {
    path: '',
    component: NewsComponent,
    title: 'Daily Digest',
  },
  {
    path: 'news/bookmark',
    component: BookmarkComponent,
    title: 'Daily Digest',
  },
  {
    path: 'news/:category',
    component: NewsComponent,
    title: 'Daily Digest',
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
    canActivate: [AuthGuard],
  },
  {
    path: 'signup',
    component: SignupComponent,
    title: 'Sign up',
    canActivate: [AuthGuard],
    canDeactivate: [leaveGuard],
  },
  {
    path: 'email',
    component: EmailComponent,
    title: 'Email Sent!',
    canActivate: [AuthGuard],
  },
  {
    path: 'verify/:id/:code',
    component: VerifiedComponent,
    title: 'Account Verification',
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: 'news/general' },
];
