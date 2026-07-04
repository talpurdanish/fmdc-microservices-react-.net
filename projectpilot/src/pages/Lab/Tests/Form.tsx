import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";

import { PlusIcon, RotateCcwIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { testsService } from "../../../BussinessLogic/Index.Service";
import { createTestModel, type TestModel } from "../../../BussinessLogic/Models/Test.Model";
import { FormErrors } from "../../CommonWidgets/FormErrors";
import { createSchema, type CreateFormData } from "./Schemas";
import { TextAreaWithCount } from "../../CommonWidgets/TextAreaWithCount";
import { useMutationApi } from "../../../BussinessLogic/Hooks/UseMutationsApi";
import { showError, showSuccess } from "../../../Helpers/Toast.Helper";

type Props = {
    isEdit: boolean;
    initialValues?: CreateFormData;
    loadData: () => void;
};

export const TestForm = ({ isEdit, initialValues, loadData }: Props) => {
    const [buttonTitle, setButtonTitle] = useState<string>("Create");

    const schema = createSchema;
    const dropdownRef = useRef<Dropdown | null>(null);

    const { register, handleSubmit, reset, control, formState: { errors } } = useForm<CreateFormData>({
        resolver: zodResolver(schema),
        defaultValues: initialValues ?? {
            id: 0,
            name: "",
            cost: 0,
            description: ""
        },
    });

    const { mutate: createOrUpdate } = useMutationApi<boolean, TestModel>((data) => testsService.CreateOrUpdate(data!), {
        optimisticUpdate: () => {
            handleReset();
            loadData();
        },
        onSuccess: () => {
            const operation = isEdit ? "updated" : "created";
            showSuccess(`Test has been ${operation} successfully!`);

        },
        onError: () => {
            const operation = isEdit ? "updated" : "created";
            showError(`Test could not be ${operation}!`);
        },
    });

    const onSubmit = async (data: CreateFormData) => {
        const raw = {
            id: isEdit ? data.id : -1,
            name: data.name,
            description: data.description,
            cost: data.cost ?? 0
        };
        const test = createTestModel(raw);
        await createOrUpdate(test);
    };
    const handleReset = () => {
        reset({
            id: 0,
            name: "",
            cost: 0,
            description: ""
        });
        isEdit = false;
        setButtonTitle("Create");
        dropdownRef?.current?.clear();
    };

    useEffect(() => {
        if (initialValues) {
            reset(initialValues);
        }
        const btnTitle = isEdit ? "Update" : "Create";
        setButtonTitle(btnTitle);
    }, [initialValues, reset]);

    return (

        <form onSubmit={handleSubmit(onSubmit)} className="items-center">
            {isEdit && <input type="hidden" {...register("id")} />}
            <label className="form-label" htmlFor="name">Name:</label>
            <InputText
                className="form-control"
                type="text"
                {...register("name")}
            />
            <label className="form-label" htmlFor="cost">Cost:</label>
            <Controller
                control={control}
                {...register("cost")}
                render={({ field }) => (
                    <InputNumber
                        value={field.value}
                        onValueChange={(e) => field.onChange(e.value!)}
                        className="form-control"
                        mode="decimal"
                        showButtons
                        minFractionDigits={2}
                        maxFractionDigits={2}
                        min={0}
                        step={10}
                    />
                )} />
            <label className="form-label" htmlFor="description">Description:</label>
            <Controller
                name="description"
                control={control}
                render={({ field }) => (
                    <TextAreaWithCount
                        value={field.value}
                        onChange={field.onChange}
                        maxLength={1000}
                    />
                )}
            />
            <FormErrors errors={errors} width="100%" />
            <div className="flex">
                <button
                    type="submit"
                    className="btn btn-success  btn-rounded m-1 btn-padding-md">
                    <PlusIcon className="w-[25px]" />
                    <span className="w-[85%]">{buttonTitle}</span>
                </button>
                <button
                    type="button" onClick={() => handleReset()}
                    className="btn btn-danger m-1 btn-rounded btn-padding-md">
                    <RotateCcwIcon className="w-[25px]" />
                    <span className="w-[85%]">Reset</span>
                </button>
            </div>
        </form>
    );
};