import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutCommand,
  ScanCommand,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";
import { PostRepository } from "../types/PostRepository";
import { Post } from "../../models/Post";
import { checkForEnv } from "../../utils/checkForEnv";

export class DynamoPostRepository implements PostRepository {
  private readonly client = new DynamoDBClient();

  private readonly docClient = DynamoDBDocumentClient.from(this.client);

  private readonly tableName = checkForEnv(process.env.POST_TABLE);

  async findAll(): Promise<Post[]> {
    const command = new ScanCommand({
      TableName: this.tableName,
    });

    const { Items } = await this.docClient.send(command);

    return (Items || []) as Post[];
  }

  async create(post: Post): Promise<void> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: post,
      ConditionExpression: "attribute_not_exists(slug)",
    });

    await this.docClient.send(command);
  }
}
