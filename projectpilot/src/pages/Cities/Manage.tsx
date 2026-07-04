import { Layout } from "../../Layout/main_layout/Layout"
import Breadcrumbs from "../CommonWidgets/Breadcrumbs";

import { useState, useEffect, useRef, type JSX } from 'react';

import { type CityModel } from "../../BussinessLogic/Models/City.Model";

import { CityForm } from "./Form";
import { CityTable } from "./Table";
import type { LoginModel } from "../../BussinessLogic/Models/Login.Model";

import { Roles } from "../../Helpers/Constants";

import { type ProvinceModel } from "../../BussinessLogic/Models/Province.Model";

import { provincesService } from "../../BussinessLogic/Index.Service";
import { useGetApi } from "../../BussinessLogic/Hooks/UseGetApi";
import { useAuth } from "../../BussinessLogic/Security/Auth.Context";
import type { NameIdPair } from "../../BussinessLogic/Models/Generics/NameIdPair";

const ManageCities = () => {


    const [user, setUser] = useState<LoginModel | null>(null);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedCity, setSelectedCity] = useState<CityModel | undefined>(undefined);

    const cityTableRef = useRef<{ loadData: () => void }>(null);

    const { state, getUser } = useAuth();

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


    const handleEdit = (city: CityModel) => {
        setIsEdit(true);
        setSelectedCity(city);
    };

    const navItems = [
        { name: "Home", link: "/" },
        { name: "Cities", link: undefined },
        { name: "Manage", link: undefined }
    ];
    const title = "Manage Cities";

    useEffect(() => {
        setUser(state?.user ?? getUser());
        setIsEdit(false);

    }, []);

    return (
        <>
            <Breadcrumbs nav={navItems} title={title} />

            <div className=" w-full flex">
                {user?.role == Roles.admin.id && <div className="w-[30%] flex-auto p-5 mr-1 dark:bg-[#2a323d]">
                    <CityForm
                        isEdit={isEdit}
                        initialValues={selectedCity}
                        loadData={() => cityTableRef.current?.loadData()}
                        provinces={provinces!}
                    />

                </div>}
                <div className="w-[69%] flex-auto">
                    <CityTable role={user?.role ?? -1} onEdit={(selectedCity) => handleEdit(selectedCity!)}
                        provinces={provinces!} />
                </div>
            </div>
        </>
    )
};

ManageCities.getLayout = (page: JSX.Element) => {
    return (
        <Layout>{page}</Layout>
    )
}
export default ManageCities