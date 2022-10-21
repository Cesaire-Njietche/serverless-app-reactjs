import { getTodosForUser, putItem, updateItem, deleteItem, updateItemUrl } from './todosAcess'
import { generateSignedUrl } from './attachmentUtils';
// import { TodoItem } from '../models/TodoItem'
// import { TodoUpdate } from '../models/TodoUpdate';
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
import { v4 as uuidv4 } from 'uuid'
// import * as createError from 'http-errors'


export const getTodosForUserId = async (userId:string) => {
  return await getTodosForUser(userId)
} 

export const createTodo = async (todo: CreateTodoRequest, userId: string) => {
    const todoId = uuidv4()
    const createdAt = new Date().toISOString()
    const done = false

    const item = {
      userId,
      todoId,
      createdAt,
      done,
      ...todo
      // attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`
    }

    await putItem(item)
    return item

}

export const updateTodo = async (item: UpdateTodoRequest, userId: string, todoId: string) => {
  await updateItem(item, userId, todoId)
}

export const deleteTodo = async (userId: string, todoId: string) =>{
  await deleteItem(userId, todoId)
}

export const createPresignedUrl = async (bucketName: string, todoId: string, userId: string) => {
  let url = generateSignedUrl(bucketName, todoId);
  await updateItemUrl(userId, todoId, bucketName)

  return url
}