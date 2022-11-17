export interface RestaurantDataObject {
    id: number;
    email: string;
    restaurantName: string;
    description: string;
    image?: string;
    menu?: Menu;
    address?: Address;
}

export interface Menu {
    id: number;
    categories?: string[];
}

export interface Address {
    id: number;
    restaurantId: number;
    streetName: string;
    houseNumber: number;
    zipCode: number;
    city: string;
    floor?: number;
}
