import * as SDK_AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import {TodoItem} from '../models/TodoItem'
import { DbItems, EnvString, Result, TodoKey, UpdateTodoData } from '../types/types'
import * as AWSXRay from 'aws-xray-sdk'
import { TodoUtils } from '../helpers/attachmentUtils'


const AWS = AWSXRay.captureAWS(SDK_AWS);



/**
 * Main class to Implement data access
 */
export class TodoAccess extends TodoUtils{
    /**
     * 
     * @param docClient DynamoDb client
     * @param todosTable DynamoDb table
     * @param indexName Table indexName
     */
    constructor (
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly todosTable: EnvString = process.env.TODOS_TABLE,
        private readonly indexName: EnvString = process.env.TODOS_CREATED_AT_INDEX)
        {
            super()
        }

    /**
     * getTodos - Query Todos
     * @param userId User Id string
     * @returns An array of Todo Items
     */
    async getTodos(userId: string): Promise<TodoItem[]> {
        console.log('Getting todos')

        const result: Result = await this.docClient.query(
            {
                TableName: this.todosTable,
                IndexName: this.indexName,
                KeyConditionExpression: 'userId = :paritionKey',
                ExpressionAttributeValues: {
                    ':paritionKey': userId
                }
            }
        ).promise()
        const items: DbItems = result.Items
        console.log(`Retrieved todos for user: ${userId}`)
        return items as TodoItem[]
    }
    /**
     * todoExist - Check if a requested todo exists
     * @param userId User Id string
     * @returns boolean 
     */
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

    /**
     * getTodo - Get a todo
     * @param Key Object containg UserId an TodoId
     * @returns An array of Todo Items
     */
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

    /**
     * createTodo - Create a todo
     * @param todoItem Object TodoItem
     * @returns Object TodoItem
     */
    async createTodo(todoItem: TodoItem): Promise<TodoItem> {
        todoItem.attachmentUrl =
        `https://${this.bucketName}.s3.amazonaws.com/${todoItem.todoId}`

        await this.docClient.put({
            TableName: this.todosTable,
            Item: todoItem
        }).promise()

        console.log(`Created todo for user: ${todoItem.userId}`)
        return todoItem
    }

    /**
     * deleteTodo - Delete a todo Item
     * @param Key Object TodoKey
     */
    async deleteTodo(Key: TodoKey): Promise<void> {
        await this.docClient.delete({
            TableName: this.todosTable,
            Key
          }).promise()
        console.log(`Deleted todo: ${Key.todoId} for user: ${Key.userId}`)
    }

    /**
     * updateItem - Update an Item
     * @param updateItem Object New todo params
     */
    async updateTodo(updateItem: UpdateTodoData): Promise<void>{
        const Key: TodoKey = {
            userId: updateItem.userId,
            todoId: updateItem.todoId
        }
        await this.docClient.update({
            TableName: this.todosTable,
            Key,
            UpdateExpression: `set done = :new_done`,
            ExpressionAttributeValues: {
                ":new_done": `${updateItem.done}`
            }
        }).promise()
        console.log(`Updated todo: ${Key}`)
    }

}
