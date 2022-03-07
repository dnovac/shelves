import { Service } from 'typedi';
import { EntityRepository, Repository } from 'typeorm';
import { Collection } from '../model/Collection';

@Service()
@EntityRepository(Collection)
export class CollectionRepository extends Repository<Collection>{

}
