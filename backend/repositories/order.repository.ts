import { Order } from "../models/order.model";
import { BaseRepository } from "./base.repository";
import { PARTITION_KEY, TABLE_NAME, ORDER_PREFIX } from "../../backend/consts";

export class OrderRepository extends BaseRepository {
  constructor() {
    super();
    this.init(TABLE_NAME, PARTITION_KEY);
  }
  async createOrder(orderInput: Order): Promise<Order> {
    this.logger.trace("createOrder() called", { order: orderInput }, this.constructor.name);

    const input: Order = {
      ...orderInput,
      composite_id: `${ORDER_PREFIX}#${orderInput.code}`
    };

    await this.put(input);

    return input;
  }
}
