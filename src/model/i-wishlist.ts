import { IItem } from './i-item';

export interface IWishlist {
    id?: number;
    title: string;
    items: IItem[];
}
