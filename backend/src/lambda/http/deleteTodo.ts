import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { TodoKey } from '../../types/types'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId: string = event.pathParameters.todoId
    // TODO: Remove a TODO item by id

    const Key: TodoKey = {
      userId: getUserId(event),
      todoId: todoId
    }
    const result: string = await deleteTodo(Key)
    
    return {
      statusCode: 201,
      body: JSON.parse(result)
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
