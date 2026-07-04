
import { Dropdown, type DropdownChangeEvent } from 'primereact/dropdown';
import { useEffect, useRef, useState } from 'react';
import { createMissingSchema, type MissingFormData } from './Schemas';
import { useGetApi } from '../../BussinessLogic/Hooks/UseGetApi';
import { provincesService, citiesService, usersService } from '../../BussinessLogic/Index.Service';
import type { CityModel } from '../../BussinessLogic/Models/City.Model';
import type { ProvinceModel } from '../../BussinessLogic/Models/Province.Model';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useMutationApi } from '../../BussinessLogic/Hooks/UseMutationsApi';
import { type UserModel, createUserModel } from '../../BussinessLogic/Models/User.Model';
import { CheckUniqueType } from '../../BussinessLogic/Services/Users.Service';
import debounce from '../../Helpers/Constants';
import { InputMask } from 'primereact/inputmask';
import { Calendar } from 'primereact/calendar';
import { ChevronsRightIcon, PlusIcon, RotateCcwIcon } from 'lucide-react';
import { InputText } from 'primereact/inputtext';
import { SelectButton } from 'primereact/selectbutton';
import FileUploadWidget from '../CommonWidgets/FileUpload';
import { FormErrors } from '../CommonWidgets/FormErrors';
import { useNavigate } from 'react-router-dom';
import { RouterPaths } from '../../BussinessLogic/Routes/RouterPaths';
import type { Filter } from '../../BussinessLogic/Models/Generics/Filter';
import createDefaultFilter from '../../BussinessLogic/Models/Generics/Filter';
import { useAuth } from '../../BussinessLogic/Security/Auth.Context';
import type { LoginModel } from '../../BussinessLogic/Models/Login.Model';
import { showError, showSuccess } from '../../Helpers/Toast.Helper';
import { type NameIdPair } from '../../BussinessLogic/Models/Generics/NameIdPair';

interface Props {
    visible: boolean;
    hide: () => void;
    fromLogin?: boolean;
};

export const AddMissingUserDetails = ({ visible, hide, fromLogin = false }: Props) => {

    if (!visible) return null;
    const navigate = useNavigate();
    const { state, getUser, setUser } = useAuth();


    const [authUser, setAuthUser] = useState<LoginModel | null>(null);
    const [provinceId, setProvinceId] = useState<number>(-1);

    const [imageSource, setImageSource] = useState<string | null>(null);

    const [cityDisabled, setCityDisabled] = useState<boolean>(false);

    const [filter, setFilter] = useState<Filter>(
        createDefaultFilter()
    );

    const dropdownRefProvince = useRef<Dropdown>(null);
    const dropdownRefCity = useRef<Dropdown>(null);

    const schema = createMissingSchema;

    useEffect(() => {
        const u = state?.user ?? getUser();
        setAuthUser(u);
    }, [state, getUser]);

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

    const { execute: getCurrentUser } = useGetApi<LoginModel | null>(
        () => usersService.GetCurrentUser(),
        { immediate: false },
    );

    const onProvinceChange = async (id: number) => {
        if (id > 0) {
            dropdownRefCity.current?.clear();
            setCityDisabled(true);
            setProvinceId(id);
            setFilter({ ...filter, id });
            setCityDisabled(false);
            refetchCities();
        }
    };

    const { mutate: update } = useMutationApi<boolean, UserModel>((u) => usersService.AddMissingDetails(u!), {
        optimisticUpdate: () => {
            handleReset();
        },
        onSuccess: async () => {
            const latestUser = await getCurrentUser();
            if (latestUser != null) {
                setUser(latestUser!);
                showSuccess(`Missing details have been added, successfully!`);
                hide();
            }
            if (fromLogin)
                navigate(RouterPaths.dashboard);
        },
        onError: () => {
            showError(`Missing details could not be added!`);
        },
    });

    const { register, handleSubmit, reset, setValue, control, setError, clearErrors, watch, formState: { errors } } = useForm<MissingFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            cnic: "3333333333339",
            dateofBirth: new Date(2, 21, 1983),
            address: "House no 123",
            pmdcNo: "11111",
            cityId: -1,
            phoneNo: "03111111111",
            phoneType: 1,
            gender: 0,
            role: 2,
            picture: undefined
        }
    });

    const handleReset = () => {
        reset({
            cnic: "",
            dateofBirth: new Date(),
            address: "",
            pmdcNo: "",
            cityId: -1,
            phoneNo: "",
            phoneType: 1,
            gender: 0,
            role: 2,
            picture: undefined
        });
        setImageSource("");
        setProvinceId(-1);
        setCityDisabled(true);
        dropdownRefProvince.current?.clear();
        dropdownRefCity.current?.clear();
    };

    const cnic = watch("cnic");
    const pmdcNo = watch("pmdcNo");

    const checkCnic = debounce(async (value: string) => {
        if (!value) return;
        const isUnique = await usersService.CheckUnique(CheckUniqueType.cnic, value, authUser?.id);

        if (!isUnique) {
            setError("cnic", { type: "manual", message: "CNIC is already taken" });
        } else {
            clearErrors("cnic");
        }
    }, 500);

    const checkPmdc = debounce(async (value: string) => {
        if (!value) return;
        const isUnique = await usersService.CheckUnique(CheckUniqueType.pmdcno, value, authUser?.id);
        if (!isUnique) {
            setError("pmdcNo", { type: "manual", message: "PMDC No is already taken" });
        } else {
            clearErrors("pmdcNo");
        }
    }, 500);

    useEffect(() => { checkCnic(cnic); }, [cnic]);
    useEffect(() => { checkPmdc(pmdcNo!); }, [pmdcNo]);

    useEffect(() => {

    }, []);

    const genders = [
        { name: 'M', value: 0 },
        { name: 'F', value: 1 },
        { name: 'Other', value: 2 }
    ];

    const roles = [{ name: 'Doctor', value: 2 }, { name: 'Patient', value: 3 }];

    const phoneTypes = [{ name: 'Landline', value: 1 }, { name: 'Mobile', value: 2 }];

    const onSubmit = async (data: MissingFormData) => {
        if ((authUser != null && authUser.id > 0)) {
            const raw = {
                id: authUser?.id,
                cnic: data.cnic,
                dateofBirth: data.dateofBirth,
                address: data.address,
                pmdcNo: data.pmdcNo,
                cityId: data.cityId,
                phoneNo: data.phoneNo,
                phoneType: data.phoneType,
                gender: data.gender,
                role: data.role.toString(),
                picture: data.picture,
            };
            const u = createUserModel(raw);
            await update(u);

        }
    };

    const phoneType = watch("phoneType");

    useEffect(() => {
        setValue("phoneNo", "");
    }, [phoneType, setValue]);

    return (
        <>
            <div
                className="fixed inset-0 flex items-center justify-center backdrop-blur-xl bg-opacity-80 z-50 w-full h-full" >
                <div className="border border-gray-400 rounded-md w-[60%] bg-gray-700 " onClick={(e) => e.stopPropagation()}>
                    <div className='w-full flex gap-2 border-b 
                     border-gray-700 dark:border-gray-400 p-1 content-center align-middle'>
                        <h2 className="text-xl font-semibold flex-1 text-center">Enter Following Details to continue</h2>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="items-center w-full h-full p-4">
                        <div className='grid grid-cols-[10%_23%_10%_23%_10%_23%] gap-1 px-2'>
                            <label className="form-label" htmlFor="cnic">CNIC:</label>
                            <InputMask
                                type="text" className="form-control" {...register("cnic")} mask="99999-9999999-9" />
                            <label className="form-label" htmlFor="dateOfBirth">DOB:</label>
                            <Controller
                                {...register("dateofBirth")}
                                control={control}
                                render={({ field }) => (
                                    <Calendar className="form-control" showIcon value={field.value}
                                        onChange={(e) => field.onChange(e.value)}
                                    />
                                )}
                            />
                            <label className="form-label" htmlFor="address">Address:</label>
                            <InputText
                                type="text" className="form-control" {...register("address")} />
                            <label className="form-label" htmlFor="pmdcNo">PMDC No:</label>
                            <InputText
                                type="text" className="form-control" {...register("pmdcNo")} />
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
                            <label className="form-label" htmlFor="phoneType">Type:</label>
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
                            <div className='col-span-6'>
                                <FileUploadWidget imageSource={imageSource ?? ""}
                                    onFileSelect={(file) => setValue("picture", file!, { shouldValidate: true })}
                                />
                            </div>
                            <div className='col-span-6'>
                                <FormErrors errors={errors} />
                            </div>
                            <div className="flex justify-center items-center gap-1 mt-2 col-span-6">
                                <button
                                    type="submit"
                                    className="btn btn-success  btn-rounded  btn-padding-md">
                                    <PlusIcon className="w-[25px]" />
                                    <span className="w-[85%]">Add</span>
                                </button>
                                <button
                                    type="button" onClick={() => handleReset()}
                                    className="btn btn-danger btn-rounded btn-padding-md" >
                                    <RotateCcwIcon className="w-[25px]" />
                                    <span className="w-[85%]">Reset</span>
                                </button>

                                <button
                                    type="button" onClick={() => hide()}
                                    className="btn btn-warning btn-rounded btn-padding-md" >
                                    <ChevronsRightIcon className="w-[25px]" />
                                    <span className="w-[85%]">Skip for Now</span>
                                </button>

                            </div>
                        </div>
                    </form>

                </div>
            </div>
        </>
    )
}
