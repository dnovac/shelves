import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Collection } from './Collection';

@Entity({ name: 'item' })
export class Item {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, name: 'title' })
  title: string;

  @Column({ type: 'text', name: 'url', nullable: true })
  url: string;

  @Column({ type: 'text', name: 'image_url', nullable: true })
  imageUrl: string;

  @ManyToOne(() => Collection, collection => collection.items,
    { nullable: false, cascade: true, onDelete: 'CASCADE' })
  collection: Collection;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  constructor(title: string, url: string, imageUrl: string, collection: Collection) {
    this.title = title;
    this.url = url;
    this.imageUrl = imageUrl;
    this.collection = collection;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
