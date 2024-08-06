import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { EmailComponent } from './email/email.component';
import { VerifiedComponent } from './verified/verified.component';
import { NewsComponent } from './news/news.component';
import { BookmarkComponent } from './bookmark/bookmark.component';

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
  },
  {
    path: 'signup',
    component: SignupComponent,
    title: 'Sign up',
  },
  {
    path: 'email',
    component: EmailComponent,
    title: 'Email Sent!',
  },
  {
    path: 'verify/:id/:code',
    component: VerifiedComponent,
    title: 'Account Verification',
  },
  { path: '**', redirectTo: 'news/general' },
];
