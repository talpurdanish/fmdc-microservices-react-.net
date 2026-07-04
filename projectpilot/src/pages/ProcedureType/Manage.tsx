import { Layout } from "../../Layout/main_layout/Layout"
import Breadcrumbs from "../CommonWidgets/Breadcrumbs";

import { useState, useEffect, useRef, type JSX } from 'react';

import { type ProcedureTypeModel } from "../../BussinessLogic/Models/ProcedureType.Model";

import { ProcedureTypeForm } from "./Form";
import { ProcedureTypeTable } from "./Table";
import type { LoginModel } from "../../BussinessLogic/Models/Login.Model";
import { useAuth } from "../../BussinessLogic/Security/Auth.Context";
import { Roles } from "../../Helpers/Constants";

const ManageProcedureTypes = () => {

    const [user, setUser] = useState<LoginModel | null>(null);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedProcedureType, setSelectedProcedureType] = useState<ProcedureTypeModel | undefined>(undefined);

    const procedureTypeTableRef = useRef<{ loadData: () => void }>(null);

    const { getUser } = useAuth();
    const handleEdit = (procedureType: ProcedureTypeModel) => {

        setIsEdit(true);
        setSelectedProcedureType(procedureType);
    };

    const navItems = [
        { name: "Home", link: "/" },
        { name: "ProcedureTypes", link: undefined },
        { name: "Manage", link: undefined }
    ];
    const title = "Manage ProcedureTypes";

    useEffect(() => {
        setUser(getUser());
        setIsEdit(false);

    }, []);



    return (
        <>
            <Breadcrumbs nav={navItems} title={title} />
            <div className=" w-full flex">
                {user?.role == Roles.admin.id && <div className="w-[30%] flex-auto p-5 mr-1 dark:bg-[#2a323d]">
                    <ProcedureTypeForm
                        isEdit={isEdit}
                        initialValues={selectedProcedureType!}
                        loadData={() => procedureTypeTableRef.current?.loadData()}
                    />

                </div>}
                <div className="w-[69%] flex-auto">
                    <ProcedureTypeTable role={user?.role ?? -1} onEdit={(selectedProcedureType) => handleEdit(selectedProcedureType!)} ref={procedureTypeTableRef} />
                </div>
            </div>
        </>
    )
};

ManageProcedureTypes.getLayout = (page: JSX.Element) => {
    return (
        <Layout>{page}</Layout>
    )
}
export default ManageProcedureTypes