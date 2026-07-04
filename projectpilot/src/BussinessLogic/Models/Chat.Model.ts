export interface ChatModel {
    message: string;
    model: string;
}

export function createChatModel(raw: any): ChatModel {
    return {
        message: raw.message ?? "",
        model: raw.model ?? ""
    }
}


export function toJson(chat: ChatModel): any {
    return {
        'message': chat.message,
        "model": chat.model
    }
}