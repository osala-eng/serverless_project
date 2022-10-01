import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { deleteTodo } from '../../helpers/todos'
import { getUserId } from '../utils'
import { Logs, TodoKey } from '../../types/types'
import { createLogger } from '../../utils/logger'

const logger: Logs.Logger = createLogger('deleteTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId: string = event.pathParameters.todoId
    // TODO: Remove a TODO item by id
    logger.info(`Deleting todo: ${todoId}`)

    if(!todoId) logger.error('Todo id is required', event);
    const Key: TodoKey = {
      userId: getUserId(event),
      todoId: todoId
    }
    await deleteTodo(Key)
    
    return {
      statusCode: 201,
      body: JSON.stringify({})
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
