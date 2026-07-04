import { prescriptionsService } from "../../BussinessLogic/Index.Service";
import { useGetApi } from "../../BussinessLogic/Hooks/UseGetApi";
import type { PartialProps } from "../CommonWidgets/PartialProps";

import type { PrescriptionModel } from "../../BussinessLogic/Models/Prescription.Model";
import type { PagedResults } from "../../BussinessLogic/Models/Generics/PagedResults";
import { useEffect, useState } from "react";
import createDefaultFilter, { type Filter } from "../../BussinessLogic/Models/Generics/Filter";
import { formatDate } from "../../Helpers/Constants";
import type { ColumnConfig } from "../CommonWidgets/TableColumn";
import { Table } from "../CommonWidgets/Table";

const ViewPrescriptionPartial = ({ id }: PartialProps) => {

    const [filter, setFilter] = useState<Filter>(
        createDefaultFilter()
    );

    const { data: prescriptions, loading, refetch } = useGetApi<PagedResults<PrescriptionModel>, Filter>(
        (filter) =>
            prescriptionsService.GetPatientPrescriptions(filter!),
        { immediate: true, payload: filter },
        [filter]
    );

    useEffect(() => {
        setFilter(prev => ({
            ...prev,
            id: id!
        }));
    }, [id]);

    const prescriptionDateTemplate = (rowData: PrescriptionModel) => {
        const date = new Date(rowData.Date);
        return formatDate(date, "dd-MM-yy");
    };


    const columnConfig: ColumnConfig<PrescriptionModel>[] = [
        { key: "1", header: "ID", field: "id", style: { width: "5%" }, sortable: true },
        { key: "2", header: "Date", body: prescriptionDateTemplate, style: { width: "12%" }, sortable: true },
        { key: "3", header: "Start", field: "StartTime", style: { width: "12%" }, sortable: true },
        { key: "4", header: "Doctor", field: "Doctor", style: { width: "19%" }, sortable: true },
        { key: "5", header: "Patient", field: "PatientName", style: { width: "19%" }, sortable: true },
    ];

    return (
        <>
            <Table<PrescriptionModel>
                data={prescriptions!}
                loading={loading}
                showHeader={false}
                title="prescriptions"
                columns={columnConfig}
                setFilter={(f) => setFilter(f)}
                filter={filter}
                refresh={() => refetch()}
            />
        </>
    );
};


export default ViewPrescriptionPartial;
