import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: Number, required: true, unique: true, index: true })
  telegramId!: number;

  @Prop({ type: String })
  firstName?: string;

  @Prop({ type: String })
  lastName?: string;

  @Prop({ type: String })
  username?: string;

  @Prop({ type: String })
  phoneNumber?: string;

  @Prop({
    type: {
      latitude: Number,
      longitude: Number,
    },
    _id: false,
  })
  location?: { latitude: number; longitude: number };
}

export const UserSchema = SchemaFactory.createForClass(User);

