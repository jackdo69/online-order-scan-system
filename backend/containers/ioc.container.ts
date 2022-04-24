import "reflect-metadata";
import { Container } from "inversify";
import { ContainerKeys } from "./ioc.keys";
import { LoggerService } from "../services/logger.service";
import { DynamoDB } from "aws-sdk";
import { IOrderService, OrderService } from "../services/order.service";
import { IOrderRepository, OrderRepository } from "../repositories/order.repository";
import { IOrderController, OrderController } from "../controllers/order.controller";

// Create the IOC Container
const container = new Container();

try {
  const client: DynamoDB.DocumentClient = new DynamoDB.DocumentClient();

  container.bind(DynamoDB.DocumentClient).toConstantValue(client);
  container.bind<LoggerService>(LoggerService).to(LoggerService).inSingletonScope();
  container.bind<IOrderController>(ContainerKeys.IOrderController).to(OrderController);
  container.bind<IOrderService>(ContainerKeys.IOrderService).to(OrderService);
  container.bind<IOrderRepository>(ContainerKeys.IOrderRepository).to(OrderRepository);
} catch (error: any) {
  const logOutput = {
    level: "error",
    message: "Error occurred during IOC initialization",
    data: error?.message ?? error,
    timestamp: new Date().toISOString(),
    location: "ioc.container"
  };

  // eslint-disable-next-line no-console
  console.log(logOutput);
}

export { container };
