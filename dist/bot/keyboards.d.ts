import { Markup } from 'telegraf';
import type { Product } from './schemas/product.schema';
export declare const TEXT: {
    categoriesTitle: string;
    askPhone: string;
    askLocation: string;
    okReady: string;
    chooseProduct: string;
    back: string;
    cancel: string;
    drinks: string;
    foods: string;
    sweets: string;
};
export declare function categoriesKeyboard(): Markup.Markup<import("@telegraf/types").ReplyKeyboardMarkup>;
export declare function requestPhoneKeyboard(): Markup.Markup<import("@telegraf/types").ReplyKeyboardMarkup>;
export declare function requestLocationKeyboard(): Markup.Markup<import("@telegraf/types").ReplyKeyboardMarkup>;
export declare function productsKeyboard(products: Pick<Product, 'name'>[]): Markup.Markup<import("@telegraf/types").ReplyKeyboardMarkup>;
export declare function orderInlineKeyboard(productId: string): Markup.Markup<import("@telegraf/types").InlineKeyboardMarkup>;
