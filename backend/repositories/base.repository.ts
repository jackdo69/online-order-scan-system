import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { inject, injectable } from "inversify";
import { LoggerService } from "../services/logger.service";

type Item = DocumentClient.AttributeMap;
type PutItemInput = DocumentClient.PutItemInput;

@injectable()
export class BaseRepository {
  protected tableName!: string;
  protected partitionKeyName!: string;

  constructor(@inject(LoggerService) protected logger: LoggerService, @inject(DocumentClient) protected documentClient: DocumentClient) {}

  protected init(tableName: string, partitionKeyName: string): void {
    this.logger.trace("init() called", { tableName, partitionKeyName }, this.constructor.name);

    this.tableName = tableName;
    this.partitionKeyName = partitionKeyName;
  }

  protected async put(entity: Item, returnValues?: string): Promise<Item> {
    this.logger.trace("put() called", { entity }, this.constructor.name);

    const params: PutItemInput = {
      TableName: this.tableName,
      Item: entity,
      ReturnValues: returnValues
    };

    await this.documentClient.put(params).promise();
    return entity;
  }
}
