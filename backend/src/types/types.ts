import * as TYPE_AWS from "aws-sdk";
import { PromiseResult } from "aws-sdk/lib/request";
import * as winston from "winston";
import { TodoUpdate } from "../models/TodoUpdate";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";

/**
 * Environment string
 */
export type EnvString = string | any


/**
 * AWS DynamoDb result
 */
export type Result = PromiseResult <
    TYPE_AWS.DynamoDB.DocumentClient.QueryOutput,
    TYPE_AWS.AWSError
>

/**
 * AWS DynamoDB Items
 */
export type DbItems = TYPE_AWS.DynamoDB.DocumentClient.ItemList | undefined

/**
 * Interface to impelement a todo key
 * @userId string
 * @todoId String
 */
export interface TodoKey {
    userId: string,
    todoId: string
}

/**
 * Custom CreatTodoData
 */
export type CreateTodoData = TodoKey & CreateTodoRequest

/**
 * Custom UpdateTodoData
 */
export type UpdateTodoData = TodoKey & TodoUpdate

/**
 * jwks module
 * @JwkKey jwk key object
 * @RootObject jwk key object array
 */
export declare module jwks {

    export interface JwkKey {
        alg: string;
        kty: string;
        use: string;
        n: string;
        e: string;
        kid: string;
        x5t: string;
        x5c: string[];
    }

    export interface RootObject {
        keys: JwkKey[];
    }
}

/**
 * Begin certificate string
 */
export const BEGIN_CERT: string = `-----BEGIN CERTIFICATE-----`

/**
 * End certificate string
 */
export const END_CERT: string = `-----END CERTIFICATE-----`

/**
 * Logger for local logs
 */
export declare module Logs {
    export type Logger =  winston.Logger
    export type Error = any
}

