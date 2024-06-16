import { AsyncPipe, NgFor, NgIf, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Observable, map } from 'rxjs';
import { Product } from '../../models/products';
import { CategoryModel } from '../../models/categories';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    NgFor,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgIf,
    AsyncPipe,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    NgClass,
    MatButton,
    MatIconModule,
    MatCheckboxModule,
    MatSliderModule,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit {
  currentRoute: string = '';
  filteredProducts$!: Observable<Product[]>;
  categories$!: Observable<CategoryModel[]>;
  selectedCategories: number[] = [];
  dropdownOpen: boolean = false;
  selectedParameters: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private _productService: ProductService,
    private _categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.fetchCategories();
    this.fetchProducts();

    const savedFilters = JSON.parse(
      localStorage.getItem('savedFilters') || '{}'
    );
    if (savedFilters) {
      this.selectedCategories = savedFilters.selectedCategories || [];
      this.applyFilters();
    }
  }
  toggleCategory(categoryId: number): void {
    const index = this.selectedCategories.indexOf(categoryId);
    if (index !== -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(categoryId);
    }
    this.applyFilters();
  }

  isSelected(categoryId: number): boolean {
    return this.selectedCategories.includes(categoryId);
  }
  applyFilters(): void {
    // Filter products based on selected category and price range
    this.filteredProducts$ = this._productService.getProducts().pipe(
      map((products) => {
        return products.filter((product) => {
          // Check if the product matches the selected category (if any)
          const categoryFilter =
            this.selectedCategories.length === 0 || // Display all categories if none selected
            this.selectedCategories.includes(product.categoryID);

          return categoryFilter;
        });
      })
    );
    localStorage.setItem(
      'savedFilters',
      JSON.stringify({
        selectedCategories: this.selectedCategories,
      })
    );
  }
  private fetchCategories() {
    this.categories$ = this._categoryService.getCategories();
  }
  private fetchProducts() {
    this.filteredProducts$ = this._productService.getProducts();
  }
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleParameter(parameter: string) {
    if (this.selectedParameters.includes(parameter)) {
      this.selectedParameters = this.selectedParameters.filter(
        (p) => p !== parameter
      );
    } else {
      this.selectedParameters.push(parameter);
    }
  }
}
