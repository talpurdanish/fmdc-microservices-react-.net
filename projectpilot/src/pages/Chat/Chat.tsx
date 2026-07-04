import { useEffect, useRef, useState } from "react";
import { useMutationApi } from "../../BussinessLogic/Hooks/UseMutationsApi";
import { type ChatModel } from "../../BussinessLogic/Models/Chat.Model";
import { chatsService } from "../../BussinessLogic/Index.Service";
import type { ApiResponse } from "../../BussinessLogic/Models/Generics/ApiResponse";

type ChatMessage = {
    role: string;
    content: string;
    isError?: boolean;
};

function Chat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const [input, setInput] = useState("Hello");
    const endRef = useRef<HTMLDivElement | null>(null);
    const [sending, setSending] = useState<boolean>(false);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const { mutate: sendMessageCall } = useMutationApi<ApiResponse<ChatModel>, string>(
        (chat) => chatsService.Send(chat!)
    );

    // Timer state
    const [time, setTime] = useState(0); // milliseconds elapsed
    const intervalRef = useRef<number | null>(null);
    const startRef = useRef<number | null>(null);

    const startTimer = () => {
        setTime(0);
        startRef.current = Date.now();
        intervalRef.current = window.setInterval(() => {
            if (startRef.current) {
                setTime((Date.now() - startRef.current) / 1000);
            }
        }, 50);
    };

    const stopTimer = (): number => {
        let elapsed = 0;
        if (startRef.current) {
            elapsed = (Date.now() - startRef.current) / 1000;
        }
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setTime(0);
        startRef.current = null;
        return elapsed;
    };

    const sendMessage = async () => {
        if (input === "") return;
        startTimer();
        const newMessage: ChatMessage = { role: "user", content: input };
        setMessages([...messages, newMessage]);
        setSending(true);

        const res = await sendMessageCall(input);

        if (!res || res.error) {
            setSending(false);
            const errorMsg = res?.getMessageString() || "Something went wrong";
            const elapsed = stopTimer();
            setMessages((prev) => [
                ...prev,
                {
                    role: "ai",
                    content: `Error: ${errorMsg}`,
                    isError: true,
                },
                {
                    role: "meta",
                    content: `(replied in ${elapsed} secs)`,
                },
            ]);
        } else {
            setInput("");
            setSending(false);
            const elapsed = stopTimer();
            if (isParseableObject(res.result?.message ?? ""))


                setMessages((prev) => [
                    ...prev,
                    {
                        role: "ai",
                        content: res.result?.message ?? "",
                        isError: false,
                    },
                    {
                        role: "meta",
                        content: `(replied in ${elapsed} secs)`,
                    },
                ]);
        }
    };


    const isParseableObject = (message: string) => {
        try {
            const parsed = JSON.parse(message);
            return parsed != null && typeof parsed == "object";

        } catch {
            return false;
        }
    };

    useEffect(() => {
        return () => {
            if (intervalRef.current !== null) clearInterval(intervalRef.current);
        };
    }, []);

    return (
        <div className="border rounded border-gray-500 m-1 p-2">
            <div className="min-h-24 max-h-100 h-100 overflow-y-scroll space-y-2">
                {messages.map((m, i) => {
                    if (m.role === "meta") {
                        return (
                            <div key={i} className="flex justify-center">
                                <span className="text-xs text-gray-400 italic">{m.content}</span>
                            </div>
                        );
                    }
                    return (
                        <div
                            key={i}
                            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`
                  rounded-lg border px-3 py-2 max-w-[70%] wrap-break-word
                  ${m.role === "user"
                                        ? "bg-blue-600 text-white border-blue-500"
                                        : m.isError
                                            ? "bg-gray-800 text-red-500 border-red-500"
                                            : "bg-gray-700 text-white border-gray-500"}
                `}
                            >
                                <b className="uppercase mr-1">{m.role}:</b> {m.content}
                            </div>
                        </div>
                    );
                })}
                <div ref={endRef} />
            </div>
            <div className="flex">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="form-control border border-gray-500 w-[80%] flex-auto p-2"
                />
                <input
                    value={time}
                    readOnly
                    className="border bg-black text-white w-[10%] flex-auto mx-2 rounded text-center"
                />
                <button
                    onClick={sendMessage}
                    className="btn btn-success btn-rounded btn-padding-sm w-[10%] flex-auto"
                    disabled={sending}
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default Chat;