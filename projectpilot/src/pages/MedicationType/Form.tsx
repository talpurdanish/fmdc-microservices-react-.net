import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputText } from "primereact/inputtext";
import { PlusIcon, RotateCcwIcon } from "lucide-react";

import { useEffect, useState } from "react";
import { medicationTypesService } from "../../BussinessLogic/Index.Service";

import { createMedicationTypeModel, type MedicationTypeModel } from "../../BussinessLogic/Models/MedicationType.Model";

import { FormErrors } from "../CommonWidgets/FormErrors";
import { createSchema, type CreateFormData } from "./Schemas";
import { useMutationApi } from "../../BussinessLogic/Hooks/UseMutationsApi";
import { showError, showSuccess } from "../../Helpers/Toast.Helper";

type Props = {
    isEdit: boolean;
    initialValues?: CreateFormData;
    loadData: () => void;
};

export const MedicationTypeForm = ({ isEdit, initialValues, loadData }: Props) => {
    const [buttonTitle, setButtonTitle] = useState<string>("Create");

    const schema = createSchema;

    const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateFormData>({
        resolver: zodResolver(schema),
        defaultValues: initialValues ?? { name: "", id: -1 },
    });

    // inside your component
    const { mutate: createOrUpdate } = useMutationApi<boolean, MedicationTypeModel>(
        (medicationType) => medicationTypesService.CreateOrUpdate(medicationType!), {
        optimisticUpdate: () => {
            handleReset();
            loadData();
        },
        onSuccess: () => {
            const operation = isEdit ? "updated" : "created";
            showSuccess(`Medication Type has been ${operation} successfully!`);

        },
        onError: () => {
            const operation = isEdit ? "updated" : "created";

            showError(`Medication Type could not be ${operation}!`);
        },

    });

    const onSubmit = async (data: CreateFormData) => {
        const raw = { id: isEdit ? data.id : -1, name: data.name };
        const medicationType = createMedicationTypeModel(raw);
        await createOrUpdate(medicationType);
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


