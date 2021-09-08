import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Wishlist } from '../models/Wishlist';
import { WishlistRepository } from '../repository/wishlist.repository';

@Service()
export class WishlistService {

    constructor(
        @InjectRepository()
        private readonly wishlistRepository: WishlistRepository
    ) {
    }

    async listAll(): Promise<Wishlist[]> {
        return await this.wishlistRepository.find();
    }

    public listById = () => {
        return "byid from service";
    }

    async add(): Promise<Wishlist> {
        return this.wishlistRepository.create();
    }

    public update = () => {
        return "update from service";
    }

    public delete = () => {
        return "delete from service";
    }


}