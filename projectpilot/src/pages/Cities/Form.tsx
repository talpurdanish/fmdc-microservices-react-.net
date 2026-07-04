import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputText } from "primereact/inputtext";
import { Dropdown, type DropdownChangeEvent } from "primereact/dropdown";
import { PlusIcon, RotateCcwIcon } from "lucide-react";
import { createSchema, type FormData } from "./Schemas";
import { useEffect, useRef, useState } from "react";
import { createCityModel, type CityModel } from "../../BussinessLogic/Models/City.Model";
import { citiesService } from "../../BussinessLogic/Index.Service";

import { FormErrors } from "../CommonWidgets/FormErrors";
import { useMutationApi } from "../../BussinessLogic/Hooks/UseMutationsApi";
import type { NameIdPair } from "../../BussinessLogic/Models/Generics/NameIdPair";
import { showError, showSuccess } from "../../Helpers/Toast.Helper";

type Props = {
    isEdit: boolean;
    initialValues?: FormData;
    loadData: () => void;
    provinces: NameIdPair[];
};

export const CityForm = ({ isEdit, initialValues, loadData, provinces }: Props) => {

    const [buttonTitle, setButtonTitle] = useState<string>("Create");
    const [pId, setPId] = useState<number>(-1);
    const dropdownRef = useRef<Dropdown>(null);

    const schema = createSchema;

    // inside your component
    const { mutate: createOrUpdate } = useMutationApi<boolean, CityModel>((city) => citiesService.CreateOrUpdate(city),
        {
            optimisticUpdate: () => {
                handleReset();
                loadData();
            },
            onSuccess: () => {
                const operation = isEdit ? "updated" : "created";
                showSuccess(`City has been ${operation} successfully!`);
            },
            onError: () => {
                const operation = isEdit ? "updated" : "created";
                showError(`City could not be ${operation}`);
            }
        }
    );

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: initialValues ?? { name: "", provinceId: 0, id: -1 },
    });

    const onProvinceChange = (id: number) => {
        setPId(id);
    };

    const onSubmit = async (data: FormData) => {
        const raw = { id: isEdit ? data.id : -1, name: data.name, provinceId: pId };
        const city = createCityModel(raw);
        await createOrUpdate(city);
    };

    const handleReset = () => {
        reset({
            id: -1,
            name: "",
            provinceId: 0,
        });
        setPId(0);
        isEdit = false;
        setButtonTitle("Create");
        dropdownRef?.current?.clear();
    };

    useEffect(() => {

        if (initialValues) {
            reset(initialValues);
            setPId(initialValues.provinceId);
        } else {
            handleReset();
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
            <label className="form-label" htmlFor="provinceId">Province:</label>
            <Dropdown
                ref={dropdownRef}
                value={pId}
                onChange={(e: DropdownChangeEvent) => onProvinceChange(e.value)}
                options={provinces!}
                showClear
                optionValue="id"
                optionLabel="name"
                placeholder="Select a Province"
                className="form-control"
            />
            <FormErrors errors={errors} width="100%" />

            <div className="flex">
                <button
                    type="submit"
                    className="btn btn-success m-1 btn-rounded btn-padding-md">
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


