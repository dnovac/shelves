import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { IItem } from '../model/i-item';
import { ItemRepository } from '../repository/item.repository';
import Logger from "../lib/logger";

@Service()
export class ItemService {

    constructor(
        @InjectRepository()
        private readonly itemRepository: ItemRepository
    ) {
    }

    async findAll(): Promise<IItem[]> {
        return await this.itemRepository.find({
            relations: ['wishlist']
        });
    }

    async findById(itemId: number): Promise<IItem | null> {
        return await this.itemRepository.findOne(itemId, {
            relations: ['wishlist']
        }) ?? null;
    }

    async save(itemOptions: IItem): Promise<IItem | null> {
        try {
            return await this.itemRepository.save(itemOptions);
        } catch (err) {
            Logger.error(`Error while saving item: ${err}`)
            return null;
            // todo: catch it in controller | throw new Error(`Error while saving item: ${err}`);
        }
    }

    async update(itemId: number, item: IItem) {

        try {
            return await this.itemRepository.update(
              itemId,
              {
                  ...item,
              }
            );
        } catch (err) {
            Logger.error(`Error while updating item: ${err}`)
            return null;
            // todo: catch it in controller | throw new Error(`Error while updating item: ${err}`);
        }
    }

    async delete(itemId: number) {
        return this.itemRepository.delete(itemId);
    }
}
