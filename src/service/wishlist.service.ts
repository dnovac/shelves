import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import Logger from '../lib/logger';
import { IWishlist } from '../model/interfaces/wishlist';
import { Wishlist } from '../model/Wishlist';
import { WishlistRepository } from '../repository/wishlist.repository';

@Service()
export class WishlistService {

  constructor(
    @InjectRepository()
    private readonly wishlistRepository: WishlistRepository
  ) {
  }

  async listAll(): Promise<IWishlist[]> {
    return await this.wishlistRepository.find();
  }

  async listById(wishlistId: number): Promise<IWishlist | null> {
    const wishlist: Wishlist | undefined = await this.wishlistRepository.findOne(wishlistId);
    if (!wishlist) {
      return null;
      //ToDo: maybe can use await this.repo ?? null (nullish)
    }
    return wishlist;
  }

  async save(wishlistProperties: IWishlist): Promise<IWishlist> {
    try {
      return await this.wishlistRepository.save(wishlistProperties);
    } catch (e) {
      // todo: rather than check the not-null attributes in controller/service
      // create custom exceptions and throw them from here
      // not null; unique; etc
      Logger.error('An error occurred while trying to save an Wishlist.');
      throw new Error('An error occurred while trying to save an Wishlist.');
    }
  }

  async update(id: number, wishlistProperties: IWishlist) {
    return await this.wishlistRepository.update(
      id,
      { ...wishlistProperties },
    );
  }

  async delete(wishlistId: number) {
    return this.wishlistRepository.delete(wishlistId);
  }

}
