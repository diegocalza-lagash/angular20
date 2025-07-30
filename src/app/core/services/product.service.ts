// src/app/core/services/product.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { Product, ProductForm } from '../../shared/models/product.model';

// In-memory data store
const PRODUCTS_STORAGE_KEY = 'inmemory_products';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [];

  constructor() {
    // Load products from localStorage if available
    const savedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (savedProducts) {
      this.products = JSON.parse(savedProducts);
    } else {
      // Add some sample products if none exist
      this.products = [
        {
          id: '1',
          name: 'Producto de Ejemplo',
          description: 'Este es un producto de ejemplo',
          price: 99.99,
          stock: 10,
          category: 'Electrónica',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      this.saveToLocalStorage();
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(this.products));
  }

  // Obtener todos los productos
  getProducts(): Observable<Product[]> {
    // Simulate API delay
    return of([...this.products]).pipe(delay(300));
  }

  // Obtener un producto por ID
  getProduct(id: string): Observable<Product> {
    const product = this.products.find(p => p.id === id);
    if (product) {
      return of({...product}).pipe(delay(200));
    }
    return throwError(() => new Error('Producto no encontrado'));
  }

  // Crear un nuevo producto
  createProduct(product: ProductForm): Observable<Product> {
    console.log('Creating product with data:', product);
    
    const newProduct: Product = {
      ...product,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.products.push(newProduct);
    this.saveToLocalStorage();
    
    console.log('Product created:', newProduct);
    return of(newProduct).pipe(delay(300));
  }
  /*console.log('Sending to API:', productData);
    
    return new Observable(observer => {
      this.http.post<Product>(this.apiUrl, productData, { 
        observe: 'response' 
      }).subscribe({
        next: (response) => {
          console.log('API Response:', response);
          if (response.body) {
            observer.next(response.body);
          } else {
            observer.error(new Error('Empty response body'));
          }
          observer.complete();
        },
        error: (error) => {
          console.error('API Error:', error);
          observer.error(error);
        }
      });
    }); */

  // Actualizar un producto existente
  updateProduct(id: string, product: Partial<ProductForm>): Observable<Product> {
    const index = this.products.findIndex(p => p.id === id);
    
    if (index === -1) {
      return throwError(() => new Error('Producto no encontrado'));
    }

    const updatedProduct = {
      ...this.products[index],
      ...product,
      updatedAt: new Date().toISOString()
    };

    this.products[index] = updatedProduct;
    this.saveToLocalStorage();
    
    return of(updatedProduct).pipe(delay(300));
  }

  // Eliminar un producto
  deleteProduct(id: string): Observable<void> {
    const index = this.products.findIndex(p => p.id === id);
    
    if (index === -1) {
      return throwError(() => new Error('Producto no encontrado'));
    }

    this.products.splice(index, 1);
    this.saveToLocalStorage();
    
    return of(undefined).pipe(delay(300));
  }
}