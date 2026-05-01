"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEXT = void 0;
exports.categoriesKeyboard = categoriesKeyboard;
exports.requestPhoneKeyboard = requestPhoneKeyboard;
exports.requestLocationKeyboard = requestLocationKeyboard;
exports.productsKeyboard = productsKeyboard;
exports.orderInlineKeyboard = orderInlineKeyboard;
const telegraf_1 = require("telegraf");
exports.TEXT = {
    categoriesTitle: 'Kategoriyani tanlang:',
    askPhone: 'Telefon raqamingizni yuboring.',
    askLocation: 'Manzilingizni (location) yuboring.',
    okReady: 'Rahmat! Endi kategoriyani tanlang:',
    chooseProduct: 'Mahsulotni tanlang:',
    back: '⬅️ Orqaga',
    cancel: '❌ Bekor qilish',
    drinks: '🥤 Ichimliklar',
    foods: '🍔 Yeguliklar',
    sweets: '🍰 Shirinliklar',
};
function categoriesKeyboard() {
    return telegraf_1.Markup.keyboard([[exports.TEXT.drinks, exports.TEXT.foods, exports.TEXT.sweets]]).resize();
}
function requestPhoneKeyboard() {
    return telegraf_1.Markup.keyboard([
        [telegraf_1.Markup.button.contactRequest('📱 Telefon raqamni yuborish')],
        [exports.TEXT.cancel],
    ])
        .resize()
        .oneTime();
}
function requestLocationKeyboard() {
    return telegraf_1.Markup.keyboard([
        [telegraf_1.Markup.button.locationRequest('📍 Location yuborish')],
        [exports.TEXT.cancel],
    ])
        .resize()
        .oneTime();
}
function productsKeyboard(products) {
    const rows = products.map((p) => [p.name]);
    return telegraf_1.Markup.keyboard([...rows, [exports.TEXT.back]]).resize();
}
function orderInlineKeyboard(productId) {
    return telegraf_1.Markup.inlineKeyboard([telegraf_1.Markup.button.callback('🛒 Buyurtma berish', `order:${productId}`)]);
}
//# sourceMappingURL=keyboards.js.map