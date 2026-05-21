import { Component, OnInit } from '@angular/core';
import { Product } from '../../../model/product.interface';
import { ProductsComponent } from '../products/products.component';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  editorProducts: Product[] = [];
  healthProducts: Product[] = [];

  constructor(private productService: ProductService) {

  }

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.editorProducts = products.slice(0, 4);
        this.healthProducts = products
          .filter((product) =>
            ['MEDICINE', 'HEALTHCARE', 'NUTRITION'].includes(product.category)
          )
          .slice(0, 4);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
