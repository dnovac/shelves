import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Wishlist } from './Wishlist';

@Entity({ name: 'items' })
export class Item {

    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column({ length: 255, name: 'title' })
    title: string;

    @Column({ type: 'text', name: 'url', nullable: true})
    url: string;

    @Column({ type: 'text', name: 'image_url', nullable: true})
    imageUrl: string;

    @ManyToOne(() => Wishlist, wishlist => wishlist.items)
    wishlist: Wishlist;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    constructor(title: string, url: string, imageUrl: string) {
        this.title = title;
        this.url = url;
        this.imageUrl = imageUrl;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}