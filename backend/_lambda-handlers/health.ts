import "source-map-support/register";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { container } from "../containers/ioc.container";
import { LoggerService } from "../services/logger.service";

const logger: LoggerService = container.get(LoggerService);
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.trace("health lambda executed", event);

  return {
    body: "OK",
    statusCode: 200
  };
};
