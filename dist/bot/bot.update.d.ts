import type { Context } from 'telegraf';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { Product } from './schemas/product.schema';
import { Order } from './schemas/order.schema';
type BotCtx = Context;
export declare class BotUpdate {
    private readonly userModel;
    private readonly productModel;
    private readonly orderModel;
    constructor(userModel: Model<User>, productModel: Model<Product>, orderModel: Model<Order>);
    private upsertUser;
    private ensureProfileFlow;
    start(ctx: BotCtx): Promise<void>;
    startCmd(ctx: BotCtx): Promise<void>;
    menu(ctx: BotCtx): Promise<void>;
    onContact(ctx: BotCtx): Promise<void>;
    onLocation(ctx: BotCtx): Promise<void>;
    onText(ctx: BotCtx): Promise<void>;
    order(ctx: any): Promise<void>;
}
export {};
