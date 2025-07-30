// src/app/features/products/components/product-detail/product-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Models and Services
import { Product } from '../../../../shared/models/product.model';
import { ProductService } from '../../../../core/services/product.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(id);
    } else {
      this.router.navigate(['/products']);
    }
  }

  navigateToProducts() {
    this.router.navigate(['/dashboard/products']);
  }

  loadProduct(id: string): void {
    this.loading = true;
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: () => {
        this.showError('Error al cargar el producto');
        this.router.navigate(['/products']);
      }
    });
  }

  editProduct(): void {
    if (this.product) {
      this.router.navigate(['/dashboard/products', this.product.id, 'edit']);
    }
  }

  deleteProduct(): void {
    if (this.product) {
      if (confirm('¿Estás seguro de eliminar este producto?')) {
        this.productService.deleteProduct(this.product.id!).subscribe({
          next: () => {
            this.snackBar.open('Producto eliminado', 'Cerrar', { duration: 3000 });
            this.router.navigate(['/dashboard/products']);
          },
          error: () => this.showError('Error al eliminar el producto')
        });
      }
    }
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', { 
      duration: 3000, 
      panelClass: ['error-snackbar'] 
    });
  }
}