import { inject, injectable } from "inversify";
import { ContainerKeys } from "../containers/ioc.keys";
import { CreateOrder, UpdateOrder } from "../contracts/order.contract";
import { Order } from "../models/order.model";
import { LoggerService } from "../services/logger.service";
import { OrderService } from "../services/order.service";

export interface IOrderController {
  createOrder(order: CreateOrder): Promise<Order>;
  getOrderByCode(code: string): Promise<Order>;
  updateOrder(input: UpdateOrder): Promise<Order>;
}

@injectable()
export class OrderController implements IOrderController {
  @inject(LoggerService) protected logger: LoggerService;
  @inject(ContainerKeys.IOrderService) protected orderService: OrderService;
  async createOrder(order: CreateOrder): Promise<Order> {
    this.logger.trace("createOrder()", order, this.constructor.name);
    return await this.orderService.createOrder(order);
  }
  async getOrderByCode(code: string): Promise<Order> {
    this.logger.trace("getOrderByCode()", code, this.constructor.name);
    return await this.orderService.getOrderByCode(code);
  }

  async updateOrder(input: UpdateOrder): Promise<Order> {
    this.logger.trace("updateOrder()", input, this.constructor.name);
    return await this.orderService.updateOrder(input);
  }
}
