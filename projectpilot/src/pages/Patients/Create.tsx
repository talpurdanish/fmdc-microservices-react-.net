import { Controller, useForm } from "react-hook-form";
import { Layout } from "../../Layout/main_layout/Layout"
import { useEffect, useRef, useState } from "react";
import { createSchema, type FormData } from "./Schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { citiesService, patientsService, provincesService } from "../../BussinessLogic/Index.Service";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { InputMask } from 'primereact/inputmask';
import Breadcrumbs from "../CommonWidgets/Breadcrumbs";
import { type CityModel } from "../../BussinessLogic/Models/City.Model";
import createDefaultFilter, { type Filter } from "../../BussinessLogic/Models/Generics/Filter";
import { type ProvinceModel } from "../../BussinessLogic/Models/Province.Model";
import { Dropdown, type DropdownChangeEvent } from "primereact/dropdown";
import { SelectButton } from "primereact/selectbutton";
import FileUploadWidget from "../CommonWidgets/FileUpload";
import { PlusIcon, RotateCcwIcon } from "lucide-react";
import { FormErrors } from "../CommonWidgets/FormErrors";
import { useParams } from 'react-router-dom';
import { createPatientModel, type PatientModel } from "../../BussinessLogic/Models/Patient.Model";
import debounce from "../../Helpers/Constants";
import { useMutationApi } from "../../BussinessLogic/Hooks/UseMutationsApi";
import { useGetApi } from "../../BussinessLogic/Hooks/UseGetApi";

import type { NameIdPair } from "../../BussinessLogic/Models/Generics/NameIdPair";
import { showError, showSuccess } from "../../Helpers/Toast.Helper";




const CreatePatients = () => {
    const { paramId } = useParams();
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [buttonTitle, setButtonTitle] = useState<string>("Create");
    const [provinceId, setProvinceId] = useState<number>(-1);

    const [imageSource, setImageSource] = useState<string | null>(null);

    const [cityDisabled, setCityDisabled] = useState<boolean>(false);
    const [resetFileUpload, setResetFileUpload] = useState<boolean>(false);
    const dropdownRefProvince = useRef<Dropdown>(null);
    const dropdownRefCity = useRef<Dropdown>(null);
    const dropdownRefBloodGroup = useRef<Dropdown>(null);


    const [filter, setFilter] = useState<Filter>(
        createDefaultFilter()
    );

    const schema = createSchema;


    const { data: provinces } = useGetApi<NameIdPair[]>(
        async () => {
            const models: ProvinceModel[] = (await provincesService.GetProvinces(true)).data;
            return models.map(p => ({
                id: p.id,
                name: p.name,
            }));
        },
        { immediate: true },
    );

    const { data: cities, refetch: refetchCities } = useGetApi<NameIdPair[]>(
        async () => {
            const models: CityModel[] = (await citiesService.GetCities(true)).data;
            return models.map(p => ({
                id: p.id,
                name: p.name,
            }));
        },
        {
            immediate: filter.id > 0,
            payload: filter,
        },
        [filter]
    );

    const onProvinceChange = async (id: number) => {
        if (id > 0) {
            resetField("cityId", { defaultValue: -1 });
            dropdownRefCity.current?.clear();
            setCityDisabled(true);
            setProvinceId(id);
            setFilter({ ...filter, id });
            setCityDisabled(false);
            refetchCities();
        }
    };

    const { execute: getPatient } = useGetApi<PatientModel | null, number>(
        (id) => patientsService.GetPatient(id!),
        { immediate: (!paramId && paramId != undefined && Number(paramId) > 0), payload: Number(paramId!) },
    );


    const { mutate: createOrUpdate } = useMutationApi<boolean, PatientModel>((patient) => patientsService.CreateOrUpdate(patient!), {
        optimisticUpdate: () => {
            handleReset();
        },
        onSuccess: () => {
            const operation = isEdit ? "updated" : "created";
            showSuccess(`Patient has been ${operation} successfully!`);
        },
        onError: () => {
            const operation = isEdit ? "updated" : "created";
            showError(`Patient could not be ${operation}!`);
        },
    });


    const { register, handleSubmit, reset, resetField, setValue, control, setError, clearErrors, watch, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            id: -1,
            name: "",
            fatherName: "",
            cnic: "",
            dateofBirth: new Date(),
            cityId: -1,
            phoneType: 1,
            gender: 0,
            bloodGroup: "",
            address: "",
            phoneNo: "",
            picture: undefined
        }
    });

    const handleReset = () => {
        reset({
            id: -1,
            name: "",
            fatherName: "",
            cnic: "",
            dateofBirth: new Date(),
            cityId: -1,
            phoneType: 1,
            gender: 0,
            bloodGroup: "",
            address: "",
            phoneNo: "",
            picture: undefined
        });
        setResetFileUpload(true);
        setProvinceId(-1);
        setIsEdit(false);
        setButtonTitle("Create");
        setCityDisabled(true);
        dropdownRefProvince.current?.clear();
        dropdownRefCity.current?.clear();
        setImageSource("");
    };


    const populateRandomValues = () => {
        reset({
            id: -1,
            name: "Patient A",
            fatherName: "Father A",
            cnic: "65222-1111111-1",
            dateofBirth: new Date(),
            cityId: 1,
            phoneType: 1,
            gender: 0,
            bloodGroup: "B+",
            address: "123, Lane Abc",
            phoneNo: "0345-90129912",
            picture: undefined
        });
        setProvinceId(1);
    }

    const id = watch("id");
    const cnic = watch("cnic");

    const checkCnic = debounce(async (id: number = -1, value: string) => {
        if (!value) return;
        const isUnique = await patientsService.CheckUnique(value, id);
        if (isUnique) {
            setError("cnic", { type: "manual", message: "CNIC is already taken" });
        } else {
            clearErrors("cnic");
        }
    }, 500);


    useEffect(() => { checkCnic(id, cnic); }, [id, cnic]);

    useEffect(() => {
        setResetFileUpload(false);
        handleReset();
        if (paramId != undefined) {
            const id = Number(paramId);

            if (id > -1) {
                populateEdit(id);
            }
        }

    }, [paramId]);


    const populateEdit = async (id: number) => {
        var patient = await getPatient(id);
        setImageSource(patient!.picture!);
        reset({
            id: patient!.id,
            name: patient!.name,
            fatherName: patient!.fatherName,
            cnic: patient!.cnic,
            dateofBirth: patient!.dateOfBirth,
            cityId: patient!.cityId,
            phoneType: patient!.phoneType,
            gender: patient!.gender,
            bloodGroup: patient!.bloodGroup,
            address: patient!.address,
            phoneNo: patient!.phoneNo,
            picture: undefined
        });

        setIsEdit(true);
        const btnTitle = isEdit ? "Update" : "Create";
        setButtonTitle(btnTitle);
        setProvinceId(patient!.provinceId);
        setCityDisabled(false);
    }


    const genders = [
        { name: 'Male', value: 0 },
        { name: 'Female', value: 1 },
        { name: 'Other', value: 2 }
    ];

    const bloodGroups = [
        { name: 'A+', id: "A+" },
        { name: 'B+', id: "B+" },
        { name: 'AB+', id: "AB+" },
        { name: 'O+', id: "O+" },
        { name: 'A-', id: "A-" },
        { name: 'B-', id: "B-" },
        { name: 'O-', id: "O-" },
        { name: 'AB-', id: "AB-" },
    ];

    const phoneTypes = [{ name: 'Landline', value: 1 }, { name: 'Mobile', value: 2 }];


    const onSubmit = async (data: FormData) => {

        const raw = {
            id: isEdit ? data.id : -1,
            name: data.name,
            fatherName: data.fatherName,
            address: data.address,
            picture: data.picture,
            dateOfBirth: data.dateofBirth,
            gender: data.gender,
            phoneNo: data.phoneNo,
            phoneType: data.phoneType,
            bloodGroup: data.bloodGroup,
            cnic: data.cnic,
            cityId: data.cityId,

        };
        const patient = createPatientModel(raw);
        await createOrUpdate(patient);
    };

    const phoneType = watch("phoneType");

    useEffect(() => {
        setValue("phoneNo", "");
    }, [phoneType, setValue]);


    const navItems = [
        { name: "Home", link: "/" },
        { name: "Patients", link: undefined },
        { name: "Create", link: undefined } // last breadcrumb, no link
    ];
    const title = "Create Patients";

    return (
        <>
            <Breadcrumbs nav={navItems} title={title} />

            <div className="bg-gray-300 dark:bg-gray-700 w-full p-2 mb-3 mt-5">
                <form onSubmit={handleSubmit(onSubmit)} className="items-center">
                    <input type="hidden" name="id" />
                    <div className="flex">
                        <div className="flex-initial mr-1">
                            <div className="w-full flex">
                                <div className="flex-1 m-1">
                                    <label className="form-label" htmlFor="name">Name:</label>
                                    <InputText
                                        type="text" className="form-control" {...register("name")} />
                                </div>
                                <div className="flex-1 m-1">
                                    <label className="form-label" htmlFor="username">Father's / Husband Name:</label>
                                    <InputText
                                        type="text" className="form-control" {...register("fatherName")} />
                                </div>

                                <div className="flex-1 m-1">
                                    <label className="form-label" htmlFor="cnic">CNIC:</label>
                                    <InputMask
                                        type="text" className="form-control" {...register("cnic")} mask="99999-9999999-9" />
                                </div>
                            </div>

                            <div className="w-full flex">
                                <div className="flex-1 m-1">
                                    <label className="form-label" htmlFor="dateofBirth">Date of Birth:</label>
                                    <Controller
                                        {...register("dateofBirth")}
                                        control={control}
                                        render={({ field }) => (
                                            <Calendar className="form-control" showIcon value={field.value}
                                                onChange={(e) => field.onChange(e.value)}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="flex-1 m-1">
                                    <label className="form-label" htmlFor="address">Address:</label>
                                    <InputText
                                        type="text" className="form-control" {...register("address")} />
                                </div>

                                <div className="flex-1 m-1">
                                    <label className="form-label" htmlFor="bloodGroup">Blood Group:</label>
                                    <Controller
                                        {...register("bloodGroup")}
                                        control={control}
                                        render={({ field }) => (
                                            <Dropdown
                                                ref={dropdownRefBloodGroup}
                                                value={field.value}
                                                onChange={(e) => field.onChange(e.value)}
                                                options={bloodGroups!}
                                                showClear
                                                optionValue="id"
                                                optionLabel="name"
                                                placeholder="Select a Blood Group"
                                                className="form-control"
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="w-full flex">
                                <div className="flex-1 m-1">
                                    <label className="form-label" htmlFor="provinceId">Province:</label>
                                    <Dropdown
                                        ref={dropdownRefProvince}
                                        value={provinceId}
                                        onChange={(e: DropdownChangeEvent) => onProvinceChange(e.value)}
                                        options={provinces!}
                                        showClear
                                        optionValue="id"
                                        optionLabel="name"
                                        placeholder="Select a Province"
                                        className="form-control"
                                    />
                                </div>
                                <div className="flex-1 m-1">
                                    <label className="form-label" htmlFor="cityId">City:</label>
                                    <Controller
                                        {...register("cityId")}
                                        control={control}
                                        render={({ field }) => (
                                            <Dropdown
                                                ref={dropdownRefCity}
                                                value={field.value}
                                                onChange={(e) => field.onChange(e.value)}
                                                options={cities!}
                                                disabled={cityDisabled}
                                                showClear
                                                optionValue="id"
                                                optionLabel="name"
                                                placeholder="Select a City"
                                                className="form-control"
                                            />
                                        )}
                                    />
                                </div>

                                <div className="flex-1 m-1">
                                    <label className="form-label" htmlFor="gender">Gender:</label>
                                    <Controller
                                        {...register("gender")}
                                        control={control}
                                        render={({ field }) => (
                                            <SelectButton
                                                value={field.value}
                                                onChange={(e) => field.onChange(e.value)}
                                                options={genders}
                                                optionLabel="name"
                                                className="w-full rounded-sm"
                                            />
                                        )}
                                    />
                                </div>
                            </div>


                            <div className="w-full flex">
                                <div className="flex-1 m-1">
                                    <label className="form-label" htmlFor="phoneType">Phone Type:</label>
                                    <Controller
                                        {...register("phoneType")}
                                        control={control}
                                        render={({ field }) => (
                                            <SelectButton
                                                value={field.value}
                                                onChange={(e) => field.onChange(e.value)}
                                                options={phoneTypes}
                                                optionLabel="name"
                                                className="w-full rounded-sm"
                                            />
                                        )}
                                    />
                                </div>
                                <div className="flex-1 m-1">
                                    <label className="form-label" htmlFor="phoneNo">Phone No:</label>
                                    <Controller
                                        {...register("phoneNo")}
                                        control={control}
                                        render={({ field }) => (
                                            <InputMask
                                                value={field.value}
                                                onChange={(e) => field.onChange(e.value)}
                                                mask={watch("phoneType") === 1 ? "0399-9999999" : "0999-9999999"}
                                                placeholder={watch("phoneType") === 1 ? "03XX-XXXXXXX" : "0XXX-XXXXXXX"}
                                                className="w-full rounded-sm"
                                            />
                                        )}
                                    />

                                </div>

                            </div>
                        </div>
                        <div className="flex-1">
                            <FileUploadWidget imageSource={imageSource ?? ""}
                                onFileSelect={(file) => {
                                    setValue("picture", file!, { shouldValidate: true });
                                    setResetFileUpload(false);
                                }} reset={resetFileUpload}
                            />
                        </div>
                    </div>
                    <FormErrors errors={errors} />
                    <div className="w-full flex">
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
                            type="button" onClick={() => populateRandomValues()}
                            className="btn btn-info m-1 btn-rounded btn-padding-md">
                            <RotateCcwIcon className="w-[25px]" />
                            <span className="w-[85%]">Fill</span>
                        </button>
                    </div>
                </form>
            </div >

        </>
    )
}

CreatePatients.getLayout = (page: any) => {
    return (
        <Layout>{page}</Layout>
    )
}
export default CreatePatients