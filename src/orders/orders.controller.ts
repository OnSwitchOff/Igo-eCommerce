import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import {
  CreateOrderInput,
  CreateOrderSchema,
} from './schemas/create-order.schema';
import { OrderResponse } from './schemas/order-response.schema';
import { toOrderResponse } from './orders.mapper';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async getAll(): Promise<OrderResponse[]> {
    const orders = await this.ordersService.findAll();
    console.log(orders);
    return orders.map((o) => toOrderResponse(o));
  }

  @Post()
  async createOrder(@Body() body: any): Promise<OrderResponse> {
    const validated: CreateOrderInput = CreateOrderSchema.parse(body);

    try {
      const order = await this.ordersService.create(validated);
      console.log(order);
      return toOrderResponse(order);
    } catch (ex) {
      console.log(ex);
      throw ex;
    }
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<OrderResponse> {
    const order = await this.ordersService.findById(id);
    if (!order) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return toOrderResponse(order);
  }
}
