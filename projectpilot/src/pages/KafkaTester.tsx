import type { JSX } from "react/jsx-runtime";
import { Layout } from "../Layout/main_layout/Layout";

import { useState } from "react";
import { useGetApi } from "../BussinessLogic/Hooks/UseGetApi";
import { citiesService, labReportsService, patientsService, usersService } from "../BussinessLogic/Index.Service";
import type { NameIdPair } from "../BussinessLogic/Models/Generics/NameIdPair";
import type { PatientModel } from "../BussinessLogic/Models/Patient.Model";
import { Dropdown } from "primereact/dropdown";
import type { UserModel } from "../BussinessLogic/Models/User.Model";
import type { CityModel } from "../BussinessLogic/Models/City.Model";

const KafkaTester = () => {



    return (
        <>
            <div className="flex">
                <div className="basis-1/3 flex flex-col gap-2">
                    <PatientWidget />
                </div>

                <div className="basis-1/3 flex flex-col gap-2">
                    <UserWidget />
                </div>

                <div className="basis-1/3 flex flex-col gap-2">
                    <CityWidget />
                </div>
            </div>
        </>
    )
};


const PatientWidget = () => {


    const [patientId, setPatientId] = useState<number>(-1);
    const [patient, setPatient] = useState<PatientModel | null>(null);

    const { execute: getPatientCall } = useGetApi<PatientModel | null>(() => labReportsService.GetPatient(patientId));

    const { data: patients } = useGetApi<NameIdPair[]>(
        async () => {
            const models: PatientModel[] = (await patientsService.GetPatients(true)).data;
            return models.map(p => ({
                id: p.id,
                name: `${p.id} - ${p.name}`,
            }));
        },
        { immediate: true }
    );

    const onPatientChange = (id: number) => {
        setPatientId(id);
    }

    const getPatient = async () => {
        var p = await getPatientCall(patientId);
        setPatient(p);
    }


    return (

        <div className="flex flex-col">
            <div className="flex">
                <Dropdown
                    value={patientId}
                    onChange={(e) => { onPatientChange(e.value!) }}
                    options={patients!}
                    showClear
                    optionValue="id"
                    optionLabel="name"
                    placeholder="Select a Patient"
                    className="form-control flex-1"
                />
                <button className="btn btn-info btn-rounded btn-padding-md" onClick={() => getPatient()}>Get</button>
            </div>

            <div className="flex">
                <span>{patient?.name}</span>
            </div>
        </div>
    );

}


const UserWidget = () => {


    const [userId, setUserId] = useState<number>(-1);
    const [user, setUser] = useState<UserModel | null>(null);

    const { execute: getUserCall } = useGetApi<UserModel | null>(() => labReportsService.GetUser(userId));

    const { data: users } = useGetApi<NameIdPair[]>(
        async () => {
            const models: UserModel[] = (await usersService.GetUsers(true)).data;
            return models.map(p => ({
                id: p.id,
                name: p.name,
            }));
        },
        { immediate: true }
    );

    const onUserChange = (id: number) => {
        setUserId(id);
    }

    const getUser = async () => {
        var p = await getUserCall(userId);
        setUser(p);
    }


    return (

        <div className="flex flex-col">
            <div className="flex">
                <Dropdown
                    value={userId}
                    onChange={(e) => { onUserChange(e.value!) }}
                    options={users!}
                    showClear
                    optionValue="id"
                    optionLabel="name"
                    placeholder="Select a User"
                    className="form-control flex-1"
                />
                <button className="btn btn-info btn-rounded btn-padding-md" onClick={() => getUser()}>Get</button>
            </div>

            <div className="flex">
                <span>{user?.name}</span>
            </div>
        </div>
    );

}


const CityWidget = () => {


    const [cityId, setCityId] = useState<number>(-1);
    const [city, setCity] = useState<CityModel | null>(null);

    const { execute: getCityCall } = useGetApi<CityModel | null>(() => labReportsService.GetCity(cityId));

    const { data: citys } = useGetApi<NameIdPair[]>(
        async () => {
            const models: CityModel[] = (await citiesService.GetCities(true)).data;
            return models.map(p => ({
                id: p.id,
                name: p.name,
            }));
        },
        { immediate: true }
    );

    const onCityChange = (id: number) => {
        setCityId(id);
    }

    const getCity = async () => {
        var p = await getCityCall(cityId);
        setCity(p);
    }


    return (

        <div className="flex flex-col">
            <div className="flex">
                <Dropdown
                    value={cityId}
                    onChange={(e) => { onCityChange(e.value!) }}
                    options={citys!}
                    showClear
                    optionValue="id"
                    optionLabel="name"
                    placeholder="Select a City"
                    className="form-control flex-1"
                />
                <button className="btn btn-info btn-rounded btn-padding-md" onClick={() => getCity()}>Get</button>
            </div>

            <div className="flex">
                <span>{city?.name}</span>
            </div>
        </div>
    );

}

KafkaTester.getLayout = (page: JSX.Element) => {
    return (
        <Layout>{page}</Layout>
    )
}
export default KafkaTester