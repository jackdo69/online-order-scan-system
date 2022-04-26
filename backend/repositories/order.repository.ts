import { Order } from "../models/order.model";
import { BaseRepository } from "./base.repository";
import { PARTITION_KEY, TABLE_NAME, ORDER_PREFIX } from "../../backend/consts";
import { inject, injectable } from "inversify";
import { LoggerService } from "../services/logger.service";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { UpdateOrder } from "../contracts/order.contract";

export interface IOrderRepository {
  createOrder(orderInput: Partial<Order>): Promise<Order>;
  updateOrder(input: UpdateOrder): Promise<Order>;
  getOrderByCode(code: string): Promise<Order>;
}
@injectable()
export class OrderRepository extends BaseRepository {
  constructor(@inject(LoggerService) protected logger: LoggerService, @inject(DocumentClient) protected documentClient: DocumentClient) {
    super(logger, documentClient);
    this.init(TABLE_NAME, PARTITION_KEY);
  }
  async createOrder(orderInput: Partial<Order>): Promise<Order> {
    this.logger.trace("createOrder()", orderInput, this.constructor.name);

    const input: Order = {
      ...orderInput,
      composite_id: `${ORDER_PREFIX}#${orderInput.code}`
    } as Order;

    await this.put(input);

    return input;
  }

  async updateOrder(input: UpdateOrder): Promise<Order> {
    this.logger.trace("updateOrder()", input, this.constructor.name);
    const { status, code } = input;
    const order = await this.getOrderByCode(code);

    if (!order) throw new Error(`Unable to find the order with code: ${code}`);

    const updatedOrder: Order = {
      ...order,
      status
    } as Order;

    await this.put(updatedOrder);

    return updatedOrder;
  }

  async getOrderByCode(code: string): Promise<Order> {
    this.logger.trace("getOrderByCode()", code, this.constructor.name);

    const composite_id = `${ORDER_PREFIX}#${code}`;

    return await this.readEntity(composite_id);
  }
}
