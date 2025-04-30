import { Characteristic } from "./characteristic";

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
    category?: string;
    isActive: boolean;
    stock: number;
    characteristics?: Characteristic[];
    slug?: string;
}