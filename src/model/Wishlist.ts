import { Exclude } from 'class-transformer';
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

@Entity({ name: 'wishlist' })
export class Wishlist {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, name: 'title' })
  title: string;

  @OneToMany(() => Item, item => item.wishlist, { nullable: true})
  items?: Item[];

  @ManyToOne(() => User, user => user.wishlists, { nullable: false })
  @Exclude()
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

}
