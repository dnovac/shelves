import { Service } from 'typedi';
import { EntityRepository, Repository } from 'typeorm';
import { Wishlist } from '../model/Wishlist';

@Service()
@EntityRepository(Wishlist)
export class WishlistRepository extends Repository<Wishlist>{

}