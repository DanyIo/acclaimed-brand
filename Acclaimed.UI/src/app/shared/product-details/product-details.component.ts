import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/products';
import { MatButtonModule } from '@angular/material/button';
import { NgFor } from '@angular/common';
import { NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [NgFor, MatButtonModule, NgSwitch, NgSwitchCase, NgSwitchDefault],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent {
  productId!: number;
  currentProduct!: Product;

  constructor(
    private route: ActivatedRoute,
    private _productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.productId = Number(params.get('id'));
    });
    this.fetchProduct(this.productId);
  }
  fetchProduct(productId: number) {
    this._productService
      .getProductById(productId)
      .subscribe((product: Product) => {
        this.currentProduct = product;
        console.log(this.currentProduct);
      });
  }
}
