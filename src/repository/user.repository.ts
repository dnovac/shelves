import { Service } from 'typedi';
import { EntityRepository, Repository } from 'typeorm';
import { User } from '../model/User';

@Service()
@EntityRepository(User)
export class UserRepository extends Repository<User> {

}