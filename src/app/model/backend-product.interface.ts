export interface BackendProduct {
  id: number;
  productName: string;
  productCategory: string;
  productBrand: string;
  productPrice: number;
  offerPrice: number;
  stockQuantity: number;
  productUnit: string;
  productDescription: string;
  productImageUrl: string;
  productStatus: string;
  featured: boolean;
  deliveryAvailable: boolean;
}
