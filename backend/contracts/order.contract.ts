import { Customer } from "../models/customer.model";
import { Item } from "../models/order.model";
import { Status } from "../models/order.model";

export interface CreateOrder {
  items: Item[];
  customer: Customer;
}

export interface UpdateOrder {
  code: string;
  status: Status;
}
