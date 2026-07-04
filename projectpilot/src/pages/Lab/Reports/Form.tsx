import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, RotateCcwIcon } from "lucide-react";

import { useEffect, useRef, useState } from "react";
import { labReportsService, patientsService, testsService, usersService } from "../../../BussinessLogic/Index.Service";

import { FormErrors } from "../../CommonWidgets/FormErrors";

import { createSchema, type CreateFormData } from "./Schemas";


import { Dropdown } from "primereact/dropdown";
import { TextAreaWithCount } from "../../CommonWidgets/TextAreaWithCount";
import { useMutationApi } from "../../../BussinessLogic/Hooks/UseMutationsApi";

import { Calendar } from "primereact/calendar";
import { createLabReportModelDTO, type LabReportModelDTO } from "../../../BussinessLogic/Models/Create.Lab.Report.Model";
import { useGetApi } from "../../../BussinessLogic/Hooks/UseGetApi";
import { type TestModel } from "../../../BussinessLogic/Models/Test.Model";
import { type PatientModel } from "../../../BussinessLogic/Models/Patient.Model";
import { type NameIdPair } from "../../../BussinessLogic/Models/Generics/NameIdPair";
import { showError, showSuccess } from "../../../Helpers/Toast.Helper";
import { parse } from "date-fns/parse";


type Props = {
    isEdit: boolean;
    initialValues?: CreateFormData;
    loadData: () => void;
};

export const LabReportsForm = ({ isEdit, initialValues, loadData }: Props) => {
    const [buttonTitle, setButtonTitle] = useState<string>("Create");

    const dropdownRefTestId = useRef<Dropdown | null>(null);
    const dropdownRefPatientId = useRef<Dropdown | null>(null);
    const dropdownRefDoctorId = useRef<Dropdown | null>(null);

    const { register, handleSubmit, reset, control, clearErrors, formState: { errors } } = useForm<CreateFormData>({
        resolver: zodResolver(createSchema),
        defaultValues: initialValues ?? {
            id: -1,
            deliveryDate: new Date(),
            testId: 0,
            patientId: 0,
            doctorId: 0,
            note: ""
        },
    });

    const { data: tests } = useGetApi<NameIdPair[]>(
        async () => {
            const models: TestModel[] = (await testsService.GetTests(true)).data;
            return models.map(p => ({
                id: p.id,
                name: p.name,
            }));
        },
        { immediate: true },
    );

    const { data: patients } = useGetApi<NameIdPair[]>(
        async () => {
            const models: PatientModel[] = (await patientsService.GetPatients(true)).data;
            return models.map(p => ({
                id: p.id,
                name: p.name,
            }));
        },
        { immediate: true }
    );

    const { data: doctors } = useGetApi<NameIdPair[]>(
        () => usersService.GetDoctors(),
        { immediate: true },
    );

    const { mutate: createOrUpdate } = useMutationApi<boolean, LabReportModelDTO>((data) => labReportsService.CreateOrUpdate(data!), {
        optimisticUpdate: () => {
            handleReset();
            loadData();
        },
        onSuccess: () => {
            const operation = isEdit ? "updated" : "created";
            showSuccess(`Lab Reports has been ${operation} successfully!`);
        },
        onError: () => {
            const operation = isEdit ? "updated" : "created";
            showError(`Lab Reports could not be ${operation}!`);
        },
    });

    const onSubmit = async (data: CreateFormData) => {
        const raw = {
            id: isEdit ? data.id : -1,
            reportDeliveryDate: data.deliveryDate,
            reportDeliveryTime: data.deliveryDate.getHours() + ":" + data.deliveryDate.getMinutes(),
            testId: data.testId,
            patientId: data.patientId,
            doctorId: data.doctorId,
            note: data.note
        };
        const labReport = createLabReportModelDTO(raw);
        await createOrUpdate(labReport);
    };
    const handleReset = () => {
        reset({
            id: -1,
            deliveryDate: new Date(),
            testId: 0,
            patientId: 0,
            doctorId: 0,
            note: ""
        });
        isEdit = false;
        setButtonTitle("Create");
        clearErrors();
    };

    const fillValues = () => {

        reset({
            id: -1,
            deliveryDate: parse("24/04/2026", "dd/mm/yyyy", new Date()),
            testId: 1,
            patientId: 1,
            doctorId: 1,
            note: "test Note"
        });

    }


    useEffect(() => {
        if (initialValues) {
            reset({
                deliveryDate: initialValues.deliveryDate,
                testId: initialValues.testId,
                patientId: initialValues.patientId,
                doctorId: initialValues.doctorId,
                note: initialValues.note
            });
        }
        const btnTitle = isEdit ? "Update" : "Create";
        setButtonTitle(btnTitle);

    }, [initialValues]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {isEdit && <input type="hidden" {...register("id")} />}
            <label className="form-label" htmlFor="deliveryDate">Delivery Date & Time:</label>
            <Controller
                {...register("deliveryDate")}
                control={control}
                render={({ field }) => {
                    return (
                        <Calendar
                            className="form-control"
                            showIcon
                            value={field.value}
                            onChange={(e) => field.onChange(e.value)}
                            minDate={new Date()}
                            dateFormat="dd/mm/yy"
                            showTime
                        />
                    )
                }}
            />
            <label className="form-label" htmlFor="testId">Test:</label>
            <Controller
                {...register("testId")}
                control={control}
                render={({ field }) => (
                    <Dropdown
                        ref={dropdownRefTestId}
                        value={field.value}
                        onChange={field.onChange}
                        options={tests!}
                        showClear
                        optionValue="id"
                        optionLabel="name"
                        placeholder="Select a Test"
                        className="form-control"
                    />)}
            />
            <label className="form-label" htmlFor="patientId">Patient:</label>
            <Controller
                {...register("patientId")}
                control={control}
                render={({ field }) => (
                    <Dropdown
                        ref={dropdownRefPatientId}
                        value={field.value}
                        onChange={field.onChange}
                        options={patients!}
                        showClear
                        optionValue="id"
                        optionLabel="name"
                        placeholder="Select a Patient"
                        className="form-control"
                    />)}
            />
            <label className="form-label" htmlFor="doctorId">Doctor:</label>
            <Controller
                {...register("doctorId")}
                control={control}
                render={({ field }) => (
                    <Dropdown
                        ref={dropdownRefDoctorId}
                        value={field.value}
                        onChange={field.onChange}
                        options={doctors!}
                        showClear
                        optionValue="id"
                        optionLabel="name"
                        placeholder="Select a Doctor"
                        className="form-control"
                    />)}
            />
            <label className="form-label" htmlFor="note">Note:</label>
            <Controller
                {...register("note")}
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
                <button
                    type="button" onClick={() => fillValues()}
                    className="btn btn-warning m-1 btn-rounded btn-padding-md">
                    <RotateCcwIcon className="w-[25px]" />
                    <span className="w-[85%]">Fill</span>
                </button>
            </div>
        </form >
    );
};


