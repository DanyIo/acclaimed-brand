import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from './http.service';
import { Product } from '../models/products';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly productUrl = 'product';
  private productsCache$: BehaviorSubject<Product[]> = new BehaviorSubject<
    Product[]
  >([]);

  constructor(private httpService: HttpService) {
    this.fetchProducts();
  }

  private fetchProducts(): void {
    this.httpService.get<Product[]>(this.productUrl).subscribe((products) => {
      this.productsCache$.next(products);
    });
  }
  getProducts(): Observable<Product[]> {
    return this.productsCache$.asObservable();
  }
  getProductsByCategory(categoryID: number): Observable<Product[]> {
    return this.httpService.get<Product[]>(
      `${this.productUrl}/category/${categoryID}`
    );
  }
  getProductById(productID: number): Observable<Product> {
    return this.httpService.get<Product>(`${this.productUrl}/${productID}`);
  }
}
