import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Wishlist } from './Wishlist';

@Entity({ name: 'users' })
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255, name: 'username' })
    username: string;

    @Column({ length: 255, name: 'first_name', nullable: true })
    firstName: string;

    @Column({ length: 255, name: 'last_name', nullable: true })
    lastName: string;

    @Column({ name: 'age' })
    age: number;

    @Column({ length: 255, name: 'email' })
    email: string;

    @OneToMany(() => Wishlist, wishlist => wishlist.user)
    wishlists: Wishlist[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;


    constructor(username: string, firstName: string, lastName: string, age: number, email: string) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
        this.email = email;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}