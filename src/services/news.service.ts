import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../enviroments/enviroment';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  url = environment.API_URL;
  apiKey = environment.NEWS_API;

  news: any[] = [];

  bookmarked: any[] = [];

  filteredNews: any[] = [];

  constructor(private toastr: ToastrService) {}

  async fetchNews(category: string) {
    try {
      const url =
        'https://newsapi.org/v2/top-headlines?country=in&category=' +
        category +
        '&apiKey=' +
        this.apiKey +
        '&page=1&pageSize=8';

      let data = await axios.get(url);

      this.news = data.data.articles;

      this.fetchBookmarkedNews();

      return { news: this.news, totalResults: data.data.totalResults };
    } catch (error) {
      console.log(error);
      return { news: this.news, totalResults: 0 };
    }
  }

  async updateNews(category: string, page: number) {
    try {
      const url =
        'https://newsapi.org/v2/top-headlines?country=in&category=' +
        category +
        '&apiKey=' +
        this.apiKey +
        '&page=' +
        page +
        '&pageSize=8';

      let data = await axios.get(url);

      const newNews = data.data.articles;

      this.news = this.news.concat(newNews);

      return this.news;
    } catch (error) {
      console.log(error);
      return this.news;
    }
  }

  async fetchBookmarkedNews() {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    let config = {
      headers: {
        'Content-Type': 'application/json',
        'auth-token': token,
      },
    };

    try {
      const res = await axios.get(`${this.url}/api/news/fetchallnews`, config);

      if (res.data.success === true) {
        const allBookmarkedNews = res.data.data;
        return allBookmarkedNews;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async handleAddBookmark(newsItem: any) {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    let body = JSON.stringify({
      title: newsItem.title,
      description: newsItem.description,
      urlToImage: newsItem.urlToImage,
      url: newsItem.url,
      author: newsItem.author,
      publishedAt: newsItem.publishedAt,
      source: newsItem.source.name,
    });

    let config = {
      headers: {
        'Content-Type': 'application/json',
        'auth-token': token,
      },
    };
    try {
      const response = await axios.post(
        `${this.url}/api/news/addnews`,
        body,
        config
      );
      if (response.data.success === true) {
        this.toastr.success(response.data.msg);
      } else {
        this.toastr.error(response.data.msg);
      }
      return response.data.success;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async handleRemoveBookmark(id: string) {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    let config = {
      headers: {
        'Content-Type': 'application/json',
        'auth-token': token,
      },
    };

    try {
      const response = await axios.delete(
        `${this.url}/api/news/deletenews/${id}`,
        config
      );
      if (response.data.success === true) {
        this.toastr.success(response.data.msg);
      } else {
        this.toastr.error(response.data.msg);
      }
      return response.data.success;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  search(searchText: string) {
    this.filteredNews =
      searchText === ''
        ? this.news
        : this.news.filter((element) => {
            return element.title
              .toLowerCase()
              .includes(searchText.toLowerCase());
          });

    return this.filteredNews;
  }
}
