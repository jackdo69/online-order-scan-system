import "reflect-metadata";
import { Container } from "inversify";
import { ContainerKeys } from "./ioc.keys";
import { LoggerService } from "../services/logger.service";
import { DynamoDB } from "aws-sdk";

// Create the IOC Container
const container = new Container();

try {
  const client: DynamoDB.DocumentClient = new DynamoDB.DocumentClient();

  container.bind(DynamoDB.DocumentClient).toConstantValue(client);
  container.bind<LoggerService>(LoggerService).to(LoggerService).inSingletonScope();
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
