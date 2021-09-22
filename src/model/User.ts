import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IUser } from './interfaces/user';
import { Wishlist } from './Wishlist';

@Entity({ name: 'users' })
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255, name: 'username', unique: true })
    username: string;

    @Column({ length: 255, name: 'first_name', nullable: true })
    firstName?: string;

    @Column({ length: 255, name: 'last_name', nullable: true })
    lastName?: string;

    @Column({ name: 'age', nullable: true })
    age?: number;

    @Column({ name: 'email' })
    email: string;

    @OneToMany(() => Wishlist, wishlist => wishlist.user, { nullable: true })
    wishlists?: Wishlist[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Column({ nullable: true })
    token?: string;

    @Column()
    password: string;

    constructor(userOptions?: IUser) {
        if (userOptions) {
            this.username = userOptions.username;
            this.firstName = userOptions.firstName;
            this.lastName = userOptions.lastName;
            this.age = userOptions.age;
            this.email = userOptions.email;
            this.password = userOptions.password;
            this.token = userOptions.token;
            this.createdAt = new Date();
            this.updatedAt = new Date();
        }
    }
}