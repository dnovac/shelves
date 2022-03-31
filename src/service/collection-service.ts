import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import logger from '../config/logger';
import { ICollection } from '../model/i-collection';
import { CollectionRepository } from '../repository/collection-repository';
import { DeleteResult, UpdateResult } from 'typeorm';

@Service()
export class CollectionService {

  constructor(
    @InjectRepository()
    private readonly collectionRepository: CollectionRepository
  ) {
  }

  async findAll(): Promise<ICollection[]> {
    return this.collectionRepository.find({
      relations: ['items']
    });
  }

  async findById(collectionId: number): Promise<ICollection | undefined> {
    return this.collectionRepository.findOne(collectionId, {
      relations: ['items']
    });
  }

  public async findByUserId(userId: number): Promise<ICollection[] | undefined> {
    return this.collectionRepository.createQueryBuilder('collection')
      .leftJoin('collection.user', 'user')
      .leftJoinAndSelect('collection.items', 'items')
      .where('user.id = :userId', { userId })
      .getMany();
  }


  public async save(collectionProperties: ICollection): Promise<ICollection> {
    try {
      return this.collectionRepository.save(collectionProperties);
    } catch (e) {
      // todo: rather than check the not-null attributes in controller/service
      // create custom exceptions and throw them from here
      // not null; unique; etc
      logger.error('An error occurred while trying to save an Collection.');
      throw new Error('An error occurred while trying to save an Collection.');
    }
  }

  public async update(id: number, collectionProps: ICollection): Promise<UpdateResult> {
    return this.collectionRepository.update(
      id,
      { ...collectionProps }
    );
  }

  public async delete(collectionId: number): Promise<DeleteResult> {
    return this.collectionRepository.delete(collectionId);
  }

}
