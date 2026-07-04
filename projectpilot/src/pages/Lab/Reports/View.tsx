import { PrinterIcon, SquarePenIcon, TextCursorInputIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import createDefaultFilter, { type Filter } from "../../../BussinessLogic/Models/Generics/Filter";
import { type LabReportModel } from "../../../BussinessLogic/Models/LabReport.Model";
import { labReportsService } from "../../../BussinessLogic/Index.Service";
import { Roles } from "../../../Helpers/Constants";

import { useMutationApi } from "../../../BussinessLogic/Hooks/UseMutationsApi";
import { UpdateReport } from "./Update";
import { Viewer } from "../../CommonWidgets/Viewer";
import { showError, showSuccess } from "../../../Helpers/Toast.Helper";
import type { PagedResults } from "../../../BussinessLogic/Models/Generics/PagedResults";
import type { ColumnConfig } from "../../CommonWidgets/TableColumn";
import { Table } from "../../CommonWidgets/Table";

type Props = {
    onEdit: (labReport: LabReportModel) => void;
    role: number;
    loadData: (filter: Filter) => void;
    reports: PagedResults<LabReportModel>;
    loading: boolean;
};

export const LabReportTable = ({ onEdit, role, loadData, reports, loading }: Props) => {

    const [filter, setFilter] = useState<Filter>(
        createDefaultFilter()
    );
    const [showUpdate, setShowUpdate] = useState<boolean>(false);
    const [showReport, setShowReport] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');
    const [id, setId] = useState<number>();


    const { mutate: deleteCall } = useMutationApi<boolean, number>((id) => labReportsService.DeleteLabReport(id!), {
        optimisticUpdate: () => loadData(filter),
        onSuccess: () => showSuccess("Lab Report has been deleted"),
        onError: () => showError("Lab Report  could not be deleted"),
    });

    const printReport = (id: number, title: string) => {
        setId(id);
        setTitle(title);
        setShowReport(true);
    }

    const updateValues = (id: number) => {
        setId(id);
        setShowUpdate(true);
    }

    const deleteLabReport = async (id: number) => {
        await deleteCall(id);
    };

    const editLabReport = (labReport: LabReportModel) => {
        onEdit(labReport);
    }

    const actionBodyTemplate = (rowData: LabReportModel) => (
        <div className="btn-group">
            <button className="btn btn-warning btn-padding-sm" onClick={() => editLabReport(rowData)}>
                <SquarePenIcon className="w-5 mx-auto" />
            </button>
            <button className="btn btn-danger btn-padding-sm" onClick={() => deleteLabReport(rowData.id)}>
                <TrashIcon className="w-5 mx-auto" />
            </button>
            {rowData.Status == "Completed" ?
                <button className="btn btn-gray btn-padding-sm" onClick={() => printReport(rowData.id, `Report for {${rowData.TestName} for ${rowData.PatientName}}`)}>
                    <PrinterIcon className="w-5 mx-auto" />
                </button>
                :
                <button className="btn btn-info btn-padding-sm" onClick={() => updateValues(rowData.id)}>
                    <TextCursorInputIcon className="w-5 mx-auto" />
                </button>}

        </div>
    );

    const dateTemplate = (rowData: LabReportModel) => {
        return <span>{rowData.ReportDate} {rowData.ReportTime} hrs</span>
    };

    const deliveryDateTemplate = (rowData: LabReportModel) => {
        return <span>{rowData.ReportDeliveryDate} {rowData.ReportDeliveryTime} hrs</span>
    };

    const columnConfig: ColumnConfig<LabReportModel>[] = [
        { key: "1", field: "id", header: "ID", style: { width: "5%" }, sortable: true },
        { key: "2", header: "Report Date", body: dateTemplate, style: { width: "16%" }, sortable: true },
        { key: "3", header: "Delivery Date", body: deliveryDateTemplate, style: { width: "16%" }, sortable: true },
        { key: "4", header: "Test", field: "TestName", style: { width: "12%" }, sortable: true },
        { key: "6", header: "Doctor", field: "Doctor", style: { width: "15%" }, sortable: true },
        { key: "6", header: "Status", field: "Status", style: { width: "15%" }, sortable: true },
        { key: "8", header: "Action", body: actionBodyTemplate, style: { width: "10%" }, columnCondition: role == Roles.admin.id }
    ];


    return (
        <>
            <Table<LabReportModel>
                data={reports!}
                loading={loading}
                title="reports"
                columns={columnConfig}
                setFilter={(f) => setFilter(f)}
                filter={filter}
                refresh={() => loadData(filter)}
            />
            {showUpdate && <UpdateReport id={id!} loadData={() => loadData(filter)} filter={filter} hide={() => setShowUpdate(false)} />}

            {showReport && <Viewer
                visible={showReport}
                hide={() => setShowReport(false)}
                id={id!}
                title={title!}
                serviceFn={(id) => labReportsService.GenerateReport(id)}
            />}
        </>
    );
};