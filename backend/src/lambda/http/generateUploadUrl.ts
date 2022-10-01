import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createAttachmentPresignedUrl } from '../../helpers/todos'
import { getUserId } from '../utils'
import { Logs } from '../../types/types'
import { createLogger } from '../../utils/logger'

const logger: Logs.Logger = createLogger('generateUploadUrl')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    const userId: string = getUserId(event)
    logger.info(`Creating presigned url for user ${userId}`)

    if (!todoId) throw new Error("Todo id is required")
    const url: string = createAttachmentPresignedUrl(todoId)

    return {
      statusCode: 200,
      body: JSON.stringify({ uploadUrl: url })
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
