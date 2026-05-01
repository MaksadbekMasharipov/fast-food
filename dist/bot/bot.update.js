"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotUpdate = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const nestjs_telegraf_1 = require("nestjs-telegraf");
const mongoose_2 = require("mongoose");
const keyboards_1 = require("./keyboards");
const user_schema_1 = require("./schemas/user.schema");
const product_schema_1 = require("./schemas/product.schema");
const order_schema_1 = require("./schemas/order.schema");
const CATEGORY_BY_TEXT = {
    [keyboards_1.TEXT.drinks]: 'ICHIMLIK',
    [keyboards_1.TEXT.foods]: 'YEGULIK',
    [keyboards_1.TEXT.sweets]: 'SHIRINLIK',
};
function getTelegramName(ctx) {
    const from = ctx.from;
    return {
        firstName: from?.first_name,
        lastName: from?.last_name,
        username: from?.username,
    };
}
let BotUpdate = class BotUpdate {
    userModel;
    productModel;
    orderModel;
    constructor(userModel, productModel, orderModel) {
        this.userModel = userModel;
        this.productModel = productModel;
        this.orderModel = orderModel;
    }
    async upsertUser(ctx) {
        const telegramId = ctx.from?.id;
        if (!telegramId)
            return null;
        const name = getTelegramName(ctx);
        return this.userModel.findOneAndUpdate({ telegramId }, { $set: { telegramId, ...name } }, { new: true, upsert: true });
    }
    async ensureProfileFlow(ctx) {
        const user = await this.upsertUser(ctx);
        if (!user)
            return { ok: false };
        if (!user.phoneNumber) {
            await ctx.reply(keyboards_1.TEXT.askPhone, (0, keyboards_1.requestPhoneKeyboard)());
            return { ok: false };
        }
        if (!user.location) {
            await ctx.reply(keyboards_1.TEXT.askLocation, (0, keyboards_1.requestLocationKeyboard)());
            return { ok: false };
        }
        return { ok: true, user };
    }
    async start(ctx) {
        const flow = await this.ensureProfileFlow(ctx);
        if (!flow.ok)
            return;
        await ctx.reply(keyboards_1.TEXT.okReady, (0, keyboards_1.categoriesKeyboard)());
    }
    async startCmd(ctx) {
        return this.start(ctx);
    }
    async menu(ctx) {
        const flow = await this.ensureProfileFlow(ctx);
        if (!flow.ok)
            return;
        await ctx.reply(keyboards_1.TEXT.categoriesTitle, (0, keyboards_1.categoriesKeyboard)());
    }
    async onContact(ctx) {
        const telegramId = ctx.from?.id;
        const contact = ctx.message?.contact;
        if (!telegramId)
            return;
        const phoneNumber = contact?.phone_number;
        if (!phoneNumber)
            return;
        await this.userModel.updateOne({ telegramId }, { $set: { phoneNumber } }, { upsert: true });
        const user = await this.userModel.findOne({ telegramId });
        if (!user?.location) {
            await ctx.reply(keyboards_1.TEXT.askLocation, (0, keyboards_1.requestLocationKeyboard)());
            return;
        }
        await ctx.reply(keyboards_1.TEXT.okReady, (0, keyboards_1.categoriesKeyboard)());
    }
    async onLocation(ctx) {
        const telegramId = ctx.from?.id;
        const loc = ctx.message?.location;
        if (!telegramId || !loc)
            return;
        await this.userModel.updateOne({ telegramId }, { $set: { location: loc } }, { upsert: true });
        const user = await this.userModel.findOne({ telegramId });
        if (!user?.phoneNumber) {
            await ctx.reply(keyboards_1.TEXT.askPhone, (0, keyboards_1.requestPhoneKeyboard)());
            return;
        }
        await ctx.reply(keyboards_1.TEXT.okReady, (0, keyboards_1.categoriesKeyboard)());
    }
    async onText(ctx) {
        const text = ctx.message?.text;
        if (!text)
            return;
        if (text === keyboards_1.TEXT.cancel) {
            await ctx.reply(keyboards_1.TEXT.categoriesTitle, (0, keyboards_1.categoriesKeyboard)());
            return;
        }
        if (text === keyboards_1.TEXT.back) {
            const flow = await this.ensureProfileFlow(ctx);
            if (!flow.ok)
                return;
            await ctx.reply(keyboards_1.TEXT.categoriesTitle, (0, keyboards_1.categoriesKeyboard)());
            return;
        }
        const cat = CATEGORY_BY_TEXT[text];
        if (cat) {
            const flow = await this.ensureProfileFlow(ctx);
            if (!flow.ok)
                return;
            const products = await this.productModel
                .find({ category: cat, isActive: true })
                .select({ name: 1 })
                .sort({ name: 1 })
                .lean();
            if (products.length === 0) {
                await ctx.reply("Hozircha mahsulot yo‘q.", (0, keyboards_1.categoriesKeyboard)());
                return;
            }
            await ctx.reply(keyboards_1.TEXT.chooseProduct, (0, keyboards_1.productsKeyboard)(products));
            return;
        }
        const telegramId = ctx.from?.id;
        if (telegramId) {
            const user = await this.userModel.findOne({ telegramId }).lean();
            if (user && !user.phoneNumber) {
                const maybePhone = text.replace(/[^\d+]/g, '').trim();
                if (maybePhone.length >= 9) {
                    await this.userModel.updateOne({ telegramId }, { $set: { phoneNumber: maybePhone } }, { upsert: true });
                    await ctx.reply(keyboards_1.TEXT.askLocation, (0, keyboards_1.requestLocationKeyboard)());
                    return;
                }
            }
        }
        const product = await this.productModel.findOne({ name: text, isActive: true }).lean();
        if (!product)
            return;
        const captionLines = [
            `🍽 ${product.name}`,
            `💰 Narxi: ${product.price.toLocaleString('uz-UZ')} so‘m`,
            product.ingredients ? `🧾 Tarkibi: ${product.ingredients}` : undefined,
        ].filter(Boolean);
        const caption = captionLines.join('\n');
        const kb = (0, keyboards_1.orderInlineKeyboard)(String(product._id));
        if (product.imageUrl) {
            await ctx.replyWithPhoto(product.imageUrl, { caption, ...kb });
        }
        else {
            await ctx.reply(caption, kb);
        }
    }
    async order(ctx) {
        const telegramId = ctx.from?.id;
        const productId = String(ctx.match?.[1] ?? '');
        if (!telegramId || !productId)
            return;
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
};
exports.BotUpdate = BotUpdate;
__decorate([
    (0, nestjs_telegraf_1.Start)(),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "start", null);
__decorate([
    (0, nestjs_telegraf_1.Command)('start'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "startCmd", null);
__decorate([
    (0, nestjs_telegraf_1.Command)('menu'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "menu", null);
__decorate([
    (0, nestjs_telegraf_1.On)('contact'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "onContact", null);
__decorate([
    (0, nestjs_telegraf_1.On)('location'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "onLocation", null);
__decorate([
    (0, nestjs_telegraf_1.On)('text'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "onText", null);
__decorate([
    (0, nestjs_telegraf_1.Action)(/^order:(.+)$/),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "order", null);
exports.BotUpdate = BotUpdate = __decorate([
    (0, nestjs_telegraf_1.Update)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(2, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], BotUpdate);
//# sourceMappingURL=bot.update.js.map