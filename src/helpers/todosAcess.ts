import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
// import { DocumentClient } from 'aws-sdk/clients/dynamodb'
// import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
// import { TodoUpdate } from '../models/TodoUpdate';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'


// const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

// const logger = createLogger('TodosAccess')
const todosTable = process.env.TODOS_TABLE
const indexName = process.env.TODOS_CREATED_AT_INDEX;
const docClient = new XAWS.DynamoDB.DocumentClient()

// TODO: Implement the dataLayer logic

export const getTodosForUser = async (userId: string) =>{
    const result = await docClient.query({
      TableName: todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      IndexName: indexName
    }).promise()

    return result.Items;
} 

export const putItem = async (item: TodoItem) =>{
    await docClient
      .put({
        TableName: todosTable,
        Item: item
      })
      .promise()
}

export const updateItem = async (updatedTodo: UpdateTodoRequest, userId: string, todoId: string) =>{
     await docClient
       .update({
         TableName: todosTable,
         Key: {
           todoId,
           userId
         },
         ExpressionAttributeNames: {
           '#n': 'name',
           '#de': 'done',
           '#dt': 'dueDate'
         },
         UpdateExpression: 'set #n = :n, #de = :de, #dt = :dt',
         ExpressionAttributeValues: {
           ':n': updatedTodo.name,
           ':de': updatedTodo.done,
           ':dt': updatedTodo.dueDate
         }
       })
       .promise()

}

export const deleteItem= async (userId:string, todoId: string) => {
    await docClient
      .delete({
        TableName: todosTable,
        Key: {
          userId,
          todoId
        }
      })
      .promise()
}

export const updateItemUrl = async (userId:string, todoId: string, bucketName:string) => {
    await docClient
      .update({
        TableName: todosTable,
        Key: {
          todoId,
          userId
        },
        ExpressionAttributeNames: {
          '#a': 'attachmentUrl'
        },
        UpdateExpression: 'set #a = :a',
        ExpressionAttributeValues: {
          ':a': `https://${bucketName}.s3.amazonaws.com/${todoId}`
        }
      })
      .promise()

}