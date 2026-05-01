"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_telegraf_1 = require("nestjs-telegraf");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const bot_update_1 = require("./bot.update");
const user_schema_1 = require("./schemas/user.schema");
const product_schema_1 = require("./schemas/product.schema");
const order_schema_1 = require("./schemas/order.schema");
const seed_service_1 = require("./seed.service");
let BotModule = class BotModule {
};
exports.BotModule = BotModule;
exports.BotModule = BotModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_telegraf_1.TelegrafModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    token: (() => {
                        const token = (config.get('BOT_TOKEN') ?? '').trim();
                        if (!/^\d+:[A-Za-z0-9_-]+$/.test(token)) {
                            throw new Error('BOT_TOKEN noto‘g‘ri ko‘rinishda. .env ichida BOT_TOKEN ni tekshiring (BotFather bergan token bo‘lishi kerak).');
                        }
                        return token;
                    })(),
                }),
            }),
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: product_schema_1.Product.name, schema: product_schema_1.ProductSchema },
                { name: order_schema_1.Order.name, schema: order_schema_1.OrderSchema },
            ]),
        ],
        providers: [bot_update_1.BotUpdate, seed_service_1.SeedService],
    })
], BotModule);
//# sourceMappingURL=bot.module.js.map