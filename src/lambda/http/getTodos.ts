import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
// import * as AWS from 'aws-sdk'
import { cors } from 'middy/middlewares'

import { getTodosForUserId } from '../../helpers/todos'
import { getUserId } from '../utils';

// TODO: Get all TODO items for a current user

// const docClient = new AWS.DynamoDB.DocumentClient()
// const todosTable = process.env.TODOS_TABLE
// const indexName = process.env.TODOS_CREATED_AT_INDEX;

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    console.log("Processing event:", event)

    // const result = await docClient.query({
    //   TableName: todosTable,
    //   KeyConditionExpression: 'userId = :userId',
    //   ExpressionAttributeValues: {
    //     ':userId': getUserId(event)
    //   },
    //   IndexName: indexName
    // }).promise()

    // const items = result.Items;
    const items = await getTodosForUserId(getUserId(event))

    return {
      statusCode: 200,
      body: JSON.stringify({
        items
      })
    }
  }
)
handler.use(
  cors({
    credentials: true
  })
)
