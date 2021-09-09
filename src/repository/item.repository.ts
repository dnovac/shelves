import { Service } from 'typedi';
import { EntityRepository, Repository } from 'typeorm';
import { Item } from '../models/Item';

@Service()
@EntityRepository(Item)
export class ItemRepository extends Repository<Item> {

}