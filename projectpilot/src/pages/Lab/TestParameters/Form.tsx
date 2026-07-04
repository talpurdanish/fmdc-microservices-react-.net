import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputText } from "primereact/inputtext";
import { PlusIcon, RotateCcwIcon } from "lucide-react";

import { useEffect, useRef, useState } from "react";
import { testParametersService } from "../../../BussinessLogic/Index.Service";

import { createTestParameterModel, type TestParameterModel } from "../../../BussinessLogic/Models/TestParameter.Model";
import { FormErrors } from "../../CommonWidgets/FormErrors";

import { createSchema, type CreateFormData } from "./Schemas";
import { InputSwitch } from "primereact/inputswitch";

import { Dropdown } from "primereact/dropdown";
import { TextAreaWithCount } from "../../CommonWidgets/TextAreaWithCount";
import { useMutationApi } from "../../../BussinessLogic/Hooks/UseMutationsApi";
import { InputNumber } from "primereact/inputnumber";
import type { NameIdPair } from "../../../BussinessLogic/Models/Generics/NameIdPair";
import { showError, showSuccess } from "../../../Helpers/Toast.Helper";

type Props = {
    isEdit: boolean;
    initialValues?: CreateFormData;
    loadData: () => void;
    tests: NameIdPair[];
};

export const TestParameterForm = ({ isEdit, initialValues, loadData, tests }: Props) => {
    const [buttonTitle, setButtonTitle] = useState<string>("Create");
    const [femaleRangeVisible, setFemaleRangeVisible] = useState<boolean>(false);

    const dropdownRef = useRef<Dropdown | null>(null);

    const { register, handleSubmit, reset, control, setValue, clearErrors, formState: { errors } } = useForm<CreateFormData>({
        resolver: zodResolver(createSchema),
        defaultValues: {
            id: -1,
            name: "",
            maleMaxValue: 0.0,
            maleMinValue: 0.0,
            femaleMaxValue: 0.0,
            femaleMinValue: 0.0,
            unit: "",
            testId: -1,
            referenceRange: "",
            status: true,
            gender: false,
        },
    });


    const onShowFemaleRange = (value: boolean) => {
        setFemaleRangeVisible(value);
        setValue("gender", value);
    }

    const { mutate: createOrUpdate } = useMutationApi<boolean, TestParameterModel>((data) => testParametersService.CreateOrUpdate(data!), {
        optimisticUpdate: () => {
            handleReset();
            loadData();
        },
        onSuccess: () => {
            const operation = isEdit ? "updated" : "created";
            showSuccess(`Test Parameters has been ${operation} successfully!`);
        },
        onError: () => {
            const operation = isEdit ? "updated" : "created";
            showError(`Test Parameters could not be ${operation}!`);
        },
    });

    const onSubmit = async (data: CreateFormData) => {
        const raw = {
            id: isEdit ? data.id : -1,
            name: data.name,
            maleMaxValue: data.maleMaxValue,
            maleMinValue: data.maleMinValue,
            femaleMaxValue: data.femaleMaxValue,
            femaleMinValue: data.femaleMinValue,
            unit: data.unit,
            testId: data.testId,
            referenceRange: data.referenceRange,
            status: data.status,
            gender: data.gender
        };
        const testParameter = createTestParameterModel(raw);
        await createOrUpdate(testParameter);
    };
    const handleReset = () => {
        reset({
            id: -1,
            name: "",
            maleMaxValue: 0.0,
            maleMinValue: 0.0,
            femaleMaxValue: 0.0,
            femaleMinValue: 0.0,
            unit: "",
            testId: -1,
            referenceRange: "",
            status: true,
            gender: false
        });
        isEdit = false;
        setButtonTitle("Create");
        clearErrors();
    };

    useEffect(() => {
        if (initialValues) {
            reset(initialValues);
        }
        const btnTitle = isEdit ? "Update" : "Create";
        setButtonTitle(btnTitle);
    }, [initialValues]);

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="gap-0 w-full small-width">
                {isEdit && <input type="hidden" {...register("id")} />}

                <label className="form-label" htmlFor="name">Name:</label>
                <InputText
                    className="form-control"
                    type="text"
                    {...register("name")}
                />
                <label className="form-label">Male Valid Ranges:</label>
                <div className="flex gap-2 mt-2 ">
                    <div className="flex-1 content-stretch">
                        <Controller
                            {...register("maleMinValue")}
                            control={control}
                            render={({ field }) => (
                                <InputNumber
                                    value={field.value}
                                    onValueChange={(e) => field.onChange(e.value!)}
                                    className="form-control"
                                    mode="decimal"
                                    showButtons
                                    minFractionDigits={2}
                                    maxFractionDigits={5}
                                />
                            )}
                        />
                    </div>
                    <div className="flex-1">
                        <Controller
                            {...register("maleMaxValue")}
                            control={control}
                            render={({ field }) => (
                                <InputNumber
                                    value={field.value}
                                    onValueChange={(e) => field.onChange(e.value!)}
                                    className="form-control"
                                    mode="decimal"
                                    showButtons
                                    minFractionDigits={2}
                                    maxFractionDigits={5}
                                />
                            )}
                        />
                    </div>
                </div>
                <div className="flex">
                    <label className="form-label flex-1">Show Female Range:</label>
                    <InputSwitch checked={femaleRangeVisible} onChange={(e) => onShowFemaleRange(e.value)} className="my-2" />
                </div>
                {femaleRangeVisible && <label className="form-label">Female Valid Ranges:</label>}
                {femaleRangeVisible && <div className="flex gap-2 mt-2 ">
                    <Controller
                        {...register("femaleMaxValue")}
                        control={control}
                        render={({ field }) => (
                            <InputNumber
                                value={field.value}
                                onValueChange={(e) => field.onChange(e.value!)}
                                className="form-control"
                                mode="decimal"
                                showButtons
                                minFractionDigits={2}
                                maxFractionDigits={5}
                            />
                        )}
                    />
                    <Controller
                        {...register("femaleMinValue")}
                        control={control}
                        render={({ field }) => (
                            <InputNumber
                                value={field.value}
                                onValueChange={(e) => field.onChange(e.value!)}
                                className="form-control"
                                mode="decimal"
                                showButtons
                                minFractionDigits={2}
                                maxFractionDigits={5}
                            />
                        )}
                    />
                </div>}
                <label className="form-label" htmlFor="unit">Unit:</label>
                <InputText
                    className="form-control"
                    type="text"
                    {...register("unit")}
                />

                <label className="form-label" htmlFor="provinceId">Test:</label>
                <Controller
                    {...register("testId")}
                    control={control}
                    render={({ field }) => (
                        <Dropdown
                            ref={dropdownRef}
                            value={field.value}
                            onChange={field.onChange}
                            options={tests!}
                            showClear
                            optionValue="id"
                            optionLabel="name"
                            placeholder="Select a Test"
                            className="form-select"
                        />)}
                />
                <label className="form-label" htmlFor="referenceRange">Reference Range:</label>
                <Controller
                    {...register("referenceRange")}
                    control={control}
                    render={({ field }) => (
                        <TextAreaWithCount
                            value={field.value || ""}
                            onChange={field.onChange}
                            maxLength={1000}
                        />
                    )}
                />
                <div className="grid grid-cols-5">
                    <label className="form-label col-span-4">Status:</label>
                    <Controller
                        {...register("status")}
                        control={control}
                        render={({ field }) => (
                            <InputSwitch checked={field?.value!} onChange={field.onChange} className="my-2" />
                        )}
                    />
                </div>
                <FormErrors errors={errors} width="100%" />
                <div className="flex mt-2">
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
            </form >
        </>
    );
};


