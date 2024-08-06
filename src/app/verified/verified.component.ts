import { Component, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-verified',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './verified.component.html',
  styleUrl: './verified.component.css',
})
export class VerifiedComponent {
  route: ActivatedRoute = inject(ActivatedRoute);

  isDarkMode: boolean = false;

  greenTick = '../assets/images/greenTick.svg';
  redWrong = '../assets/images/redWrong.png';

  res: { success: boolean; message: string } = { success: false, message: '' };

  constructor(
    private themeService: ThemeService,
    private userService: UserService
  ) {}

  async verifyEmail() {
    const id = String(this.route.snapshot.paramMap.get('id'));
    const code = String(this.route.snapshot.paramMap.get('code'));

    this.res = await this.userService.verifyEmail({ id, code });
  }

  ngOnInit() {
    this.themeService.darkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
    });
    this.verifyEmail();
  }
}
