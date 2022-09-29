import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import {TodoItem} from '../models/TodoItem'
import { DbItems, EnvString, Result, TodoKey, UpdateTodoData } from '../types/types'

class TodoUtils {
    constructor(
        private readonly s3: AWS.S3 = new AWS.S3({signatureVersion: 'v4'}),
        private readonly bucketName: string = process.env.TODOS_S3_BUCKET,
        private readonly urlExpiration: string = process.env.SIGNED_URL_EXPIRATION,
    ){}

    generateSignedUrl(todoId: string): string {
        return this.s3.getSignedUrl('putObject',
        {
            Bucket: this.bucketName,
            Key: todoId,
            Expires: parseInt(this.urlExpiration)
        })
    }


}

export class TodoAccess extends TodoUtils{
    
    constructor (
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly todosTable: EnvString = process.env.GROUPS_TABLE){
            super()
        }
    async getTodos(userId: string): Promise<TodoItem[]> {
        console.log('Getting todos')

        const result: Result = await this.docClient.query(
            {
                TableName: this.todosTable,
                ExpressionAttributeValues: {
                    ':todosId': userId
                },
                KeyConditionExpression: 'todosId = :todosId',
                ScanIndexForward: false
            }
        ).promise()
        const items: DbItems = result.Items

        return items as TodoItem[]
    }

    async todosExist(userId: string): Promise<boolean> {
        const result: Result = await this.docClient.get(
            {
                TableName: this.todosTable,
                Key: {
                    id: userId
                }
            }
        ).promise()
        
        console.log('Get Todo: ', result)
        return !!result.Items
    }

    async getTodo(Key: TodoKey): Promise<TodoItem[]> {
        const result: Result = await this.docClient.get(
            {
                TableName: this.todosTable,
                Key
            }
        ).promise()
        
        const item: DbItems = result.Items

        console.log('Get Todo: ', result)
        return item as TodoItem[]
    }

    async createTodo(todoItem: TodoItem): Promise<TodoItem> {
        await this.docClient.put({
            TableName: this.todosTable,
            Item: todoItem
        }).promise()
        return todoItem
    }

    async deleteTodo(Key: TodoKey): Promise<string> {
        await this.docClient.delete({
            TableName: this.todosTable,
            Key
          }).promise()
          return ''
    }

    async updateTodo(updateItem: UpdateTodoData): Promise<TodoItem>{
        const Key: TodoKey = {
            userId: updateItem.userId,
            todoId: updateItem.todoId
        }
        await this.docClient.update({
            TableName: this.todosTable,
            Key,
            UpdateExpression: `set name = :name,
                set dueDate = :dueDate,
                set done = :done`,
            ExpressionAttributeValues: {
                ":name": `${updateItem.name}`,
                ":dueDate": `${updateItem.dueDate}`,
                ":done": `${updateItem.done}`
            }
        }).promise()

        return await this.getTodo(Key)[0]
    }

}



