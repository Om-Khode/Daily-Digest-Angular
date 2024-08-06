import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NewsService } from '../../services/news.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-news-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news-item.component.html',
  styleUrl: './news-item.component.css',
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          backgroundColor: 'rgba(33, 37, 41,1)',
          color: 'rgba(255, 255, 255)',
          border: '1px solid #dee2e6',
        })
      ),
      state('closed', style({})),
      transition('open <=> closed', [animate('0.2s ease-in-out')]),
    ]),
  ],
})
export class NewsItemComponent {
  @Input() newsItem!: any;
  @Input() isDarkMode!: boolean;
  @Input() isLoggedIn!: boolean;
  @Input() bookmarkedNews: { _id: string; title: string }[] = [];

  isBookmarked: boolean = false;

  constructor(private newsService: NewsService) {}

  ngOnInit() {
    this.newsItem.publishedAt = new Date(
      this.newsItem.publishedAt
    ).toUTCString();

    if (this.bookmarkedNews) {
      const matchingObject = this.bookmarkedNews.find((item: any) => {
        if (item.title === this.newsItem.title) {
          return item;
        }
      });
      if (matchingObject) {
        this.isBookmarked = true;
        if (!this.newsItem.id) {
          this.newsItem.id = matchingObject._id;
        }
      }
    }
  }

  async handleAddBookmark() {
    const res = await this.newsService.handleAddBookmark(this.newsItem);
    if (res) {
      this.isBookmarked = true;
    }
  }

  async handleRemoveBookmark() {
    this.newsService.handleRemoveBookmark(this.newsItem.id);
    this.isBookmarked = false;
  }
}
