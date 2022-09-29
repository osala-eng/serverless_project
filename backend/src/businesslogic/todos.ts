import { TodoAccess } from "../dataLayer/todosAccess";
import { TodoItem } from "../models/TodoItem";
import { CreateTodoData, TodoKey, UpdateTodoData } from "../types/types";


export async function getTodosForUser(todosId: string): Promise<TodoItem[]> {
    const data: TodoAccess = new TodoAccess()
    return data.getTodos(todosId)
}

export async function todosExists(userId: string): Promise<boolean>{
    const data: TodoAccess = new TodoAccess()
    return data.todosExist(userId)
}

export async function createTodo(createTodo: CreateTodoData): Promise<TodoItem> {
    const data: TodoAccess = new TodoAccess()
    const newTodo: TodoItem = {
        ...createTodo,
        createdAt: new Date().toISOString(),
        done: false
    }
    return data.createTodo(newTodo)
}

export const deleteTodo = async (Key: TodoKey): Promise<string> => {
    const data: TodoAccess = new TodoAccess()
    return data.deleteTodo(Key)
}

export const updateTodo = async (updateItem: UpdateTodoData): Promise<TodoItem> => {
    const data: TodoAccess = new TodoAccess()
    return data.updateTodo(updateItem)
}

export const createAttachmentPresignedUrl = (todoId: string): string => {
    const data: TodoAccess = new TodoAccess()
    return data.generateSignedUrl(todoId)
}

