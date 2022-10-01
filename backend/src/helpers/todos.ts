import { TodoAccess } from "./todosAccess";
import { TodoItem } from "../models/TodoItem";
import { CreateTodoData, TodoKey, UpdateTodoData } from "../types/types";

/**
 * Get Todos for the current user
 * @param todoId string
 * @returns Array of Todo items
 */
export async function getTodosForUser(todoId: string): Promise<TodoItem[]> {
    const data: TodoAccess = new TodoAccess()
    return data.getTodos(todoId)
}

/**
 * Ccheck if todo exists
 * @param userId string
 * @returns boolean
 */
export async function todosExists(userId: string): Promise<boolean>{
    const data: TodoAccess = new TodoAccess()
    return data.todosExist(userId)
}

/**
 * Create a todo
 * @param createTodo Object CreateTodoData
 * @returns Object Todo Item
 */
export async function createTodo(createTodo: CreateTodoData): Promise<TodoItem> {
    const data: TodoAccess = new TodoAccess()
    const newTodo: TodoItem = {
        ...createTodo,
        createdAt: new Date().toISOString(),
        done: false
    }
    return data.createTodo(newTodo)
}

/**
 * deleteTodo
 * @param Key Object TodoKey
 * @returns Promise void
 */
export const deleteTodo = async (Key: TodoKey): Promise<void> => {
    const data: TodoAccess = new TodoAccess()
    return data.deleteTodo(Key)
}

/**
 * Update a todo Item
 * @param updateItem Object UpdateTodoData
 * @returns Promise void
 */
export const updateTodo = async (updateItem: UpdateTodoData): Promise<void> => {
    const data: TodoAccess = new TodoAccess()
    return data.updateTodo(updateItem)
}

/**
 * Create a presigned url from S3 bucket
 * @param todoId string
 * @returns string url
 */
export const createAttachmentPresignedUrl = (todoId: string): string => {
    const data: TodoAccess = new TodoAccess()
    return data.generateSignedUrl(todoId)
}

