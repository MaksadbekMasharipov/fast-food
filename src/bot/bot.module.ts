import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { BotUpdate } from './bot.update';
import { User, UserSchema } from './schemas/user.schema';
import { Product, ProductSchema } from './schemas/product.schema';
import { Order, OrderSchema } from './schemas/order.schema';
import { SeedService } from './seed.service';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        token: (() => {
          const token = (config.get<string>('BOT_TOKEN') ?? '').trim();
          // Basic sanity check to fail fast with clear message
          if (!/^\d+:[A-Za-z0-9_-]+$/.test(token)) {
            throw new Error(
              'BOT_TOKEN noto‘g‘ri ko‘rinishda. .env ichida BOT_TOKEN ni tekshiring (BotFather bergan token bo‘lishi kerak).',
            );
          }
          return token;
        })(),
      }),
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
  ],
  providers: [BotUpdate, SeedService],
})
export class BotModule {}

