
import { SquareCheckIcon, SquareIcon, SquarePenIcon, TrashIcon } from "lucide-react";
import { type TodoModel } from "../../BussinessLogic/Models/Todo.Model";
import { todosService } from "../../BussinessLogic/Index.Service";
import { TodoForm } from "./Form";

import { useCallback, useState } from "react";
import { useGetApi } from "../../BussinessLogic/Hooks/UseGetApi";

import { useMutationApi } from "../../BussinessLogic/Hooks/UseMutationsApi";
import { showError, showSuccess } from "../../Helpers/Toast.Helper";

export const TodoTable = (() => {

    const [editIndices, setEditIndices] = useState<Set<number>>(new Set());
    const size = 20;

    const fetchTodos = useCallback(() =>
        todosService.GetTodos(),
        []);

    const { data: todos, refetch } = useGetApi<TodoModel[]>(
        fetchTodos,
        { immediate: true, payload: [] },
        []
    );

    const { mutate: deleteCall } = useMutationApi<boolean, number[]>((id) => todosService.Delete(id!), {
        optimisticUpdate: () => {
            refetch();
        },
        onSuccess: () => {
            showSuccess("Todo has been deleted");
        },
        onError: () => {
            showError("Todo could not be deleted");
        },
    });


    const { mutate: markCompleteCall } = useMutationApi<boolean, number[]>((id) => todosService.MarkComplete(id!), {
        optimisticUpdate: () => {
            refetch();
        },
        onSuccess: () => {
            showSuccess("Todo status has been changed");
        },
        onError: () => {
            showError("Todo status could not be chnaged");
        },
    });

    const deleteTodo = async (id: number) => {
        const ids = [id];
        await deleteCall(ids);
    };

    const loadDataAndResetEdit = (id: number) => {
        if (id)
            toggleEdit(id, false);
        refetch();
    }

    const toggleEdit = (index: number, off: boolean) => {
        setEditIndices((prev) => {
            const newSet = new Set(prev);
            !off ? newSet.delete(index) : newSet.add(index);
            return newSet;
        });
    };

    const markComplete = async (id: number) => {
        const ids = [id];
        await markCompleteCall(ids);
    };


    const itemTemplate = (todo: TodoModel) => {
        const isEdit = editIndices.has(todo.id);

        return isEdit ? <TodoForm isEdit={isEdit} loadData={() => loadDataAndResetEdit(todo.id)} size={size}
            initialValues={{ id: todo.id, title: todo.title }} key={todo.id} />
            :
            <div className="flex flex-row items-center gap-2 border dark:border-gray-600 border-gray-400 p-2 mb-1" key={todo.id}>
                <input type="checkbox" className="flex" checked={todo.completed} readOnly />
                <p className="flex-1 items-center">{todo.title}</p>
                <button className="flex btn btn-transparent btn-trans-warning" onClick={() => { toggleEdit(todo.id, true); }}>
                    <SquarePenIcon size={size} /></button>
                <button className="flex btn btn-transparent btn-trans-info"
                    onClick={() => markComplete(todo.id)}>
                    {!todo.completed ? <SquareCheckIcon size={size} /> : <SquareIcon size={size} />}
                </button>
                <button className="flex btn btn-transparent btn-trans-danger"
                    onClick={() => deleteTodo(todo.id)}>
                    <TrashIcon size={size} />
                </button>
            </div>
    };


    return (
        <>
            <TodoForm loadData={refetch} size={size} />

            {todos && <ul>
                {todos!.map((item) => {
                    return <li key={item.id}>{itemTemplate(item)}</li>
                })}

            </ul>
            }

            {!todos && <p> no Todos found</p>}
        </>
    );
});