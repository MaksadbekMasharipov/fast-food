import { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<User>;
export declare class User {
    telegramId: number;
    firstName?: string;
    lastName?: string;
    username?: string;
    phoneNumber?: string;
    location?: {
        latitude: number;
        longitude: number;
    };
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, any, any, User>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, import("mongoose").Document<unknown, {}, User, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<User & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    telegramId?: import("mongoose").SchemaDefinitionProperty<number, User, import("mongoose").Document<unknown, {}, User, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    firstName?: import("mongoose").SchemaDefinitionProperty<string | undefined, User, import("mongoose").Document<unknown, {}, User, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    lastName?: import("mongoose").SchemaDefinitionProperty<string | undefined, User, import("mongoose").Document<unknown, {}, User, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    username?: import("mongoose").SchemaDefinitionProperty<string | undefined, User, import("mongoose").Document<unknown, {}, User, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    phoneNumber?: import("mongoose").SchemaDefinitionProperty<string | undefined, User, import("mongoose").Document<unknown, {}, User, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    location?: import("mongoose").SchemaDefinitionProperty<{
        latitude: number;
        longitude: number;
    } | undefined, User, import("mongoose").Document<unknown, {}, User, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, User>;
