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

    public async listByEmail(email: string): Promise<IUser | null> {
        const user: IUser | undefined = await this.userRepository.findOne({ email });
        if(!user) {
            return null;
        }
        return user;
    }

    public async listByUsername(username: string): Promise<IUser | null> {
        const user: IUser | undefined = await this.userRepository.findOne({ username });
        if(!user) {
            return null;
        }
        return user;
    }

    public async save(userOptions: IUser): Promise<IUser> {
        const user: User = new User(userOptions);
        return await this.userRepository.save(user);
    }

    public async isAlreadyInDb(username: string): Promise<boolean> {
        return !!(await this.userRepository.findOne({ username }));
    }

}