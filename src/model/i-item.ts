import { ICollection } from './i-collection';

export interface IItem {
    id?: number;
    title: string;
    url?: string;
    imageUrl?: string;
    collection?: ICollection;
}
