import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'users'})
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({length: 255, name: 'username'}  )
    username: string;
    @Column({length: 255, name: 'first_name'})
    firstName: string;
    @Column({length: 255, name: 'last_name'})
    lastName: string;
    @Column({name: 'age'})
    age: number;
    @Column({length: 255, name: 'email'})
    email: string;


    constructor(id: number, username: string, firstName: string, lastName: string, age: number, email: string) {
        this.id = id;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
        this.email = email;
    }
}