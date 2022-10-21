import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})
const expiration = process.env.SIGNED_URL_EXPIRATION

// TODO: Implement the fileStogare logic

export const generateSignedUrl = (bucketName: string, todoId: string)=>{
    return s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: todoId,
      Expires: Number(expiration)
    })
}