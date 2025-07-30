// src/app/features/products/products.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';

import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ProductService } from './../../core/services/product.service';
import { ProductDetailComponent } from './../../features/products/components/product-detail/product-detail.component';
import { ConfirmDialogComponent } from './../../shared/components/confirm-dialog/confirm-dialog.component'

// Configuración de rutas para el módulo de productos
export const PRODUCTS_ROUTES: Routes = [
  { 
    path: '', 
    component: ProductListComponent,
    title: 'Productos - Listado'
  },
  { 
    path: 'new', 
    component: ProductFormComponent,
    title: 'Nuevo Producto'
  },
  { 
    path: ':id', 
    component: ProductDetailComponent,
    title: 'Detalle del Producto'
  },
  { 
    path: ':id/edit', 
    component: ProductFormComponent,
    title: 'Editar Producto'
  }
];

@NgModule({
  // Los componentes standalone no van en declarations
  declarations: [],
  imports: [
    // Módulos de Angular y Material
    CommonModule,
    RouterModule.forChild(PRODUCTS_ROUTES),
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatDialogModule,
    MatSelectModule,
    
    // Componentes standalone
    ProductListComponent,
    ProductFormComponent,
    ProductDetailComponent,
    ConfirmDialogComponent
  ],
  providers: [ProductService]
})
export class ProductsModule { }