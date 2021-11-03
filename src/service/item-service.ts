import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { IItem } from '../model/i-item';
import { ItemRepository } from '../repository/item-repository';
import logger from "../config/logger";
import { DeleteResult, UpdateResult } from 'typeorm';

@Service()
export class ItemService {

  constructor(
    @InjectRepository()
    private readonly itemRepository: ItemRepository
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

  public save(itemOptions: IItem): Promise<IItem> {
    try {
      return this.itemRepository.save(itemOptions);
    } catch (err) {
      logger.error(`Error while saving item: ${err}`)
      throw new Error(`Error while saving item: ${err}`)
      // todo: catch it in controller | throw new Error(`Error while saving item: ${err}`);
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
      // todo: catch it in controller | throw new Error(`Error while updating item: ${err}`);
    }
  }

  public async delete(itemId: number): Promise<DeleteResult> {
    return this.itemRepository.delete(itemId);
  }
}
