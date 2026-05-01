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
var SeedService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("./schemas/product.schema");
let SeedService = SeedService_1 = class SeedService {
    productModel;
    logger = new common_1.Logger(SeedService_1.name);
    constructor(productModel) {
        this.productModel = productModel;
    }
    async onModuleInit() {
        const count = await this.productModel.countDocuments();
        if (count > 0)
            return;
        const seed = [
            {
                name: 'Coca-Cola 0.5L',
                price: 8000,
                category: 'ICHIMLIK',
                ingredients: 'Gazlangan ichimlik',
                imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_0.5L_bottle.png',
                isActive: true,
            },
            {
                name: 'Fanta 0.5L',
                price: 8000,
                category: 'ICHIMLIK',
                ingredients: 'Apelsin ta’mi, gazlangan',
                imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Fanta_Orange_-_500ml.jpg',
                isActive: true,
            },
            {
                name: 'Lavash',
                price: 28000,
                category: 'YEGULIK',
                ingredients: 'Tovuq go‘shti, sabzavot, sous, lavash non',
                imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Shawarma_2019.jpg',
                isActive: true,
            },
            {
                name: 'Burger',
                price: 26000,
                category: 'YEGULIK',
                ingredients: 'Kotlet, pishloq, pomidor, salat bargi, sous, bulochka',
                imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/RedDot_Burger.jpg',
                isActive: true,
            },
            {
                name: 'Cheesecake',
                price: 22000,
                category: 'SHIRINLIK',
                ingredients: 'Pishloqli krem, pechenye asos',
                imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Cheesecake_with_raspberries.jpg',
                isActive: true,
            },
        ];
        try {
            await this.productModel.insertMany(seed, { ordered: false });
            this.logger.log('Seed products inserted.');
        }
        catch (e) {
            this.logger.warn(`Seed insert skipped/partial: ${e.message}`);
        }
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = SeedService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SeedService);
//# sourceMappingURL=seed.service.js.map