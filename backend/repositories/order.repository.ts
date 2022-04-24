import { Order } from "../models/order.model";
import { BaseRepository } from "./base.repository";
import { PARTITION_KEY, TABLE_NAME, ORDER_PREFIX } from "../../backend/consts";
import { injectable } from "inversify";

export interface IOrderRepository {
  createOrder(orderInput: Partial<Order>): Promise<Order>;
}
@injectable()
export class OrderRepository extends BaseRepository {
  constructor() {
    super();
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
}
