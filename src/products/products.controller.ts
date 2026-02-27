import { Controller, Get, Post, Body, Param, NotFoundException  } from '@nestjs/common';
import { ProductsService } from './services/products.service';
import {CreateProductInput, createProductSchema} from "./schemas/create-product.schema";

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Get()
    async getAll() {
        return await this.productsService.findAll();
    }

    @Post()
    async createProduct(@Body() body: any) {
        const validated: CreateProductInput = createProductSchema.parse(body);
        return this.productsService.create(validated);
    }

    @Get(':id')
    async getById(@Param('id') id: string) {
        const product = await this.productsService.findById(id);
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }
}