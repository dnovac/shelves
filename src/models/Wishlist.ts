import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { Item } from './Item';
import { User } from './User';

@Entity({ name: 'wishlists' })
export class Wishlist {

    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column({ length: 255, name: 'title' })
    title: string;

    @OneToMany(() => Item, item => item.wishlist)
    items: Item[];

    @ManyToOne(() => User, user => user.wishlists)
    user: User;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;


    constructor(title: string) {
        this.title = title;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}