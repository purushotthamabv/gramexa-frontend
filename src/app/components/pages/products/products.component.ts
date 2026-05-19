import {
  Component,
  Input
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Product } from '../../../model/product.interface';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {

  @Input()
  title = '';

  @Input()
  subTitle = '';

  @Input()
  products: Product[] = [];
}