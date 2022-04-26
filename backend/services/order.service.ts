import { inject, injectable } from "inversify";
import * as crypto from "crypto";
import { ContainerKeys } from "../containers/ioc.keys";
import { CreateOrder, UpdateOrder } from "../contracts/order.contract";
import { Order, Status } from "../models/order.model";
import { IOrderRepository } from "../repositories/order.repository";
import { LoggerService } from "./logger.service";

export interface IOrderService {
  createOrder(order: CreateOrder): Promise<Order>;
  getOrderByCode(code: string): Promise<Order>;
  updateOrder(input: UpdateOrder): Promise<Order>;
}
@injectable()
export class OrderService implements IOrderService {
  @inject(ContainerKeys.IOrderRepository) private orderRepository: IOrderRepository;
  @inject(LoggerService) protected logger: LoggerService;

  private generateCode() {
    return crypto.randomBytes(10).toString("hex"); // 74c7517a4d36c0f0a160
  }

  async getOrderByCode(code: string): Promise<Order> {
    this.logger.trace("getOrderByCode()", code, this.constructor.name);
    return await this.orderRepository.getOrderByCode(code);
  }

  async createOrder(order: CreateOrder): Promise<Order> {
    const orderInput = {
      ...order,
      status: Status.CREATED,
      code: this.generateCode(),
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    } as Partial<Order>;
    this.logger.trace("createOrder()", orderInput, this.constructor.name);
    return await this.orderRepository.createOrder(orderInput);
  }

  async updateOrder(input: UpdateOrder): Promise<Order> {
    this.logger.trace("updateOrder()", input, this.constructor.name);
    return await this.orderRepository.updateOrder(input);
  }
}
