import { APIGatewayProxyHandler } from "aws-lambda";
import { PostRepository } from "../../database/types/PostRepository";
import { DynamoPostRepository } from "../../database/DynamoPostRepository/DynamoPostRepository";
import { Post } from "../../models/Post";
import { schema } from "./schema";

const postRepository: PostRepository = new DynamoPostRepository();

const getBadRequestResponse = (message: string) => {
  return {
    statusCode: 400,
    body: message,
  };
};

export const handler: APIGatewayProxyHandler = async ({ body }) => {
  if (!body) {
    return getBadRequestResponse("Missing body");
  }

  const post: Post = JSON.parse(body);

  const { error } = schema.validate(post);

  if (error) {
    return getBadRequestResponse(error.message);
  }

  try {
    const result = await postRepository.create(post);

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (err) {
    if ((err as Error).name === "ConditionalCheckFailedException") {
      return getBadRequestResponse("Article with this slug already exists");
    }

    return {
      statusCode: 500,
      body: "Internal server error",
    };
  }
};
