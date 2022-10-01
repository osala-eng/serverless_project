import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../helpers/todos'
import * as uuid from 'uuid'
import { CreateTodoData, Logs } from '../../types/types'
import { TodoItem } from '../../models/TodoItem'
import { createLogger } from '../../utils/logger'

const logger: Logs.Logger = createLogger('createTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item
    const createParams: CreateTodoData = {
      userId: getUserId(event),
      todoId: uuid.v4(),
      ...newTodo
    } 

    logger.info(`Creating new todo`, newTodo)

    const item: TodoItem = await createTodo(createParams)

    return {
        statusCode: 201,
        body: JSON.stringify({ item })
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
