// models/TodoModel.ts

export interface TodoModel {
    id: number;
    userId: number;
    title: string;
    created: string;
    completed: boolean;
}

export function createTodoModel(raw: any): TodoModel {
    return {
        id: Number(raw.id ?? "0"),
        userId: Number(raw.userId ?? "0"),
        title: raw.title ?? "",
        created: raw.created ?? "",
        completed: Boolean(raw.completed ?? false),
    };
}

export function toJson(todo: TodoModel): any {
    return {
        id: todo.id,
        userId: todo.userId,
        title: todo.title,
        created: todo.created,
        completed: todo.completed,
    };
}


export interface CreateTodoModel {

    id: number,
    title: string
}