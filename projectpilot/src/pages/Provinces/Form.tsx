import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputText } from "primereact/inputtext";
import { PlusIcon, RotateCcwIcon } from "lucide-react";
import { createSchema, type CreateFormData } from "./Schemas";
import { useEffect, useState } from "react";
import { provincesService } from "../../BussinessLogic/Index.Service";

import { createProvinceModel, type ProvinceModel } from "../../BussinessLogic/Models/Province.Model";
import { FormErrors } from "../CommonWidgets/FormErrors";
import { useMutationApi } from "../../BussinessLogic/Hooks/UseMutationsApi";

type Props = {
    isEdit: boolean;
    initialValues?: CreateFormData;
    loadData: () => void;
};

export const ProvinceForm = ({ isEdit, initialValues, loadData }: Props) => {
    const [buttonTitle, setButtonTitle] = useState<string>("Create");
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

    const schema = createSchema;

    const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateFormData>({
        resolver: zodResolver(schema),
        defaultValues: initialValues ?? { name: "", id: -1 },
    });

    const { mutate: createOrUpdate } = useMutationApi<boolean, ProvinceModel>((data) => provincesService.CreateOrUpdate(data!), {
        optimisticUpdate: () => {
            handleReset();
            loadData();
        },
        onSuccess: () => {
            const operation = isEdit ? "updated" : "created";
            setSubmitSuccess(`Province has been ${operation} successfully!`);
            setSubmitError(null);
        },
        onError: () => {
            const operation = isEdit ? "updated" : "created";
            setSubmitSuccess(null);
            setSubmitError(`Province could not be ${operation}!`);
        },
    });

    const onSubmit = async (data: CreateFormData) => {
        const raw = { id: isEdit ? data.id : -1, name: data.name };
        const province = createProvinceModel(raw);

        await createOrUpdate(province);

    };
    const handleReset = () => {
        reset({
            id: -1,
            name: ""
        });
        isEdit = false;
        setButtonTitle("Create");

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
            <FormErrors errors={errors} submitError={submitError} submitSuccess={submitSuccess} width="100%" />

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


