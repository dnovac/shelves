import { IItem } from './item';

export interface IWishlist {
    id?: number;
    title: string;
    items: IItem[];
}