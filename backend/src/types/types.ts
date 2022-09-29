import * as TYPE_AWS from "aws-sdk";
import { PromiseResult } from "aws-sdk/lib/request";
import { TodoUpdate } from "../models/TodoUpdate";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";

export type EnvString = string | any
export type Result = PromiseResult <
    TYPE_AWS.DynamoDB.DocumentClient.QueryOutput,
    TYPE_AWS.AWSError
>
export type DbItems = TYPE_AWS.DynamoDB.DocumentClient.ItemList | undefined

export interface TodoKey {
    userId: string,
    todoId: string
}

export type CreateTodoData = TodoKey & CreateTodoRequest
export type UpdateTodoData = TodoKey & TodoUpdate