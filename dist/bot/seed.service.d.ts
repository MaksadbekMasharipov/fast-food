import { OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
export declare class SeedService implements OnModuleInit {
    private readonly productModel;
    private readonly logger;
    constructor(productModel: Model<Product>);
    onModuleInit(): Promise<void>;
}
