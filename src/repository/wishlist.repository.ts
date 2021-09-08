import { Service } from 'typedi';
import { EntityRepository, Repository } from 'typeorm';
import { Wishlist } from '../models/Wishlist';

@Service()
@EntityRepository(Wishlist)
export class WishlistRepository extends Repository<Wishlist>{

}