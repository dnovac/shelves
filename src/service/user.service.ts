import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { IUser } from '../model/interfaces/user';
import { User } from '../model/User';
import { UserRepository } from '../repository/user.repository';

@Service()
export class UserService {

    @InjectRepository()
    private readonly userRepository: UserRepository

    constructor() {
        //no-empty
    }

    //ToDo: map everything to User interface

    public async listByEmail(email: string): Promise<any> {
        return await this.userRepository.findOne({ email });
    }

    public async listByUsername(username: string): Promise<any> {
        return await this.userRepository.findOne({ username });
    }

    public async save(userOptions: IUser): Promise<any> {
        const user: User = new User(userOptions);
        return await this.userRepository.save(user);
    }

    public async isAlreadyInDb(username: string): Promise<boolean> {
        return !!(await this.userRepository.findOne({ username }));
    }

}