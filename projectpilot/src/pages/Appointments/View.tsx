import { Layout } from "../../Layout/main_layout/Layout"
import Breadcrumbs from "../CommonWidgets/Breadcrumbs";

import { useState, useEffect } from 'react';

import { appointmentsService } from "../../BussinessLogic/Index.Service";
import { type AppointmentModel } from "../../BussinessLogic/Models/Appointment.Model";
import {
    CircleXIcon,

    TrashIcon,
} from "lucide-react";
import createDefaultFilter, { type Filter } from "../../BussinessLogic/Models/Generics/Filter";

import { formatDate, Roles } from "../../Helpers/Constants";

import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

import type { LoginModel } from "../../BussinessLogic/Models/Login.Model";
import { useAuth } from "../../BussinessLogic/Security/Auth.Context";
import { useMutationApi } from "../../BussinessLogic/Hooks/UseMutationsApi";
import { useGetApi } from "../../BussinessLogic/Hooks/UseGetApi";
import { showError, showSuccess } from "../../Helpers/Toast.Helper";
import type { PagedResults } from "../../BussinessLogic/Models/Generics/PagedResults";
import { Table } from "../CommonWidgets/Table";
import type { ColumnConfig } from "../CommonWidgets/TableColumn";


const ViewAppointments = () => {
    const { getUser } = useAuth();
    const [user, setUser] = useState<LoginModel | null>(null);
    const [filter, setFilter] = useState<Filter>(
        createDefaultFilter()
    );

    const { mutate: deleteAppointment } = useMutationApi
        <boolean, number>((id) => appointmentsService.DeleteAppointment(id ?? -1), {
            optimisticUpdate: () => refetch(),
            onSuccess: () => showSuccess("Appointment has been deleted"),
            onError: () => showError("Appointment could not be deleted"),
        });

    const { data: appointments, loading, refetch } = useGetApi<PagedResults<AppointmentModel>, Filter>(
        (filter) => appointmentsService.GetAppointments(filter!),
        { immediate: true, payload: filter },
        [filter]
    );

    useEffect(() => {
        const u = getUser();
        setUser(u!);
    }, []);


    const confirmDelete = (id: number) => {
        confirmDialog({
            message: 'Do you want to change the delet this appointment?',
            header: 'Change Status Confirmation',
            icon: <CircleXIcon />,
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept: () => deleteAppt(id),
            reject: () => { }
        });
    };

    const deleteAppt = async (id: number) => {
        await deleteAppointment(id);
    };

    const navItems = [
        { name: "Home", link: "/" },
        { name: "Appointments", link: undefined },
        { name: "View", link: undefined } // last breadcrumb, no link
    ];
    const title = "View Appointments";

    const appointmentDateTemplate = (rowData: AppointmentModel) => {
        if (rowData.Date == null) return "-";
        const date = new Date(rowData.Date);
        return formatDate(date, "dd-MM-yy");
    };

    const appointmentEndDateTemplate = (rowData: AppointmentModel) => {
        if (rowData.EndDate == null) return "-";
        const date = new Date(rowData.EndDate);
        return formatDate(date, "dd-MM-yy");
    };

    const startTimeTemplate = (rowData: AppointmentModel) => {
        if (rowData.StartTime == null) return "-";
        return `${rowData.StartTime} hrs`;
    };

    const endTimeTemplate = (rowData: AppointmentModel) => {
        if (rowData.EndTime == null) return "-";
        return `${rowData.EndTime} hrs`;
    };

    const actionBodyTemplate = (rowData: AppointmentModel) => (
        <div className="btn-group">
            <button className="btn btn-danger btn-padding-md" onClick={() => confirmDelete(rowData.id)}>
                <TrashIcon className="w-5 mx-auto" />
            </button>
        </div>
    );

    const columnConfig: ColumnConfig<AppointmentModel>[] = [
        { key: "1", field: "id", header: "ID", style: { width: "5%" }, sortable: true },
        { key: "2", header: "Start Date", body: appointmentDateTemplate, style: { width: "12%" }, sortable: true },
        { key: "3", header: "Start Time", body: startTimeTemplate, style: { width: "12%" }, sortable: true },
        { key: "4", header: "End Date", body: appointmentEndDateTemplate, style: { width: "12%" }, sortable: true },
        { key: "5", header: "End Time", body: endTimeTemplate, style: { width: "12%" }, sortable: true },
        { key: "6", field: "DoctorName", header: "Doctor", style: { width: "19%" }, sortable: true },
        { key: "7", field: "PatientName", header: "Patient", style: { width: "18%" }, sortable: true },
        { key: "8", header: "Action", body: actionBodyTemplate, style: { width: "10%" }, columnCondition: user?.role != undefined && user?.role == Roles.admin.id }
    ];

    return (
        <>
            <ConfirmDialog />
            <Breadcrumbs nav={navItems} title={title} />
            <div className="bg-gray-300 dark:bg-gray-700 w-full p-2 mb-3 mt-5">
                <Table<AppointmentModel>
                    data={appointments!}
                    loading={loading}
                    title="appointments"
                    columns={columnConfig}
                    setFilter={(f) => setFilter(f)}
                    filter={filter}
                    refresh={() => refetch()}
                />
            </div>
        </>
    )
}

ViewAppointments.getLayout = (page: any) => {
    return (
        <Layout>{page}</Layout>
    )
}
export default ViewAppointments