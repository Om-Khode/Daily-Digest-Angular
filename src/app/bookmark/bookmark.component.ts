import { Component } from '@angular/core';
import { ThemeService } from '../theme.service';
import { UserService } from '../user.service';
import { NewsService } from '../news.service';
import { NewsItemComponent } from '../news-item/news-item.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bookmark',
  standalone: true,
  imports: [CommonModule, NewsItemComponent],
  templateUrl: './bookmark.component.html',
  styleUrl: './bookmark.component.css',
})
export class BookmarkComponent {
  isDarkMode = false;
  isLoggedIn = false;
  newsData: any[] = [];
  bookmarkedNews: any[] = [];
  category = 'Bookmark';

  constructor(
    private themeService: ThemeService,
    private userService: UserService,
    private newsService: NewsService
  ) {
    if (!localStorage.getItem('token')) {
      this.userService.showError({
        response: { data: { msg: 'Please login to view your bookmarks' } },
      });
      this.userService.logout();
    }
  }

  ngOnInit() {
    this.themeService.darkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
    });

    this.userService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });

    this.newsService.fetchBookmarkedNews().then((data) => {
      this.bookmarkedNews = data;
      this.newsData = data;
    });
  }
}
