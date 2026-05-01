import { Markup } from 'telegraf';
import type { Product } from './schemas/product.schema';

export const TEXT = {
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

export function categoriesKeyboard() {
  return Markup.keyboard([[TEXT.drinks, TEXT.foods, TEXT.sweets]]).resize();
}

export function requestPhoneKeyboard() {
  return Markup.keyboard([
    [Markup.button.contactRequest('📱 Telefon raqamni yuborish')],
    [TEXT.cancel],
  ])
    .resize()
    .oneTime();
}

export function requestLocationKeyboard() {
  return Markup.keyboard([
    [Markup.button.locationRequest('📍 Location yuborish')],
    [TEXT.cancel],
  ])
    .resize()
    .oneTime();
}

export function productsKeyboard(products: Pick<Product, 'name'>[]) {
  const rows = products.map((p) => [p.name]);
  return Markup.keyboard([...rows, [TEXT.back]]).resize();
}

export function orderInlineKeyboard(productId: string) {
  return Markup.inlineKeyboard([Markup.button.callback('🛒 Buyurtma berish', `order:${productId}`)]);
}

