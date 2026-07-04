import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputText } from "primereact/inputtext";
import { PlusIcon, RotateCcwIcon } from "lucide-react";

import { useEffect, useRef, useState } from "react";
import { proceduresService } from "../../BussinessLogic/Index.Service";


import { createProcedureModel, type ProcedureModel } from "../../BussinessLogic/Models/Procedure.Model";

import { FormErrors } from "../CommonWidgets/FormErrors";
import { createSchema, type CreateFormData } from "./Schemas";

import { type ProcedureTypeModel } from "../../BussinessLogic/Models/ProcedureType.Model";

import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";

import { useMutationApi } from "../../BussinessLogic/Hooks/UseMutationsApi";
import { showError, showSuccess } from "../../Helpers/Toast.Helper";

type Props = {
    isEdit: boolean;
    initialValues?: CreateFormData;
    loadData: () => void;
    types: ProcedureTypeModel[];
};

export const ProcedureForm = ({ isEdit, initialValues, loadData, types }: Props) => {
    const [buttonTitle, setButtonTitle] = useState<string>("Create");
    const schema = createSchema;
    const dropdownRef = useRef<Dropdown | null>(null);

    const { register, handleSubmit, reset, control, formState: { errors } } = useForm<CreateFormData>({
        resolver: zodResolver(schema),
        defaultValues: initialValues ?? {
            id: -1,
            name: "",
            cost: 0,
            typeID: -1
        },
    });


    const { mutate: createOrUpdate } = useMutationApi<boolean, ProcedureModel>((procedure) => proceduresService.CreateOrUpdate(procedure!), {

        optimisticUpdate: () => {
            handleReset();
            loadData();
        },
        onSuccess: () => {
            const operation = isEdit ? "updated" : "created";

            showSuccess(`Procedure has been ${operation} successfully!`);


        },
        onError: () => {
            const operation = isEdit ? "updated" : "created";
            showError(`Procedure could not be ${operation}!`);
        },

    });

    const onSubmit = async (data: CreateFormData) => {
        const raw = {
            id: isEdit ? data.id : -1,
            name: data.name,
            cost: data.cost,
            typeID: data.typeID
        };
        const procedure = createProcedureModel(raw);

        await createOrUpdate(procedure);

    };
    const handleReset = () => {
        reset({
            id: -1,
            name: "",
            cost: 0,
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
                defaultValue={0}
                render={({ field }) => (
                    <div>
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
                    </div>
                )} />
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