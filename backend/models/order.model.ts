import { Customer } from "./customer.model";
import { Product } from "./product.model";

export interface Item extends Product {
  quantity: number;
}

export enum Status {
  CREATED = "created",
  SCANNED = "scanned",
  APPROVED = "approved",
  DECLINED = "declined"
}

export interface Order {
  composite_id: string;
  items: Item[];
  code: string;
  status: Status;
  customer: Customer;
  created: string;
  updated: string;
}
