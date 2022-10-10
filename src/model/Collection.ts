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

@Entity({ name: 'collection' })
export class Collection {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, name: 'title' })
  title: string;

  @Column({ type: 'text', name: 'description', nullable: true })
  description?: string;

  @OneToMany(() => Item, item => item.collection, { nullable: true})
  items?: Item[];

  @ManyToOne(() => User, user => user.collections, { nullable: false })
  @Exclude()
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

}
