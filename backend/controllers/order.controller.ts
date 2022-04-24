import { inject, injectable } from "inversify";
import { ContainerKeys } from "../containers/ioc.keys";
import { CreateOrder } from "../contracts/order.contract";
import { Order } from "../models/order.model";
import { LoggerService } from "../services/logger.service";
import { OrderService } from "../services/order.service";

export interface IOrderController {
  createOrder(order: CreateOrder): Promise<Order>;
}

@injectable()
export class OrderController implements IOrderController {
  @inject(LoggerService) protected logger: LoggerService;
  @inject(ContainerKeys.IOrderService) protected orderService: OrderService;
  async createOrder(order: CreateOrder): Promise<Order> {
    this.logger.trace("createOrder()", order, this.constructor.name);
    return await this.orderService.createOrder(order);
  }
}
