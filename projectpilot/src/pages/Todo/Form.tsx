import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputText } from "primereact/inputtext";
import { RotateCcwIcon, SaveIcon, XIcon } from "lucide-react";

import { useEffect } from "react";
import { todosService } from "../../BussinessLogic/Index.Service";

import { createTodoModel, type TodoModel } from "../../BussinessLogic/Models/Todo.Model";
import { createSchema, type CreateFormData } from "./Schemas";


import { useMutationApi } from "../../BussinessLogic/Hooks/UseMutationsApi";
import { showError, showSuccess, showWarning } from "../../Helpers/Toast.Helper";

type Props = {
    isEdit?: boolean;
    initialValues?: CreateFormData;
    loadData: (id?: number) => void;
    size: number;
};

export const TodoForm = ({ isEdit, initialValues, loadData, size }: Props) => {

    const schema = createSchema;

    const { register, handleSubmit, reset } = useForm<CreateFormData>({
        resolver: zodResolver(schema),
        defaultValues: initialValues ?? {
            id: -1,
            title: ""
        },
    });

    const onError = () => {
        showWarning("Title is required");
    };

    const { mutate: createOrUpdate } = useMutationApi<boolean, TodoModel>((data) => todosService.CreateOrUpdate(data!), {
        optimisticUpdate: (data?: TodoModel) => {
            handleReset();
            loadData(data?.id);
        },
        onSuccess: () => {
            const operation = isEdit ? "updated" : "created";
            showSuccess(`Todo has been ${operation} successfully!`);
        },
        onError: () => {
            const operation = isEdit ? "updated" : "created";
            showError(`Todo could not be ${operation}!`);
        },
    });

    const onSubmit = async (data: CreateFormData) => {
        const raw = {
            id: isEdit ? data.id : -1,
            title: data.title
        };
        const todo = createTodoModel(raw);
        await createOrUpdate(todo);
    };
    const handleReset = () => {
        reset({
            id: -1,
            title: ""
        });
        if (isEdit)
            loadData(initialValues?.id!);
        isEdit = false;
    };

    useEffect(() => {
        if (initialValues) {
            reset(initialValues);
        }
    }, [initialValues, reset]);

    return (
        <>

            <form onSubmit={handleSubmit(onSubmit, onError)}
                className="flex flex-row items-center gap-2 ">
                {isEdit && <input type="hidden" {...register("id")} />}
                <InputText
                    className="form-control flex-1"
                    type="text"
                    {...register("title")}
                />
                <button
                    type="submit"
                    className="btn btn-transparent btn-trans-success flex items-center gap-1">
                    <SaveIcon size={size} />
                </button>
                <button
                    type="button"
                    onClick={() => handleReset()}
                    className="btn btn-transparent btn-trans-danger flex items-center gap-1">
                    {isEdit ? <XIcon size={size} /> : <RotateCcwIcon size={size} />}
                </button>
            </form>
        </>
    );
};