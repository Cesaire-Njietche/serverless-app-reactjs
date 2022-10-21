import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
// import * as AWS from 'aws-sdk'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
// import { v4 as uuidv4 } from 'uuid'
import { getUserId } from '../utils';
import { createTodo } from '../../helpers/todos'

// const docClient = new AWS.DynamoDB.DocumentClient()
// const todosTable = process.env.TODOS_TABLE
// const bucketName = process.env.ATTACHMENT_S3_BUCKET

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todo: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item
    // const todoId = uuidv4();
    // const createdAt = new Date().toISOString();
    const userId = getUserId(event);
    // const done = false;
 
    
    // const item = {
    //   userId,
    //   todoId,
    //   createdAt,
    //   done,
    //   ...todo,
    //   // attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`
    // }

    // await docClient.put({
    //   TableName: todosTable,
    //   Item: item
    // }).promise();

    const item = await createTodo(todo, userId)

    return {
      statusCode: 201,
      body: JSON.stringify({
        item
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
