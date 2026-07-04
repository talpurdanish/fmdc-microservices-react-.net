import { Layout } from "../../Layout/main_layout/Layout"
import Breadcrumbs from "../CommonWidgets/Breadcrumbs";

import { useState, useEffect } from 'react';
import { prescriptionsService } from "../../BussinessLogic/Index.Service";
import { ApiResponse } from "../../BussinessLogic/Models/Generics/ApiResponse";
import { type PrescriptionModel } from "../../BussinessLogic/Models/Prescription.Model";

import {
    CircleXIcon,

    TrashIcon,
} from "lucide-react";
import createDefaultFilter, { type Filter } from "../../BussinessLogic/Models/Generics/Filter";

import { formatDate, Roles } from "../../Helpers/Constants";

import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

import type { LoginModel } from "../../BussinessLogic/Models/Login.Model";
import { useAuth } from "../../BussinessLogic/Security/Auth.Context";
import { showError, showSuccess } from "../../Helpers/Toast.Helper";
import { useGetApi } from "../../BussinessLogic/Hooks/UseGetApi";
import type { PagedResults } from "../../BussinessLogic/Models/Generics/PagedResults";
import type { ColumnConfig } from "../CommonWidgets/TableColumn";
import { Table } from "../CommonWidgets/Table";


const ViewPrescriptions = () => {
    const { getUser } = useAuth();

    const [user, setUser] = useState<LoginModel | null>(null);
    const [filter, setFilter] = useState<Filter>(
        createDefaultFilter()
    );
    const { execute: deletePrescription } = useGetApi<boolean, number>((id) => prescriptionsService.DeletePrescription(id ?? -1));
    const { data: prescriptions, loading, refetch } = useGetApi<PagedResults<PrescriptionModel>, Filter>(
        (filter) =>
            prescriptionsService.GetPrescriptions(filter!),
        { immediate: true, payload: filter },
        [filter]
    );

    useEffect(() => {
        const u = getUser();
        setUser(u!);
    }, []);


    const confirmDelete = (id: number) => {
        confirmDialog({
            message: 'Do you want to change the delet this prescription?',
            header: 'Change Status Confirmation',
            icon: <CircleXIcon />,
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept: () => deleteAppt(id),
            reject: () => { }
        });
    };

    const deleteAppt = async (id: number) => {
        const response = await deletePrescription(id);
        const resModel = new ApiResponse<boolean>(response);
        if (resModel.isSuccess()) {
            refetch();
            showSuccess("Prescription has been deleted");
        }
        if (resModel.isFailure()) {
            showError("Prescription could not be deleted");
        }
    };

    const navItems = [
        { name: "Home", link: "/" },
        { name: "Prescriptions", link: undefined },
        { name: "View", link: undefined } // last breadcrumb, no link
    ];
    const title = "View Prescriptions";

    const prescriptionDateTemplate = (rowData: PrescriptionModel) => {
        const date = new Date(rowData.Date);
        return formatDate(date, "dd-MM-yy");
    };


    const actionBodyTemplate = (rowData: PrescriptionModel) => (
        <div className="btn-group">
            <button className="btn btn-danger btn-padding-md" onClick={() => confirmDelete(rowData.id)}>
                <TrashIcon className="w-5 mx-auto" />
            </button>
        </div>
    );

    const columnConfig: ColumnConfig<PrescriptionModel>[] = [
        { key: "1", header: "ID", field: "id", style: { width: "5%" }, sortable: true },
        { key: "2", header: "Date", body: prescriptionDateTemplate, style: { width: "12%" }, sortable: true },
        { key: "3", header: "Start", field: "StartTime", style: { width: "12%" }, sortable: true },
        { key: "4", header: "Doctor", field: "Doctor", style: { width: "19%" }, sortable: true },
        { key: "5", header: "Patient", field: "PatientName", style: { width: "19%" }, sortable: true },
        { key: "6", header: "Action", body: actionBodyTemplate, style: { width: "10%" }, columnCondition: user?.role == Roles.admin.id }
    ];

    return (
        <>

            <ConfirmDialog />
            <Breadcrumbs nav={navItems} title={title} />
            <div className="bg-gray-300 dark:bg-gray-700 w-full p-2 mb-3 mt-5">
                <Table<PrescriptionModel>
                    data={prescriptions!}
                    loading={loading}
                    title="prescriptions"
                    columns={columnConfig}
                    setFilter={(f) => setFilter(f)}
                    filter={filter}
                    refresh={() => refetch()}
                />
            </div>

        </>
    )
}

ViewPrescriptions.getLayout = (page: any) => {
    return (
        <Layout>{page}</Layout>
    )
}
export default ViewPrescriptions