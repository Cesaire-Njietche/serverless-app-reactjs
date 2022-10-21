import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
// import * as AWS from 'aws-sdk'
import { cors, httpErrorHandler } from 'middy/middlewares'

// import { createAttachmentPresignedUrl } from '../../businessLogic/todos'
import { createPresignedUrl } from '../../helpers/todos'

import { getUserId } from '../utils'

// const s3 = new AWS.S3({
//   signatureVersion: 'v4'
// })
const bucketName = process.env.ATTACHMENT_S3_BUCKET
// const expiration = process.env.SIGNED_URL_EXPIRATION

// const docClient = new AWS.DynamoDB.DocumentClient()
// const todosTable = process.env.TODOS_TABLE

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  

    // let uploadUrl = s3.getSignedUrl('putObject', {
    //   Bucket: bucketName,
    //   Key: todoId,
    //   Expires: Number(expiration)
    // })

     const userId = getUserId(event)
     let uploadUrl = await createPresignedUrl(bucketName, todoId, userId)
    //  await docClient
    //    .update({
    //      TableName: todosTable,
    //      Key: {
    //        todoId,
    //        userId
    //      },
    //      ExpressionAttributeNames: {
    //        '#a': 'attachmentUrl'
    //      },
    //      UpdateExpression: 'set #a = :a',
    //      ExpressionAttributeValues: {
    //        ':a': `https://${bucketName}.s3.amazonaws.com/${todoId}`
    //      }
    //    })
    //    .promise()

    return {
      statusCode: 200,
      body: JSON.stringify({uploadUrl})
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
