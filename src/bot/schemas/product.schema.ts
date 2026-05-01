import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

export type ProductCategory = 'ICHIMLIK' | 'YEGULIK' | 'SHIRINLIK';

@Schema({ timestamps: true })
export class Product {
  @Prop({ type: String, required: true, index: true })
  name!: string;

  @Prop({ type: Number, required: true })
  price!: number;

  @Prop({ type: String, required: true, enum: ['ICHIMLIK', 'YEGULIK', 'SHIRINLIK'], index: true })
  category!: ProductCategory;

  @Prop({ type: String })
  imageUrl?: string;

  @Prop({ type: String })
  ingredients?: string;

  @Prop({ type: Boolean, default: true })
  isActive!: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.index({ category: 1, name: 1 }, { unique: true });

