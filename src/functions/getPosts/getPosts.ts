import { APIGatewayProxyHandler } from "aws-lambda";
import { PostRepository } from "../../database/types/PostRepository";
import { DynamoPostRepository } from "../../database/DynamoPostRepository/DynamoPostRepository";

const postRepository: PostRepository = new DynamoPostRepository();

export const handler: APIGatewayProxyHandler = async () => {
  const posts = await postRepository.findAll();

  return {
    statusCode: 200,
    body: JSON.stringify(posts),
  };
};
