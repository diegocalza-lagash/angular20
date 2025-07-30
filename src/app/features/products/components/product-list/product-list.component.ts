// src/app/features/products/components/product-list/product-list.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Models and Services
import { Product } from '../../../../shared/models/product.model';
import { ProductService } from '../../../../core/services/product.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
    RouterModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatSortModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  products: Product[] = [];
  filteredProducts: Product[] = [];
  displayedColumns: string[] = ['name', 'category', 'price', 'stock', 'status', 'actions'];
  
  // Filtros
  searchTerm: string = '';
  selectedCategory: string = '';
  categories: string[] = [];
  
  // Paginación
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25, 100];
  totalItems = 0;
  
  // Estado
  isLoading = true;

  constructor(
    private productService: ProductService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.categories = this.getUniqueCategories(products);
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.snackBar.open('Error al cargar los productos', 'Cerrar', {
          duration: 3000
        });
        this.isLoading = false;
      }
    });
  }
  
  getUniqueCategories(products: Product[]): string[] {
    const categories = new Set<string>();
    products.forEach(product => {
      if (product.category) {
        categories.add(product.category);
      }
    });
    return Array.from(categories).sort();
  }
  
  applyFilters(): void {
    let result = [...this.products];
    
    // Filtrar por término de búsqueda
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(term) ||
        (product.description && product.description.toLowerCase().includes(term))
      );
    }
    
    // Filtrar por categoría
    if (this.selectedCategory) {
      result = result.filter(product => product.category === this.selectedCategory);
    }
    
    // Ordenar
    if (this.sort && this.sort.active) {
      result = this.sortData(result);
    }
    
    // Actualizar el total de items
    this.totalItems = result.length;
    
    // Aplicar paginación
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredProducts = result.slice(startIndex, endIndex);
  }
  
  sortData(data: Product[]): Product[] {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'name': return this.compare(a.name, b.name, isAsc);
        case 'category': return this.compare(a.category, b.category, isAsc);
        case 'price': return this.compare(a.price, b.price, isAsc);
        case 'stock': return this.compare(a.stock, b.stock, isAsc);
        default: return 0;
      }
    });
  }
  
  compare(a: any, b: any, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.applyFilters(); // Vuelve a aplicar los filtros cuando cambia la página
  }
  
  onSearchChange(): void {
    this.applyFilters();
  }
  
  onCategoryChange(): void {
    this.applyFilters();
  }
  
  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.applyFilters();
  }
  
  getStatusClass(stock: number): string {
    if (stock === 0) return 'out-of-stock';
    if (stock <= 5) return 'low-stock';
    return 'in-stock';
  }
  
  getStatusText(stock: number): string {
    if (stock === 0) return 'Agotado';
    if (stock <= 5) return 'Poco stock';
    return 'Disponible';
  }

  navigateToNewProduct() {
    this.router.navigate(['/dashboard/products/new']);
  }

  editProduct(id: string): void {
    this.router.navigate(['/dashboard/products', id, 'edit']);
  }

  viewProduct(id: string): void {
    this.router.navigate(['/dashboard/products', id]);
  }

  deleteProduct(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Eliminar Producto', message: '¿Estás seguro de eliminar este producto?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.deleteProduct(id).subscribe({
          next: () => {
            this.snackBar.open('Producto eliminado', 'Cerrar', { duration: 3000 });
            this.loadProducts();
          },
          error: () => this.showError('Error al eliminar el producto')
        });
      }
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 3000, panelClass: ['error-snackbar'] });
  }
}