import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputText } from "primereact/inputtext";
import { PlusIcon, RotateCcwIcon } from "lucide-react";

import { useEffect, useRef, useState } from "react";
import { medicationsService } from "../../BussinessLogic/Index.Service";

import { createMedicationModel, type MedicationModel } from "../../BussinessLogic/Models/Medication.Model";

import { FormErrors } from "../CommonWidgets/FormErrors";
import { createSchema, type CreateFormData } from "./Schemas";
import { TextAreaWithCount } from "../CommonWidgets/TextAreaWithCount";

import { Dropdown } from "primereact/dropdown";
import { useMutationApi } from "../../BussinessLogic/Hooks/UseMutationsApi";
import type { NameIdPair } from "../../BussinessLogic/Models/Generics/NameIdPair";
import { showError, showSuccess } from "../../Helpers/Toast.Helper";

type Props = {
    isEdit: boolean;
    initialValues?: CreateFormData;
    loadData: () => void;
    types: NameIdPair[];
};

export const MedicationForm = ({ isEdit, initialValues, loadData, types }: Props) => {
    const [buttonTitle, setButtonTitle] = useState<string>("Create");

    const schema = createSchema;
    const dropdownRef = useRef<Dropdown | null>(null);

    const { register, handleSubmit, reset, control, formState: { errors } } = useForm<CreateFormData>({
        resolver: zodResolver(schema),
        defaultValues: initialValues ?? {
            code: -1,
            name: "",
            brand: "",
            description: "",
            typeID: -1
        },
    });


    const { mutate: createOrUpdate } = useMutationApi<boolean, MedicationModel>((medication) => medicationsService.CreateOrUpdate(medication!), {
        optimisticUpdate: () => {
            handleReset();
            loadData();
        },
        onSuccess: () => {
            const operation = isEdit ? "updated" : "created";
            showSuccess(`Medication has been ${operation} successfully!`);

        },
        onError: () => {
            const operation = isEdit ? "updated" : "created";
            showError(`Medication could not be ${operation}!`);
        },
    });

    const onSubmit = async (data: CreateFormData) => {
        const raw = {
            code: isEdit ? data.code : -1,
            name: data.name,
            brand: data.brand,
            description: data.description,
            typeID: data.typeID
        };
        const medication = createMedicationModel(raw);
        await createOrUpdate(medication);

    };

    const handleReset = () => {
        reset({
            code: -1,
            name: "",
            brand: "",
            description: "",
            typeID: -1
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
            {isEdit && <input type="hidden" {...register("code")} />}
            <label className="form-label" htmlFor="name">Name:</label>
            <InputText
                className="form-control"
                type="text"
                {...register("name")}
            />
            <label className="form-label" htmlFor="brand">Brand:</label>
            <InputText
                className="form-control"
                type="text"
                {...register("brand")}
            />
            <label className="form-label" htmlFor="typeID">Type:</label>
            <Controller
                {...register("typeID")}
                control={control}
                render={({ field }) => (
                    <Dropdown
                        ref={dropdownRef}
                        value={field.value}
                        onChange={field.onChange}
                        options={types!}
                        showClear
                        optionValue="id"
                        optionLabel="name"
                        placeholder="Select a Type"
                        className="form-control"
                    />
                )}
            />
            <label className="form-label" htmlFor="description">Description:</label>
            <Controller
                name="description"
                control={control}
                render={({ field }) => (
                    <TextAreaWithCount
                        value={field.value || ""}
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