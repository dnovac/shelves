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

    async listById(wishlistId: number): Promise<Wishlist | undefined> {
        return await this.wishlistRepository.findOne(wishlistId)
    }

    async add(wishlistTitle: string): Promise<Wishlist> {
        const wishlist: Wishlist = this.wishlistRepository.create();
        wishlist.title = wishlistTitle;
        return await this.wishlistRepository.save(wishlist);
    }

    async update(wishlistId: number, wishlistTitle: string) {
        return await this.wishlistRepository.update(
            wishlistId,
            { title: wishlistTitle }
        );
    }

    async delete(wishlistId: number) {
        return this.wishlistRepository.delete(wishlistId);
    }


}