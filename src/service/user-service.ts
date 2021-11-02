import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { IUser } from '../model/i-user';
import { User } from '../model/User';
import { UserRepository } from '../repository/user-repository';

@Service()
export class UserService {

  @InjectRepository()
  private readonly userRepository: UserRepository

  public async findByEmail(email: string): Promise<IUser | null> {
    const user: IUser | undefined = await this.userRepository.findOne({ email });
    if (!user) {
      return null;
    }
    return user;
  }

  public async findByUsername(username: string): Promise<IUser | null> {
    const user: IUser | undefined = await this.userRepository.findOne({ username });
    if (!user) {
      return null;
    }
    return user;
  }

  public async save(userOptions: IUser): Promise<IUser> {
    const user: User = new User(userOptions);
    return this.userRepository.save(user);
  }

  public async isAlreadyInDb(username: string): Promise<boolean> {
    return !!(await this.userRepository.findOne({ username }));
  }

}
