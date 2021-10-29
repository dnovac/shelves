import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import Logger from '../lib/logger';
import { IWishlist } from '../model/i-wishlist';
import { WishlistRepository } from '../repository/wishlist-repository';
import { DeleteResult, UpdateResult } from 'typeorm';

@Service()
export class WishlistService {

  constructor(
    @InjectRepository()
    private readonly wishlistRepository: WishlistRepository
  ) {
  }

  async findAll(): Promise<IWishlist[]> {
    return this.wishlistRepository.find({
      relations: ['items']
    });
  }

  async findById(wishlistId: number): Promise<IWishlist | null> {
    return await this.wishlistRepository.findOne(wishlistId, {
      relations: ['items']
    }) ?? null;
  }

  public async findByUsername(username: string): Promise<IWishlist[] | null> {
    return this.wishlistRepository.createQueryBuilder('wishlist')
      .leftJoin('wishlist.user', 'user')
      .where('user.username = :username', { username })
      .innerJoinAndSelect('wishlist.items', 'items')
      .getMany();
  }


  public async save(wishlistProperties: IWishlist): Promise<IWishlist> {
    try {
      return this.wishlistRepository.save(wishlistProperties);
    } catch (e) {
      // todo: rather than check the not-null attributes in controller/service
      // create custom exceptions and throw them from here
      // not null; unique; etc
      Logger.error('An error occurred while trying to save an Wishlist.');
      throw new Error('An error occurred while trying to save an Wishlist.');
    }
  }

  public async update(id: number, wishlistProperties: IWishlist): Promise<UpdateResult> {
    return this.wishlistRepository.update(
      id,
      { ...wishlistProperties }
    );
  }

  public async delete(wishlistId: number): Promise<DeleteResult> {
    return this.wishlistRepository.delete(wishlistId);
  }

}