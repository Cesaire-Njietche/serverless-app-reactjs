import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
// import * as AWS from 'aws-sdk'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateTodo } from '../../helpers/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'

// const docClient = new AWS.DynamoDB.DocumentClient()
// const todosTable = process.env.TODOS_TABLE

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
    const userId = getUserId(event)
    // await docClient
      // .update({
      //   TableName: todosTable,
      //   Key: {
      //     todoId,
      //     userId
      //   },
      //   ExpressionAttributeNames: {
      //     '#n': 'name',
      //     '#de': 'done',
      //     '#dt': 'dueDate',
      //   },
      //   UpdateExpression: 'set #n = :n, #de = :de, #dt = :dt',
      //   ExpressionAttributeValues: {
      //     ':n': updatedTodo.name,
      //     ':de': updatedTodo.done,
      //     ':dt': updatedTodo.dueDate
      //   }
      // })
      // .promise()

    await updateTodo(updatedTodo, userId, todoId)
    return {
      statusCode: 200,
      body: 'item updated'
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
