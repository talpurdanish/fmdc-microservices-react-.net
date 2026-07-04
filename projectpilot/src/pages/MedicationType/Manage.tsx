import { Layout } from "../../Layout/main_layout/Layout"
import Breadcrumbs from "../CommonWidgets/Breadcrumbs";

import { useState, useEffect, useRef, type JSX } from 'react';

import { type MedicationTypeModel } from "../../BussinessLogic/Models/MedicationType.Model";

import { MedicationTypeForm } from "./Form";
import { MedicationTypeTable } from "./Table";
import type { LoginModel } from "../../BussinessLogic/Models/Login.Model";
import { useAuth } from "../../BussinessLogic/Security/Auth.Context";
import { Roles } from "../../Helpers/Constants";

const ManageMedicationTypes = () => {

    const [user, setUser] = useState<LoginModel | null>(null);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedMedicationType, setSelectedMedicationType] = useState<MedicationTypeModel | undefined>(undefined);

    const medicationTypeTableRef = useRef<{ loadData: () => void }>(null);

    const { getUser } = useAuth();
    const handleEdit = (medicationType: MedicationTypeModel) => {

        setIsEdit(true);
        setSelectedMedicationType(medicationType);
    };

    const navItems = [
        { name: "Home", link: "/" },
        { name: "MedicationTypes", link: undefined },
        { name: "Manage", link: undefined }
    ];
    const title = "Manage MedicationTypes";

    useEffect(() => {
        setUser(getUser());
        setIsEdit(false);

    }, []);

    return (
        <>
            <Breadcrumbs nav={navItems} title={title} />
            <div className=" w-full flex">
                {user?.role == Roles.admin.id && <div className="w-[30%] flex-auto p-5 mr-1 dark:bg-[#2a323d]">
                    <MedicationTypeForm
                        isEdit={isEdit}
                        initialValues={selectedMedicationType!}
                        loadData={() => medicationTypeTableRef.current?.loadData()}
                    />

                </div>}
                <div className="w-[69%] flex-auto">
                    <MedicationTypeTable role={user?.role ?? -1} onEdit={(selectedMedicationType) => handleEdit(selectedMedicationType!)} ref={medicationTypeTableRef} />
                </div>
            </div>
        </>
    )
};

ManageMedicationTypes.getLayout = (page: JSX.Element) => {
    return (
        <Layout>{page}</Layout>
    )
}
export default ManageMedicationTypes