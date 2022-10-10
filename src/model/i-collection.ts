import { IItem } from './i-item';
import { IUser } from './i-user';

export interface ICollection {
    id?: number;
    title: string;
    description?: string;
    items?: IItem[];
    user: IUser;
}
