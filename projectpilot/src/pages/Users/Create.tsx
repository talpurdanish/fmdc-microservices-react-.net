import { Controller, useForm } from "react-hook-form";
import { Layout } from "../../Layout/main_layout/Layout"
import { useEffect, useRef, useState } from "react";
import { createSchema, type FormData } from "./Schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserModel, type UserModel } from "../../BussinessLogic/Models/User.Model";
import { citiesService, provincesService, usersService } from "../../BussinessLogic/Index.Service";
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
import { PlusIcon, RotateCcwIcon, XIcon } from "lucide-react";
import { FormErrors } from "../CommonWidgets/FormErrors";
import { CheckUniqueType } from "../../BussinessLogic/Services/Users.Service";
import debounce from "../../Helpers/Constants";
import { useNavigate, useParams } from 'react-router-dom';
import { useGetApi } from "../../BussinessLogic/Hooks/UseGetApi";
import { useMutationApi } from "../../BussinessLogic/Hooks/UseMutationsApi";
import type { NameIdPair } from "../../BussinessLogic/Models/Generics/NameIdPair";
import { showError, showSuccess } from "../../Helpers/Toast.Helper";
import { RouterPaths } from "../../BussinessLogic/Routes/RouterPaths";


const CreateUsers = () => {
    const { paramId } = useParams();
    const navigate = useNavigate()
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [buttonTitle, setButtonTitle] = useState<string>("Create");
    const [provinceId, setProvinceId] = useState<number>(-1);

    const [imageSource, setImageSource] = useState<string | null>(null);

    const [cityDisabled, setCityDisabled] = useState<boolean>(false);
    const [usernameDisabled, setUsernameDisabled] = useState<boolean>(false);

    const [resetFileUpload, setResetFileUpload] = useState<boolean>(false);

    const dropdownRefProvince = useRef<Dropdown>(null);
    const dropdownRefCity = useRef<Dropdown>(null);

    const [filter, setFilter] = useState<Filter>(
        createDefaultFilter()
    );

    const schema = createSchema;

    const { data: provinces } = useGetApi<NameIdPair[]>(
        async () => {
            const models: ProvinceModel[] = (await provincesService.GetProvinces()).data;
            return models.map(p => ({
                id: p.id,
                name: p.name,
            }));
        },
        { immediate: true },
    );

    const { data: cities, refetch: refetchCities } = useGetApi<NameIdPair[], Filter>(
        async (filter) => {
            const models: CityModel[] = (await citiesService.GetCities(false, filter!)).data;
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

    const { execute: getUser } = useGetApi<UserModel | null, number>(
        (id) =>
            usersService.GetUser(id!),
        { immediate: (!paramId && paramId != undefined && Number(paramId) > 0), payload: Number(paramId!) },

    );


    const { mutate: createOrUpdate } = useMutationApi<boolean, UserModel>(
        (user) => isEdit ?
            usersService.UpdateUser(user!)
            : usersService.CreateUser(user!), {
        optimisticUpdate: () => {
            if (isEdit)
                handleCancel();
            handleReset();
        },
        onSuccess: () => {
            const operation = isEdit ? "updated" : "created";
            showSuccess(`User has been ${operation} successfully!`);
        },
        onError: () => {
            const operation = isEdit ? "updated" : "created";
            showError(`User could not be ${operation}!`);
        },

    });


    const { register, handleSubmit, reset, resetField, setValue, control, setError, clearErrors, watch, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            id: -1,
            name: "",
            username: "",
            cnic: "",
            dateofBirth: new Date(),
            cityId: -1,
            phoneType: 1,
            gender: 0,
            role: 3,
            address: "",
            pmdcNo: "",
            phoneNo: "",
            picture: undefined
        }
    });

    const handleReset = () => {
        reset({
            id: -1,
            name: "",
            username: "",
            cnic: "",
            dateofBirth: new Date(),
            cityId: -1,
            phoneType: 1,
            gender: 0,
            role: 3,
            address: "",
            pmdcNo: "",
            phoneNo: "",
            picture: undefined
        });
        setResetFileUpload(true);
        setProvinceId(-1);
        setIsEdit(false);
        setButtonTitle("Create");
        setCityDisabled(true);
        setUsernameDisabled(false);
        dropdownRefProvince.current?.clear();
        dropdownRefCity.current?.clear();
        setImageSource("");
    };


    const handleCancel = () => {
        navigate(RouterPaths.viewUsers);
    }

    const populateRandomValues = () => {
        reset({
            id: -1,
            name: "New User",
            username: "newuser",
            cnic: "21011-0922010-1",
            dateofBirth: new Date(Date.parse("1988-01-01")),
            cityId: 1,
            phoneType: 1,
            gender: 0,
            role: 3,
            address: "123, abc Lane",
            pmdcNo: "21000",
            phoneNo: "0341-2212111",
            picture: undefined
        });
        setProvinceId(1);
    }

    const id = watch("id");
    const username = watch("username");
    const cnic = watch("cnic");
    const pmdcNo = watch("pmdcNo");

    // Debounced checks
    const checkUsername = debounce(async (id: number = -1, value: string) => {
        if (!value) return;
        const isUnique = await usersService.CheckUnique(CheckUniqueType.username, value, id);
        if (!isUnique) {
            setError("username", { type: "manual", message: "Username is already taken" });
        } else {
            clearErrors("username");
        }
    }, 500);

    const checkCnic = debounce(async (id: number = -1, value: string) => {
        if (!value) return;
        const isUnique = await usersService.CheckUnique(CheckUniqueType.cnic, value, id);
        if (!isUnique) {
            setError("cnic", { type: "manual", message: "CNIC is already taken" });
        } else {
            clearErrors("cnic");
        }
    }, 500);

    const checkPmdc = debounce(async (id: number = -1, value: string) => {
        if (!value) return;
        const isUnique = await usersService.CheckUnique(CheckUniqueType.pmdcno, value, id);
        if (!isUnique) {
            setError("pmdcNo", { type: "manual", message: "PMDC No is already taken" });
        } else {
            clearErrors("pmdcNo");
        }
    }, 500);

    // Run checks when fields change
    useEffect(() => { checkUsername(id, username); }, [id, username]);
    useEffect(() => { checkCnic(id, cnic); }, [id, cnic]);
    useEffect(() => { checkPmdc(id, pmdcNo!); }, [id, pmdcNo]);

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

        const user = await getUser(id);
        if (user != null) {
            setImageSource(user!.picture);
            setProvinceId(user!.provinceId);
            onProvinceChange(user.provinceId)
            reset({
                id: user.id,
                name: user.name,
                username: user.username,
                cnic: user.cnic,
                dateofBirth: user.dateofBirth,
                cityId: user.cityId,
                phoneType: user.phoneType,
                gender: user.gender,
                role: Number(user.role),
                address: user.address,
                pmdcNo: user.pmdcNo,
                phoneNo: user.phoneNo,
            });

            setIsEdit(true);
            setButtonTitle("Update");
            setUsernameDisabled(true);

        }
    }

    const genders = [
        { name: 'Male', value: 0 },
        { name: 'Female', value: 1 },
        { name: 'Other', value: 2 }
    ];

    const roles = [{ name: 'Doctor', value: 2 }, { name: 'Patient', value: 3 }];

    const phoneTypes = [{ name: 'Landline', value: 1 }, { name: 'Mobile', value: 2 }];

    const onSubmit = async (data: FormData) => {

        const raw = {
            id: isEdit ? data.id : -1,
            name: data.name,
            username: data.username,
            cnic: data.cnic,
            dateofBirth: data.dateofBirth,
            cityId: data.cityId,
            phoneType: data.phoneType,
            gender: data.gender,
            role: data.role,
            address: data.address,
            pmdcNo: data.pmdcNo,
            phoneNo: data.phoneNo,
            picture: data.picture,
            isActive: false,
        };
        const user = createUserModel(raw);
        await createOrUpdate(user);
    };

    const phoneType = watch("phoneType");

    useEffect(() => {
        setValue("phoneNo", "");
    }, [phoneType]);


    const navItems = [
        { name: "Home", link: "/" },
        { name: "Users", link: undefined },
        { name: "Create", link: undefined } // last breadcrumb, no link
    ];
    const title = "Create Users";

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
                                    <label className="form-label" htmlFor="username">Username:</label>
                                    <InputText
                                        type="text" className="form-control" {...register("username")} disabled={usernameDisabled} />
                                </div>

                                <div className="flex-1 m-1">
                                    <label className="form-label" htmlFor="cnic">CNIC:</label>
                                    <InputMask
                                        type="text" className="form-control" {...register("cnic")} mask="99999-9999999-9" />
                                </div>
                            </div>

                            <div className="w-full flex">
                                <div className="flex-1 m-1">
                                    <label className="form-label" htmlFor="dateOfBirth">Date of Birth:</label>
                                    <Controller
                                        {...register("dateofBirth")}
                                        control={control}
                                        render={({ field }) => (
                                            <Calendar className="form-control" showIcon value={field.value}
                                                onChange={(e) => field.onChange(e.value)}
                                                dateFormat="dd/mm/yy"
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
                                    <label className="form-label" htmlFor="pmdcNo">PMDC No:</label>
                                    <InputText
                                        type="text" className="form-control" {...register("pmdcNo")} />
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
                                    <label className="form-label" htmlFor="role">Role:</label>
                                    <Controller
                                        {...register("role")}
                                        control={control}
                                        render={({ field }) => (
                                            <SelectButton
                                                value={field.value}
                                                onChange={(e) => field.onChange(e.value)}
                                                options={roles}
                                                optionLabel="name"
                                                className="w-full rounded-sm"
                                            />
                                        )}
                                    />
                                </div>
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
                            className="btn btn-success  btn-rounded m-1  btn-padding-md">
                            <PlusIcon className="w-[25px]" />
                            <span className="w-[85%]">{buttonTitle}</span>
                        </button>
                        <button
                            type="button" onClick={() => handleReset()}
                            className="btn btn-danger m-1 btn-rounded  btn-padding-md" >
                            <RotateCcwIcon className="w-[25px]" />
                            <span className="w-[85%]">Reset</span>
                        </button>
                        {isEdit && <button
                            type="button" onClick={() => handleCancel()}
                            className="btn btn-danger m-1 btn-rounded  btn-padding-md" >
                            <XIcon className="w-[25px]" />
                            <span className="w-[85%]">Cancel</span>
                        </button>}

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

CreateUsers.getLayout = (page: any) => {
    return (
        <Layout>{page}</Layout>
    )
}
export default CreateUsers