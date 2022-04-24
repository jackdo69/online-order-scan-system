import "source-map-support/register";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { response } from "../helpers/response.helper";
import { LoggerService } from "../services/logger.service";
import { container } from "../containers/ioc.container";
import { IOrderController } from "../controllers/order.controller";
import { ContainerKeys } from "../containers/ioc.keys";

const logger: LoggerService = container.get(LoggerService);
const controller: IOrderController = container.get(ContainerKeys.IOrderController);
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.trace("Create Order executed", event);
  try {
    if (!event) throw new Error("Event is missing in the payload");
    const { body } = event;
    if (!body) throw new Error("Missing body from event");

    const result = await controller.createOrder(JSON.parse(body));
    return response(200, result);
  } catch (err: any) {
    logger.error("Create Order Lambda failed", err);
    return response(500, err);
  }
};
