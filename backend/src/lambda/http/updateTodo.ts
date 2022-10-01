import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { updateTodo } from '../../helpers/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'
import { Logs } from '../../types/types'
import { createLogger } from '../../utils/logger'

const logger: Logs.Logger = createLogger('updateTodos')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object

    logger.info(`Updating todo ${todoId}`)
    const userId: string = getUserId(event)

    await updateTodo({
      todoId: todoId,
      userId: userId,
      ...updatedTodo
    })

    return {
      statusCode: 201,
      body: JSON.stringify({})
    }
})

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
