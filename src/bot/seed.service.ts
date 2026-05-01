import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductCategory } from './schemas/product.schema';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(@InjectModel(Product.name) private readonly productModel: Model<Product>) {}

  async onModuleInit() {
    const count = await this.productModel.countDocuments();
    if (count > 0) return;

    const seed: Array<Pick<Product, 'name' | 'price' | 'category' | 'ingredients' | 'imageUrl' | 'isActive'>> = [
      {
        name: 'Coca-Cola 0.5L',
        price: 8000,
        category: 'ICHIMLIK' as ProductCategory,
        ingredients: 'Gazlangan ichimlik',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_0.5L_bottle.png',
        isActive: true,
      },
      {
        name: 'Fanta 0.5L',
        price: 8000,
        category: 'ICHIMLIK' as ProductCategory,
        ingredients: 'Apelsin ta’mi, gazlangan',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Fanta_Orange_-_500ml.jpg',
        isActive: true,
      },
      {
        name: 'Lavash',
        price: 28000,
        category: 'YEGULIK' as ProductCategory,
        ingredients: 'Tovuq go‘shti, sabzavot, sous, lavash non',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Shawarma_2019.jpg',
        isActive: true,
      },
      {
        name: 'Burger',
        price: 26000,
        category: 'YEGULIK' as ProductCategory,
        ingredients: 'Kotlet, pishloq, pomidor, salat bargi, sous, bulochka',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/RedDot_Burger.jpg',
        isActive: true,
      },
      {
        name: 'Cheesecake',
        price: 22000,
        category: 'SHIRINLIK' as ProductCategory,
        ingredients: 'Pishloqli krem, pechenye asos',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Cheesecake_with_raspberries.jpg',
        isActive: true,
      },
    ];

    try {
      await this.productModel.insertMany(seed, { ordered: false });
      this.logger.log('Seed products inserted.');
    } catch (e) {
      this.logger.warn(`Seed insert skipped/partial: ${(e as Error).message}`);
    }
  }
}

