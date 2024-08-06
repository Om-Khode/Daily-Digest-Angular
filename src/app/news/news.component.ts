import { Component, inject } from '@angular/core';
import { ThemeService } from '../theme.service';
import { CommonModule } from '@angular/common';
import { NewsItemComponent } from '../news-item/news-item.component';
import { UserService } from '../user.service';
import { NewsService } from '../news.service';
import { ActivatedRoute } from '@angular/router';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, NewsItemComponent, InfiniteScrollDirective],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css',
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
export class NewsComponent {
  isDarkMode: boolean = false;
  isLoggedIn: boolean = false;

  route: ActivatedRoute = inject(ActivatedRoute);
  newsData: any[] = [];
  bookmarkedNews: any[] = [];
  page: number = 1;
  loading: boolean = false;
  totalResults: number = 0;
  stopFetching: boolean = false;

  throttle = 300;
  scrollDistance = 0.1;

  searchText: string = '';
  filteredNews: any[] = [];

  capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  category: string = this.capitalizeFirstLetter('general');

  constructor(
    private themeService: ThemeService,
    private userService: UserService,
    private newsService: NewsService
  ) {}

  ngOnInit() {
    this.themeService.darkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
    });

    this.userService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });

    this.route.paramMap.subscribe((params) => {
      this.category = this.capitalizeFirstLetter(
        params.get('category') || 'general'
      );

      this.newsService.fetchNews(this.category).then((data) => {
        this.page = 1;
        this.newsData = data.news;
        this.totalResults = data.totalResults;
        this.filteredNews = data.news;
        this.searchText = '';
      });
    });

    this.newsService.fetchBookmarkedNews().then((data) => {
      this.bookmarkedNews = data;
    });
  }

  searchKey(event: any) {
    this.searchText = event.target.value;
    this.filteredNews = this.newsService.search(this.searchText);
    this.newsData = this.filteredNews;
    if (this.searchText !== '') {
      this.stopFetching = true;
    } else {
      this.stopFetching = false;
    }
  }

  async fetchMoreData() {
    if (this.newsData.length >= this.totalResults) {
      return;
    }
    this.loading = true;
    try {
      this.page = this.page + 1;
      let data = await this.newsService.updateNews(this.category, this.page);
      this.newsData = data;
    } catch (error) {
      console.log(error);
    }
    this.loading = false;
  }

  onScrollDown() {
    this.fetchMoreData();
  }

  items = ['item1', 'item2', 'item3', 'item4'];

  isFilterOn(state: boolean) {
    this.stopFetching = state;
  }

  filterNews(filteredNews: any[]) {
    this.newsData = filteredNews;
  }
}
