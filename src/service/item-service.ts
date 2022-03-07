import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { IItem } from '../model/i-item';
import { ItemRepository } from '../repository/item-repository';
import logger from "../config/logger";
import { DeleteResult, UpdateResult } from 'typeorm';
import { WishlistRepository } from '../repository/wishlist-repository';

@Service()
export class ItemService {

  constructor(
    @InjectRepository()
    private readonly itemRepository: ItemRepository,
    @InjectRepository()
    private readonly wishlistRepository: WishlistRepository
  ) {
  }

  public async findAll(): Promise<IItem[]> {
    return this.itemRepository.find({
      relations: ['wishlist']
    });
  }

  public async findById(itemId: number): Promise<IItem | undefined> {
    return this.itemRepository.findOne(itemId, {
      relations: ['wishlist']
    });
  }

  public async save(itemOptions: IItem): Promise<IItem> {
    const wishlistId = itemOptions.wishlist?.id;
    let foundWishlist;
    if (wishlistId) {
      foundWishlist = await this.wishlistRepository.findOne({
        id: wishlistId,
      });
    }

    // An item must have a wishlist
    // Because each wishlist must be of an user and all items/wishlists are contexts of an user
    if (!foundWishlist) {
      throw new Error('Wishlist not found in the database! An item must have a wishlist as parent.')
    }

    try {
      return this.itemRepository.save({
        ...itemOptions,
        wishlist: foundWishlist,
      });
    } catch (err) {
      logger.error(`Error while saving item: ${err}`)
      throw new Error(`Error while saving item: ${err}`)
    }
  }

  public async update(itemId: number, item: IItem): Promise<UpdateResult> {
    try {
      return await this.itemRepository.update(
        itemId,
        {
          ...item,
        }
      );
    } catch (err) {
      logger.error(`Error while updating item: ${err}`)
      throw new Error(`Error while updating item: ${err}`)
    }
  }

  public async delete(itemId: number): Promise<DeleteResult> {
    const foundItem = await this.itemRepository.findOne(itemId);
    if (!foundItem) {
      throw new Error(`Item with id ${itemId} was not found!`);
    }
    return this.itemRepository.delete(itemId);
  }
}
