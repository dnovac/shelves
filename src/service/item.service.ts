import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { IItem } from '../model/interfaces/item';
import { ItemRepository } from '../repository/item.repository';

@Service()
export class ItemService {

    constructor(
        @InjectRepository()
        private readonly itemRepository: ItemRepository
    ) {
    }

    async listAll(): Promise<IItem[]> {
        return await this.itemRepository.find();
    }

    async listById(itemId: number): Promise<IItem | null> {
        const itemFromDb: IItem | undefined = await this.itemRepository.findOne(itemId);
        if(!itemFromDb) {
            return null;
        }
        return itemFromDb;
    }

    async save(itemOptions: IItem): Promise<IItem> {
        return await this.itemRepository.save(itemOptions);
    }

    async update(itemId: number, item: IItem) {
        return await this.itemRepository.update(
            itemId,
            {
                ...item
            }
        );
    }

    async delete(itemId: number) {
        return this.itemRepository.delete(itemId);
    }
}
