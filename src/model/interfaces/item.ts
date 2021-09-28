import { IWishlist } from './wishlist';

export interface IItem {

    id?: number;
    title: string;
    url?: string;
    imageUrl?: string;
    wishlist?: IWishlist;
}