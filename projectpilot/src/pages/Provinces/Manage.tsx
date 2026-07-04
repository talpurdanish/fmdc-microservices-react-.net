import { Layout } from "../../Layout/main_layout/Layout"
import Breadcrumbs from "../CommonWidgets/Breadcrumbs";

import { useState, useEffect, useRef, type JSX } from 'react';

import { type ProvinceModel } from "../../BussinessLogic/Models/Province.Model";

import { ProvinceForm } from "./Form";
import { ProvinceTable } from "./Table";
import type { LoginModel } from "../../BussinessLogic/Models/Login.Model";
import { useAuth } from "../../BussinessLogic/Security/Auth.Context";
import { Roles } from "../../Helpers/Constants";


const ManageProvinces = () => {

    const [user, setUser] = useState<LoginModel | null>(null);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedProvince, setSelectedProvince] = useState<ProvinceModel | undefined>(undefined);

    const provinceTableRef = useRef<{ loadData: () => void }>(null);

    const { getUser } = useAuth();
    const handleEdit = (province: ProvinceModel) => {

        setIsEdit(true);
        setSelectedProvince(province);
    };

    const navItems = [
        { name: "Home", link: "/" },
        { name: "Provinces", link: undefined },
        { name: "Manage", link: undefined }
    ];
    const title = "Manage Provinces";

    useEffect(() => {
        setUser(getUser());
        setIsEdit(false);

    }, []);

    return (
        <>
            <Breadcrumbs nav={navItems} title={title} />
            <div className=" w-full flex">
                {user?.role == Roles.admin.id && <div className="w-[30%] flex-auto p-5 mr-1 dark:bg-[#2a323d]">
                    <ProvinceForm
                        isEdit={isEdit}
                        initialValues={selectedProvince}
                        loadData={() => provinceTableRef.current?.loadData()}
                    />

                </div>}
                <div className="w-[69%] flex-auto">
                    <ProvinceTable role={user?.role ?? -1} onEdit={(selectedProvince) => handleEdit(selectedProvince!)}
                    />
                </div>
            </div>
        </>
    )
};

ManageProvinces.getLayout = (page: JSX.Element) => {
    return (
        <Layout>{page}</Layout>
    )
}
export default ManageProvinces