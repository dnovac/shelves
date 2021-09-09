import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Item } from '../models/Item';
import { ItemRepository } from '../repository/item.repository';

@Service()
export class ItemService {

    constructor(
        @InjectRepository()
        private readonly itemRepository: ItemRepository
    ) {
    }

    async listAll(): Promise<Item[]> {
        return await this.itemRepository.find();
    }

    async listById(itemId: number): Promise<Item | undefined> {
        return await this.itemRepository.findOne(itemId);
    }

    async add(item: Item): Promise<Item> {
        return await this.itemRepository.save(item)
    }

    async update(itemId: number, item: Item) {
        return await this.itemRepository.update(
            itemId,
            item
        );
    }

    async delete(itemId: number) {
        return this.itemRepository.delete(itemId);
    }
}