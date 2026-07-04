import { MarsIcon, PrinterIcon, ShieldCheckIcon, TestTubesIcon, TextCursorInputIcon, TransgenderIcon, VenusIcon } from "lucide-react";
import { type LabReportModel } from "../../../BussinessLogic/Models/LabReport.Model";
import { useGetApi } from "../../../BussinessLogic/Hooks/UseGetApi";
import { labReportsService } from "../../../BussinessLogic/Index.Service";
import type { PartialProps } from "../../CommonWidgets/PartialProps";
import { useEffect, useState } from "react";
import type { LoginModel } from "../../../BussinessLogic/Models/Login.Model";
import { useAuth } from "../../../BussinessLogic/Security/Auth.Context";
import { Roles } from "../../../Helpers/Constants";
import { UpdateReport } from "./Update";
import { Dialog } from "primereact/dialog";
import { Viewer } from "../../CommonWidgets/Viewer";
import { Panel } from "../../CommonWidgets/Panel";
import type { PagedResults } from "../../../BussinessLogic/Models/Generics/PagedResults";
import type { Filter } from "../../../BussinessLogic/Models/Generics/Filter";
import createDefaultFilter from "../../../BussinessLogic/Models/Generics/Filter";
import { Table } from "../../CommonWidgets/Table";
import type { ColumnConfig } from "../../CommonWidgets/TableColumn";


export const ViewLabReportsPartial = ({ id, pending = false, onPrescription = false, refresh = false, withPanel = false }: PartialProps) => {

    const { getUser } = useAuth();
    const [user, setUser] = useState<LoginModel | null>(null);
    const [showUpdate, setShowUpdate] = useState<boolean>(false);
    const [reportId, setReportId] = useState<number>();
    const [showReport, setShowReport] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');
    const [labReportsId, setLabReportsId] = useState<number>();
    const [labReportsDisabled, setLabReportsDisabled] = useState<boolean>(true);
    const [filter, setFilter] = useState<Filter>(
        createDefaultFilter()
    );

    const { data: reports, loading, refetch } = useGetApi<PagedResults<LabReportModel>, Filter>(
        (filter) =>
            pending ? labReportsService.GetPendingLabReports() : labReportsService.GetPatientReports(filter!),
        { immediate: true, payload: filter! },
        [filter]
    );

    useEffect(() => {
        setFilter(prev => ({
            ...prev,
            id: id!
        }));
    }, [id])

    const printReport = (id: number, title: string) => {
        setLabReportsId(id);
        setTitle(title);
        setShowReport(true);
    }

    const updateValues = (id: number) => {
        setReportId(id);
        setShowUpdate(true);
    }

    useEffect(() => {
        if (!pending)
            return;
        const u = getUser();
        setUser(u!);

    }, []);

    useEffect(() => {

        setLabReportsDisabled(reports == undefined || reports?.data.length == 0);
    }, [reports])

    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <span className="font-bold white-space-nowrap">Update Report</span>
        </div>
    );

    const genderHeaderIcon = () => {
        return (<ShieldCheckIcon />);
    }


    const genderTemplate = (rowData: LabReportModel) => {
        return <div className=" items-center justify-center">
            {rowData.PatientGender == 1 ? (
                <MarsIcon className="text-blue-500 dark:text-blue-300" />
            ) : rowData.PatientGender == 2 ? (
                <VenusIcon className="text-pink-500 dark:text-pink-300" />
            ) : rowData.PatientGender == 3 ? (
                <TransgenderIcon className="text-purple-500 dark:text-purple-300" />
            ) : "-"}
        </div>;
    };


    const bodyTemplate = (rowData: LabReportModel) => {

        return pending ?
            <div className="btn-group">
                <button className="btn btn-info btn-padding-sm" onClick={() => updateValues(rowData.id)}>
                    <TextCursorInputIcon className="w-5 mx-auto" />
                </button>
            </div> :
            <div className="btn-group">
                <button className="btn btn-gray btn-padding-sm" onClick={() => printReport(rowData.id, `Report for {${rowData.TestName} for ${rowData.PatientName}}`)}>
                    <PrinterIcon className="w-5 mx-auto" />
                </button>
            </div>;
    }

    const columnConfig: ColumnConfig<LabReportModel>[] = [
        { key: "l1", field: "id", header: "ID", style: { width: "5%" }, sortable: true },
        { key: "l2", header: "Report Date", field: "ReportDate", style: { width: "12%" }, sortable: true },
        { key: "l3", header: "Delivery Date", field: "ReportDeliveryDate", style: { width: "12%" }, sortable: true, columnCondition: (pending || !onPrescription) },
        { key: "l4", header: "Test", field: "TestName", style: { width: "12%" }, sortable: true },
        { key: "l5", header: "Doctor", field: "Doctor", style: { width: "12%" }, sortable: true },
        { key: "l5", header: "Patient", field: "PatientName", style: { width: "12%" }, sortable: true },
        { key: "l6", header: genderHeaderIcon, body: genderTemplate, style: { width: "5%" }, sortable: true, columnCondition: (pending || !onPrescription) },
        { key: "l7", header: "Status", field: "Status", style: { width: "12%" }, sortable: true, columnCondition: (!pending || onPrescription) },
        { key: "l8", header: "Action", body: bodyTemplate, style: { width: "10%" }, columnCondition: (pending || onPrescription) && user?.role == Roles.admin.id }
    ];



    const dataTable = (
        <Table<LabReportModel>
            data={reports!}
            loading={loading}
            showHeader={false}
            title="reports"
            columns={columnConfig}
            setFilter={(f) => setFilter(f)}
            filter={filter}
            refresh={() => refetch()}
            showPaging={!pending && !onPrescription}
        />
    );

    const panel = (
        withPanel ?
            <Panel
                disabled={labReportsDisabled}
                title={"Pending Lab Reports"}
                icon={<TestTubesIcon className="w-5" />}
                fullToggle={!refresh}
                refresh={() => { refetch() }}
                alertMessage={`Total ${reports?.totalRecords} records`}
            >
                {dataTable}
            </Panel>
            : dataTable
    );


    return (
        <>
            {panel}
            {showUpdate &&
                <Dialog visible={showUpdate} modal header={headerElement} maximizable className="w-[70%]" onHide={() => setShowUpdate(false)}>
                    <div style={{ width: "100%" }}>
                        <UpdateReport id={reportId!} loadData={() => refetch()} hide={() => setShowUpdate(false)} />
                    </div>
                </Dialog>
            }

            {showReport && <Viewer
                visible={showReport}
                hide={() => setShowReport(false)}
                id={labReportsId!}
                title={title!}
                serviceFn={(id) => labReportsService.GenerateReport(id)}
            />}
        </>
    );
};