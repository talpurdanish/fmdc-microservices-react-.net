import { Layout } from "../../Layout/main_layout/Layout"
import Breadcrumbs from "../CommonWidgets/Breadcrumbs";

import { useState, useEffect, useRef, type JSX } from 'react';

import { type MedicationModel } from "../../BussinessLogic/Models/Medication.Model";

import { MedicationForm } from "./Form";
import { MedicationTable } from "./Table";
import type { LoginModel } from "../../BussinessLogic/Models/Login.Model";
import { useAuth } from "../../BussinessLogic/Security/Auth.Context";
import { Roles } from "../../Helpers/Constants";
import { useGetApi } from "../../BussinessLogic/Hooks/UseGetApi";
import { type MedicationTypeModel } from "../../BussinessLogic/Models/MedicationType.Model";

import { medicationTypesService } from "../../BussinessLogic/Index.Service";

import type { NameIdPair } from "../../BussinessLogic/Models/Generics/NameIdPair";

const ManageMedications = () => {

    const [user, setUser] = useState<LoginModel | null>(null);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedMedication, setSelectedMedication] = useState<MedicationModel | undefined>(undefined);

    const medicationTableRef = useRef<{ loadData: () => void }>(null);

    const { getUser } = useAuth();
    const handleEdit = (medication: MedicationModel) => {
        setIsEdit(true);
        setSelectedMedication(medication);
    };

    const { data: types } = useGetApi<NameIdPair[]>(
        async () => {
            const models: MedicationTypeModel[] = (await medicationTypesService.GetMedicationTypes(true)).data;
            return models.map(p => ({
                id: p.id,
                name: p.name,
            }));
        },
        { immediate: true },
    );

    const navItems = [
        { name: "Home", link: "/" },
        { name: "Medications", link: undefined },
        { name: "Manage", link: undefined }
    ];
    const title = "Manage Medications";

    useEffect(() => {
        setUser(getUser());
        setIsEdit(false);

    }, []);



    return (
        <>
            <Breadcrumbs nav={navItems} title={title} />
            <div className=" w-full flex">
                {user?.role == Roles.admin.id && <div className="w-[30%] flex-auto p-5 mr-1 dark:bg-[#2a323d]">
                    <MedicationForm
                        types={types!}
                        isEdit={isEdit}
                        initialValues={selectedMedication!}
                        loadData={() => medicationTableRef.current?.loadData()}
                    />

                </div>}
                <div className="w-[69%] flex-auto">
                    <MedicationTable role={user?.role ?? -1} onEdit={(selectedMedication) => handleEdit(selectedMedication!)} ref={medicationTableRef}
                        types={types!}
                    />
                </div>
            </div>
        </>
    )
};

ManageMedications.getLayout = (page: JSX.Element) => {
    return (
        <Layout>{page}</Layout>
    )
}
export default ManageMedications