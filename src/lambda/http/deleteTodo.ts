import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
// import * as AWS from 'aws-sdk'

import { deleteTodo } from '../../helpers/todos'
import { getUserId } from '../utils'

// const docClient = new AWS.DynamoDB.DocumentClient()
// const todosTable = process.env.TODOS_TABLE

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Remove a TODO item by id
    const userId = getUserId(event)

    // await docClient.delete({
    //   TableName: todosTable,
    //   Key: {
    //     userId,
    //     todoId
    //   },
      
    // }).promise()
    await deleteTodo(userId, todoId)
    
    return {
      statusCode: 200,
      body: 'item deleted'
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
