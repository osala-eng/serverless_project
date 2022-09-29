import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../businessLogic/todos'
import uuid from 'uuid'
import { CreateTodoData } from '../../types/types'
import { TodoItem } from '../../models/TodoItem'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item

    const createParams: CreateTodoData = {
      userId: getUserId(event),
      todoId: uuid.v4(),
      ...newTodo
    } 
    const todoItem: TodoItem = await createTodo(createParams)

    return {
        statusCode: 201,
        body: JSON.stringify({
          newItem: todoItem
        })
      }
    }
)

handler.use(
  cors({
    credentials: true
  })
)
