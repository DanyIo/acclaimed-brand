import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from './http.service';
import { CategoryModel } from '../models/categories';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly categoryUrl = 'category';
  private categoryCache$: BehaviorSubject<CategoryModel[]> =
    new BehaviorSubject<CategoryModel[]>([]);

  constructor(private httpService: HttpService) {
    this.fetchCategories();
  }

  private fetchCategories(): void {
    this.httpService
      .get<CategoryModel[]>(this.categoryUrl)
      .subscribe((categories) => {
        this.categoryCache$.next(categories);
      });
  }
  getCategories(): Observable<CategoryModel[]> {
    return this.categoryCache$.asObservable();
  }
}
