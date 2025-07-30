// src/app/shared/models/product.model.ts
export interface Product {
    id?: string;           // Identificador único (opcional para creaciones)
    name: string;          // Nombre del producto
    description: string;   // Descripción detallada
    price: number;         // Precio unitario
    stock: number;         // Cantidad en inventario
    category: string;      // Categoría del producto
    createdAt?: string;    // Fecha de creación en formato ISO string
    updatedAt?: string;    // Fecha de última actualización en formato ISO string
}

// Tipo para el formulario de producto
export type ProductForm = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;