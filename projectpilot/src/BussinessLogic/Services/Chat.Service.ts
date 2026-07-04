// api/ChatService.ts
import type { IApiClient } from "./Generics/IApiClient";
import { type ChatModel, createChatModel } from "../Models/Chat.Model";
import type { ApiResponse } from "../Models/Generics/ApiResponse";

const baseUri = "/chats";


export class ChatService {

    constructor(private client: IApiClient) { }

    async GetChats(): Promise<ChatModel[]> {

        const res = await this.client.get<ChatModel>(baseUri, null, createChatModel);
        return res.results ?? [];
    }

    async GetMessage(): Promise<ChatModel | null> {

        const res = await this.client.get<ChatModel>(baseUri, null, createChatModel);
        return res.result ?? null;
    }

    async Send(message: string): Promise<ApiResponse<ChatModel>> {
        const url = `${baseUri}/Google`;
        const res = await this.client.post<ChatModel>(url, { message }, createChatModel);
        return res;
    }


    async Delete(id: number): Promise<boolean> {
        if (id <= 0) return false;
        const res = await this.client.delete<boolean>(`${baseUri}/${id}`);
        return res.result ?? false;
    }
}