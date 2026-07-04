// api/TodoService.ts
import type { IApiClient } from "./Generics/IApiClient";
import createDefaultFilter, { convertFilter as convertFilter, type Filter } from "../Models/Generics/Filter";
import { createTodoModel, type TodoModel, type CreateTodoModel } from "../Models/Todo.Model";

const baseUri = "/todos";

export class TodoService {
    constructor(private client: IApiClient) { }

    async GetTodos(filter?: Filter): Promise<TodoModel[]> {
        filter = !filter ? createDefaultFilter() : filter;
        const res = await this.client.get<TodoModel>(baseUri, convertFilter(filter), createTodoModel);
        return res.results ?? [];
    }

    async GetTodo(id: number): Promise<TodoModel | null> {
        if (id <= 0) return null;
        const res = await this.client.get<TodoModel>(`${baseUri}/${id}`, null, createTodoModel);
        return res.result ?? null;
    }

    async CreateOrUpdate(todo: CreateTodoModel): Promise<boolean> {
        if (!todo) return false;
        const url = todo.id > 0 ? `${baseUri}/${todo.id}` : baseUri;
        const res = await this.client.post<boolean>(url, { id: todo.id, title: todo.title });
        return res.result ?? false;
    }

    async Delete(ids: number[]): Promise<boolean> {
        if (!ids || ids.length === 0) return false;
        const url = `${baseUri}/manage/`;
        const res = await this.client.post<boolean>(url, { ids: ids.join(","), type: 2 });
        return res.result ?? false;
    }

    async MarkComplete(ids: number[]): Promise<boolean> {
        if (!ids || ids.length === 0) return false;
        const url = `${baseUri}/manage/`;
        const res = await this.client.post<boolean>(url, { ids: ids.join(","), type: 1 });
        return res.result ?? false;
    }
}