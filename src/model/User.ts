import { IsEmail } from 'class-validator';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IUser } from './i-user';
import { Collection } from './Collection';

@Entity({ name: 'user' })
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

    @Column({ name: 'email', unique: true })
    @IsEmail()
    email: string;

    @OneToMany(() => Collection, collection => collection.user, { nullable: true })
    collections?: Collection[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // @Column({ select: false })
    @Column({ name: 'password' })
    password: string;

    constructor(userOptions?: Omit<IUser, 'id'>) {
        if (userOptions) {
            this.username = userOptions.username;
            this.firstName = userOptions.firstName;
            this.lastName = userOptions.lastName;
            this.age = userOptions.age;
            this.email = userOptions.email;
            this.password = userOptions.password;
            this.createdAt = new Date();
            this.updatedAt = new Date();
        }
    }
}
