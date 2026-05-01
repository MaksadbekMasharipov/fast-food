import { InjectModel } from '@nestjs/mongoose';
import { Action, Command, Ctx, On, Start, Update } from 'nestjs-telegraf';
import type { Context } from 'telegraf';
import { Model } from 'mongoose';
import { TEXT, categoriesKeyboard, orderInlineKeyboard, productsKeyboard, requestLocationKeyboard, requestPhoneKeyboard } from './keyboards';
import { User } from './schemas/user.schema';
import { Product, ProductCategory } from './schemas/product.schema';
import { Order } from './schemas/order.schema';

type BotCtx = Context;

const CATEGORY_BY_TEXT: Record<string, ProductCategory> = {
  [TEXT.drinks]: 'ICHIMLIK',
  [TEXT.foods]: 'YEGULIK',
  [TEXT.sweets]: 'SHIRINLIK',
};

function getTelegramName(ctx: BotCtx) {
  const from = ctx.from;
  return {
    firstName: from?.first_name,
    lastName: from?.last_name,
    username: from?.username,
  };
}

@Update()
export class BotUpdate {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
  ) {}

  private async upsertUser(ctx: BotCtx) {
    const telegramId = ctx.from?.id;
    if (!telegramId) return null;

    const name = getTelegramName(ctx);
    return this.userModel.findOneAndUpdate(
      { telegramId },
      { $set: { telegramId, ...name } },
      { new: true, upsert: true },
    );
  }

  private async ensureProfileFlow(ctx: BotCtx) {
    const user = await this.upsertUser(ctx);
    if (!user) return { ok: false as const };

    if (!user.phoneNumber) {
      await ctx.reply(TEXT.askPhone, requestPhoneKeyboard());
      return { ok: false as const };
    }

    if (!user.location) {
      await ctx.reply(TEXT.askLocation, requestLocationKeyboard());
      return { ok: false as const };
    }

    return { ok: true as const, user };
  }

  @Start()
  async start(@Ctx() ctx: BotCtx) {
    const flow = await this.ensureProfileFlow(ctx);
    if (!flow.ok) return;

    await ctx.reply(TEXT.okReady, categoriesKeyboard());
  }

  @Command('start')
  async startCmd(@Ctx() ctx: BotCtx) {
    return this.start(ctx);
  }

  @Command('menu')
  async menu(@Ctx() ctx: BotCtx) {
    const flow = await this.ensureProfileFlow(ctx);
    if (!flow.ok) return;
    await ctx.reply(TEXT.categoriesTitle, categoriesKeyboard());
  }

  @On('contact')
  async onContact(@Ctx() ctx: BotCtx) {
    const telegramId = ctx.from?.id;
    const contact = (ctx.message as any)?.contact as { phone_number?: string; user_id?: number } | undefined;

    if (!telegramId) return;
    const phoneNumber = contact?.phone_number;
    if (!phoneNumber) return;

    await this.userModel.updateOne({ telegramId }, { $set: { phoneNumber } }, { upsert: true });

    const user = await this.userModel.findOne({ telegramId });
    if (!user?.location) {
      await ctx.reply(TEXT.askLocation, requestLocationKeyboard());
      return;
    }

    await ctx.reply(TEXT.okReady, categoriesKeyboard());
  }

  @On('location')
  async onLocation(@Ctx() ctx: BotCtx) {
    const telegramId = ctx.from?.id;
    const loc = (ctx.message as any)?.location as { latitude: number; longitude: number } | undefined;
    if (!telegramId || !loc) return;

    await this.userModel.updateOne({ telegramId }, { $set: { location: loc } }, { upsert: true });

    const user = await this.userModel.findOne({ telegramId });
    if (!user?.phoneNumber) {
      await ctx.reply(TEXT.askPhone, requestPhoneKeyboard());
      return;
    }

    await ctx.reply(TEXT.okReady, categoriesKeyboard());
  }

  @On('text')
  async onText(@Ctx() ctx: BotCtx) {
    const text = (ctx.message as any)?.text as string | undefined;
    if (!text) return;

    if (text === TEXT.cancel) {
      await ctx.reply(TEXT.categoriesTitle, categoriesKeyboard());
      return;
    }

    // Back to categories
    if (text === TEXT.back) {
      const flow = await this.ensureProfileFlow(ctx);
      if (!flow.ok) return;
      await ctx.reply(TEXT.categoriesTitle, categoriesKeyboard());
      return;
    }

    // Category clicked
    const cat = CATEGORY_BY_TEXT[text];
    if (cat) {
      const flow = await this.ensureProfileFlow(ctx);
      if (!flow.ok) return;

      const products = await this.productModel
        .find({ category: cat, isActive: true })
        .select({ name: 1 })
        .sort({ name: 1 })
        .lean();

      if (products.length === 0) {
        await ctx.reply("Hozircha mahsulot yo‘q.", categoriesKeyboard());
        return;
      }

      await ctx.reply(TEXT.chooseProduct, productsKeyboard(products as any));
      return;
    }

    // If user didn't send contact, treat text as phone number if missing
    const telegramId = ctx.from?.id;
    if (telegramId) {
      const user = await this.userModel.findOne({ telegramId }).lean();
      if (user && !user.phoneNumber) {
        const maybePhone = text.replace(/[^\d+]/g, '').trim();
        if (maybePhone.length >= 9) {
          await this.userModel.updateOne({ telegramId }, { $set: { phoneNumber: maybePhone } }, { upsert: true });
          await ctx.reply(TEXT.askLocation, requestLocationKeyboard());
          return;
        }
      }
    }

    // Product clicked by name
    const product = await this.productModel.findOne({ name: text, isActive: true }).lean();
    if (!product) return;

    const captionLines = [
      `🍽 ${product.name}`,
      `💰 Narxi: ${product.price.toLocaleString('uz-UZ')} so‘m`,
      product.ingredients ? `🧾 Tarkibi: ${product.ingredients}` : undefined,
    ].filter(Boolean);

    const caption = captionLines.join('\n');
    const kb = orderInlineKeyboard(String(product._id));

    if (product.imageUrl) {
      await ctx.replyWithPhoto(product.imageUrl, { caption, ...kb });
    } else {
      await ctx.reply(caption, kb);
    }
  }

  @Action(/^order:(.+)$/)
  async order(@Ctx() ctx: any) {
    const telegramId = ctx.from?.id as number | undefined;
    const productId = String(ctx.match?.[1] ?? '');
    if (!telegramId || !productId) return;

    const user = await this.userModel.findOne({ telegramId });
    if (!user) {
      await ctx.reply('Iltimos /start bosing.');
      return;
    }

    const product = await this.productModel.findById(productId).lean();
    if (!product) {
      await ctx.reply('Mahsulot topilmadi.');
      return;
    }

    await this.orderModel.create({
      userId: user._id,
      productId: product._id,
      quantity: 1,
      status: 'NEW',
    });

    await ctx.answerCbQuery('Buyurtma qabul qilindi');
    await ctx.reply(`✅ Buyurtma qabul qilindi: ${product.name}\nTelefon: ${user.phoneNumber ?? '-'}\nManzil: ${user.location ? `${user.location.latitude}, ${user.location.longitude}` : '-'}`);
  }
}

