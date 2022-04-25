import { Order } from "../models/order.model";
import { BaseRepository } from "./base.repository";
import { PARTITION_KEY, TABLE_NAME, ORDER_PREFIX } from "../../backend/consts";
import { inject, injectable } from "inversify";
import { LoggerService } from "../services/logger.service";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

export interface IOrderRepository {
  createOrder(orderInput: Partial<Order>): Promise<Order>;
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
}
