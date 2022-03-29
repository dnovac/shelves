import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { IItem } from '../model/i-item';
import { ItemRepository } from '../repository/item-repository';
import logger from "../config/logger";
import { DeleteResult, UpdateResult } from 'typeorm';
import { CollectionRepository } from '../repository/collection-repository';

@Service()
export class ItemService {

  constructor(
    @InjectRepository()
    private readonly itemRepository: ItemRepository,
    @InjectRepository()
    private readonly collectionRepository: CollectionRepository
  ) {
  }

  public async findAll(): Promise<IItem[]> {
    return this.itemRepository.find({
      relations: ['collection']
    });
  }

  public async findById(itemId: number): Promise<IItem | undefined> {
    return this.itemRepository.findOne(itemId, {
      relations: ['collection']
    });
  }

  public async findByCollectionId(collectionId: number): Promise<IItem[] | undefined> {
    return this.itemRepository.createQueryBuilder('items')
      .leftJoin('items.collection', 'collection')
      .where('collection.id = :collectionId', { collectionId })
      .getMany();
  }

  public async save(itemOptions: IItem): Promise<IItem> {
    const collectionId = itemOptions.collection?.id;
    let foundCollection;
    if (collectionId) {
      foundCollection = await this.collectionRepository.findOne({
        id: collectionId,
      });
    }

    // An item must have a collection as parent
    // Because each collection must be child an user and all items/collections are contexts of an user
    if (!foundCollection) {
      throw new Error('Collection not found in the database! An item must have a collection as parent.')
    }

    try {
      return this.itemRepository.save({
        ...itemOptions,
        collection: foundCollection,
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
