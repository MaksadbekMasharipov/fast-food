import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';
import { Product } from './product.schema';

export type OrderDocument = HydratedDocument<Order>;

export type OrderStatus = 'NEW' | 'CANCELLED' | 'DONE';

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Product.name, required: true })
  productId!: Types.ObjectId;

  @Prop({ type: Number, default: 1 })
  quantity!: number;

  @Prop({ type: String, required: true, enum: ['NEW', 'CANCELLED', 'DONE'], default: 'NEW' })
  status!: OrderStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

