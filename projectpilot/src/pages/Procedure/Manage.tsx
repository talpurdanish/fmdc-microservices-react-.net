import { Layout } from "../../Layout/main_layout/Layout"
import Breadcrumbs from "../CommonWidgets/Breadcrumbs";

import { useState, useEffect, useRef, type JSX } from 'react';

import { type ProcedureModel } from "../../BussinessLogic/Models/Procedure.Model";

import { ProcedureForm } from "./Form";
import { ProcedureTable } from "./Table";
import type { LoginModel } from "../../BussinessLogic/Models/Login.Model";
import { useAuth } from "../../BussinessLogic/Security/Auth.Context";
import { Roles } from "../../Helpers/Constants";
import { useGetApi } from "../../BussinessLogic/Hooks/UseGetApi";
import { procedureTypesService } from "../../BussinessLogic/Index.Service";
import { createNameIdPair, type NameIdPair } from "../../BussinessLogic/Models/Generics/NameIdPair";

const ManageProcedures = () => {

    const [user, setUser] = useState<LoginModel | null>(null);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedProcedure, setSelectedProcedure] = useState<ProcedureModel | undefined>(undefined);

    const medicationTableRef = useRef<{ loadData: () => void }>(null);

    const { getUser } = useAuth();
    const handleEdit = (medication: ProcedureModel) => {
        setIsEdit(true);
        setSelectedProcedure(medication);
    };

    const { data: types } = useGetApi<NameIdPair[]>(
        async () => {
            const models = (await procedureTypesService.GetProcedureTypes(true)).data;
            return models.map((item) => {
                const raw = { id: item.id, name: item.name };
                return createNameIdPair(raw);
            });
        },
        { immediate: true },
    );

    const navItems = [
        { name: "Home", link: "/" },
        { name: "Procedures", link: undefined },
        { name: "Manage", link: undefined }
    ];
    const title = "Manage Procedures";

    useEffect(() => {
        setUser(getUser());
        setIsEdit(false);

    }, []);



    return (
        <>
            <Breadcrumbs nav={navItems} title={title} />
            <div className=" w-full flex">
                {user?.role == Roles.admin.id && <div className="w-[30%] flex-auto p-5 mr-1 dark:bg-[#2a323d]">
                    <ProcedureForm
                        isEdit={isEdit}
                        initialValues={selectedProcedure!}
                        loadData={() => medicationTableRef.current?.loadData()}
                        types={types!}
                    />

                </div>}
                <div className="w-[69%] flex-auto">
                    <ProcedureTable role={user?.role ?? -1} onEdit={(selectedProcedure) => handleEdit(selectedProcedure!)} ref={medicationTableRef}
                        types={types!} />
                </div>
            </div>
        </>
    )
};

ManageProcedures.getLayout = (page: JSX.Element) => {
    return (
        <Layout>{page}</Layout>
    )
}
export default ManageProcedures