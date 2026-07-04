
import { appointmentsService } from "../../BussinessLogic/Index.Service";
import { type AppointmentModel } from "../../BussinessLogic/Models/Appointment.Model";
import { Constants, formatDate, Roles } from "../../Helpers/Constants";
import { useGetApi } from "../../BussinessLogic/Hooks/UseGetApi";
import type { PartialProps } from '../CommonWidgets/PartialProps';
import { useEffect, useState } from 'react';
import { CalendarCheck2Icon, ChevronLeft } from 'lucide-react';
import type { LoginModel } from '../../BussinessLogic/Models/Login.Model';
import { useAuth } from '../../BussinessLogic/Security/Auth.Context';
import { useMutationApi } from '../../BussinessLogic/Hooks/UseMutationsApi';
import { showSuccess, showError } from '../../Helpers/Toast.Helper';
import { useRefreshContext } from '../../BussinessLogic/Hooks/UseRefreshContext';
import { Panel } from '../CommonWidgets/Panel';
import type { PagedResults } from '../../BussinessLogic/Models/Generics/PagedResults';
import type { Filter } from '../../BussinessLogic/Models/Generics/Filter';
import createDefaultFilter from '../../BussinessLogic/Models/Generics/Filter';
import type { ColumnConfig } from '../CommonWidgets/TableColumn';
import { Table } from '../CommonWidgets/Table';


const ViewAppointmentsPartial = ({ id, pending = false, refresh = false, withPanel = false }: PartialProps) => {

    const { getUser } = useAuth();
    const [user, setUser] = useState<LoginModel | null>(null);
    const { register, unregister } = useRefreshContext();
    const [appointmentsDisabled, setAppointmentsDisabled] = useState<boolean>(true);

    const [filter, setFilter] = useState<Filter>(
        createDefaultFilter()
    );

    const { data: appointments, loading, refetch } = useGetApi<PagedResults<AppointmentModel>, Filter>(
        (filter) =>
            pending ? appointmentsService.GetPendingAppointments(filter) : appointmentsService.GetPatientAppointments(filter),
        { immediate: true, payload: filter! },
        [filter]
    );

    useEffect(() => {
        if (id != undefined)
            setFilter(prev => ({
                ...prev,
                id: id!
            }));
    }, [id])

    const { mutate: addEndDateCall } = useMutationApi<boolean, number>((id) => appointmentsService.AddEndDate(id!, "a"), {
        optimisticUpdate: () => {
            refetch();
        },
        onSuccess: () => {
            showSuccess("Appointment has been ended");
        },
        onError: () => {
            showError("Appointment could not be ended");
        },
    });

    useEffect(() => {
        if (!pending)
            return;
        const u = getUser();
        setUser(u!);
    }, [pending, setUser]);

    const dateTemplate = (rowData: AppointmentModel) => {
        const date = new Date(rowData.Date);
        return formatDate(date, "dd-MM-yy");
    };

    const endDateTemplate = (rowData: AppointmentModel) => {
        if (rowData.EndDate == null) return "-";
        const date = new Date(rowData.EndDate);
        return formatDate(date, "dd-MM-yy");
    };
    const actionBodyTemplate = (rowData: AppointmentModel) => (
        <button className="btn btn-gray btn-padding-md btn-rounded btn-border" onClick={() => addEndDateCall(rowData.id)}>
            <ChevronLeft className="w-5 mx-auto" />
        </button>
    );

    useEffect(() => {
        const d = appointments == undefined || appointments?.data.length == 0;
        setAppointmentsDisabled(d);

    }, [appointments])


    useEffect(() => {
        register(Constants.APPOINTMENT_TRIGGER, refetch);
        return () => unregister(Constants.APPOINTMENT_TRIGGER);
    }, [register, unregister, refetch]);

    const columnConfig: ColumnConfig<AppointmentModel>[] = [
        { key: "a1", header: pending ? "Date" : "Start Date", body: dateTemplate, style: { width: "5%" }, sortable: true },
        { key: "a2", header: pending ? "Time" : "Start Time", field: "StartTime", style: { width: "12%" }, sortable: true },
        { key: "a3", header: "End Date", body: endDateTemplate, style: { width: "12%" }, sortable: true, columnCondition: !pending },
        { key: "a4", header: "End Time", field: "EndTime", style: { width: "12%" }, sortable: true, columnCondition: !pending },
        { key: "a5", field: "DoctorName", header: "Doctor", style: { width: "19%" }, sortable: true },
        { key: "a6", field: "PatientName", header: "Patient", style: { width: "18%" }, sortable: true },
        { key: "a7", header: "Action", body: actionBodyTemplate, style: { width: "10%" }, columnCondition: user?.role != undefined && user?.role == Roles.admin.id }
    ];

    const dataTable = (
        <Table<AppointmentModel>
            data={appointments!}
            loading={loading}
            showHeader={false}
            title="appointments"
            columns={columnConfig}
            setFilter={(f) => setFilter(f)}
            filter={filter}
            refresh={() => refetch()}
            showPaging={!pending}
        />
    );

    const panel = (
        withPanel ?
            <Panel
                disabled={appointmentsDisabled}
                title={`${pending ? "Pending" : ""} Appointments`}
                icon={<CalendarCheck2Icon className="w-5" />}
                fullToggle={!refresh}
                alertMessage={`Total ${appointments?.totalRecords} records`}
                refresh={() => { refetch() }} >
                {dataTable}
            </Panel>
            : dataTable
    );


    return (
        <>
            {panel}
        </>
    )
}

export default ViewAppointmentsPartial