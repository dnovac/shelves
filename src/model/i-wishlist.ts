import { IItem } from './i-item';
import { IUser } from './i-user';

export interface IWishlist {
    id?: number;
    title: string;
    items?: IItem[];
    user: IUser;
}
