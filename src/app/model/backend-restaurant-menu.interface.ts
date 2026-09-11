export interface BackendRestaurantMenu {
  restaurantId: string;
  restaurantName: string;
  currency: string;
  imageUrl?: string;
  products: BackendRestaurantMenuItem[];
}

export interface BackendRestaurantMenuItem {
  id: number;
  productId: string;
  name: string;
  category: string;
  price: number;
  isVegetarian: boolean;
  isAvailable: boolean;
  imageUrl: string;
  offerPrice?: number;
  discountPercentage?: number;
}
