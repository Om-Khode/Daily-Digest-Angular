import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ThemeService } from '../../services/theme.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  isDarkMode: boolean = false;
  passwordError: string[] = [];
  confirmPasswordError: string[] = [];
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private themeService: ThemeService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.themeService.darkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
    });
  }

  userService = inject(UserService);

  applyForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    confPassword: new FormControl(''),
  });

  handleSubmit() {
    if (this.passwordError.length > 0 || this.confirmPasswordError.length > 0) {
      this.toastr.error('Please fill the form correctly');
      return;
    }

    this.userService.signup(this.applyForm.value);
  }

  handlePasswordChange() {
    let password = this.applyForm.get('password')?.value;
    password = password?.trim();

    if (!password) {
      this.passwordError = ['Password is required'];
      return;
    }

    this.passwordError = [];
    if (password.length < 8) {
      this.passwordError.push('Password must be at least 8 characters');
    }
    if (password.search(/[a-z]/) < 0) {
      this.passwordError.push(
        'Password must contain at least one lowercase letter'
      );
    }
    if (password.search(/[A-Z]/) < 0) {
      this.passwordError.push(
        'Password must contain at least one uppercase letter'
      );
    }
    if (password.search(/[0-9]/) < 0) {
      this.passwordError.push('Password must contain at least one number');
    }

    this.handleConfirmPasswordChange();
  }

  handleConfirmPasswordChange() {
    let password = this.applyForm.get('password')?.value;
    let confPassword = this.applyForm.get('confPassword')?.value;

    this.confirmPasswordError = [];
    password = password?.trim();
    confPassword = confPassword?.trim();
    if (password !== confPassword) {
      this.confirmPasswordError.push('Passwords do not match');
    }
  }

  handleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  handleShowConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
