import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { ProductsService } from './services/products.service';
import {
  CreateProductInput,
  CreateProductSchema,
} from './schemas/create-product.schema';
import { toProductResponse } from './products.mapper';
import { ProductResponse } from './schemas/product-response.schema';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @Get()
  async getAll(): Promise<ProductResponse[]> {
    const products = await this.productsService.findAll();
    return products.map((p) => toProductResponse(p));
  }

  @Post()
  async createProduct(@Body() body: any): Promise<ProductResponse> {
    const validated: CreateProductInput = CreateProductSchema.parse(body);
    const product = await this.productsService.create(validated);
    return toProductResponse(product);
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<ProductResponse> {
    const product = await this.productsService.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return toProductResponse(product);
  }
}
