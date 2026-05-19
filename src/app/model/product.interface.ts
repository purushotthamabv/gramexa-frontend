export interface Product {
    id: number;
    name: string;
    category: string;
    description: string;
    image: string;
    price: number;
    oldPrice: number;
    badge?: string;
    stock?: number;
}