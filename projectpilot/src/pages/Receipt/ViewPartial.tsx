import { type ReceiptModel } from "../../BussinessLogic/Models/Receipt.Model";
import { patientsService, receiptsService } from "../../BussinessLogic/Index.Service";
import { useGetApi } from "../../BussinessLogic/Hooks/UseGetApi";
import type { PartialProps } from "../CommonWidgets/PartialProps";
import { useEffect, useState } from "react";
import type { LoginModel } from "../../BussinessLogic/Models/Login.Model";
import { useAuth } from "../../BussinessLogic/Security/Auth.Context";
import { Constants, Roles } from "../../Helpers/Constants";
import { BanknoteArrowUp, CoinsIcon, PrinterIcon } from "lucide-react";
import { Viewer } from "../CommonWidgets/Viewer";
import { PayWithStripe } from "./PayWithStripe";
import type { PatientModel } from "../../BussinessLogic/Models/Patient.Model";
import { useRefreshContext } from "../../BussinessLogic/Hooks/UseRefreshContext";
import { Panel } from "../CommonWidgets/Panel";
import type { PagedResults } from "../../BussinessLogic/Models/Generics/PagedResults";
import type { Filter } from "../../BussinessLogic/Models/Generics/Filter";
import createDefaultFilter from "../../BussinessLogic/Models/Generics/Filter";
import type { ColumnConfig } from "../CommonWidgets/TableColumn";
import { Table } from "../CommonWidgets/Table";

const ViewReceiptsPartial = ({ id, pending = false, refresh = false, withPanel = false }: PartialProps) => {
    const { state, getUser } = useAuth();
    const [user, setUser] = useState<LoginModel | null>(null);
    const [filter, setFilter] = useState<Filter>(
        createDefaultFilter()
    );
    const [showPayment, setShowPayment] = useState<boolean>(false);
    const [receiptId, setReceiptId] = useState<number>(-1);
    const [patientName, setPatientName] = useState<string>("");
    const [patient, setPatient] = useState<PatientModel | null>(null);
    const [showSlip, setShowSlip] = useState<boolean>(false);
    const [unpaidReceiptsDisabled, setUnpaidReceiptsDisabled] = useState<boolean>(true);

    const { register, unregister } = useRefreshContext();

    const { data: receipts, loading, refetch } = useGetApi<PagedResults<ReceiptModel>, Filter>(
        (filter) =>
            pending ? receiptsService.GetUnpaidReceipts() : receiptsService.GetPatientReceipts(filter),
        { immediate: true, payload: filter! },
        [filter!]
    );
    const { execute: getPatientCall } = useGetApi<PatientModel | null, number>((id) => patientsService.GetPatient(id!));

    useEffect(() => {
        const u = state.user ?? getUser();
        setUser(u);
    }, [state, getUser]);

    const getPatient = async (id: number) => {
        const res = await getPatientCall(id);

        if (res) {
            setPatient(res);
        }
    };

    useEffect(() => {
        setFilter(prev => ({
            ...prev,
            id: id!
        }));
    }, [id])

    const dateTemplate = (rowData: ReceiptModel) => {
        return rowData.Date + " " + rowData.Time;
    };

    const payReceipt = async (id: number, pId: number) => {
        await getPatient(pId);
        setShowPayment(true);
        setReceiptId(id);
    }

    const hidePayment = () => {
        setShowPayment(false);
    };

    const showReceipt = (id: number, patientName: string) => {
        setShowSlip(true);
        setReceiptId(id);
        setPatientName(patientName);
    };

    useEffect(() => {
        register(Constants.RECEIPT_TRIGGER, refetch);
        return () => unregister(Constants.RECEIPT_TRIGGER);
    }, [register, unregister, refetch]);

    useEffect(() => {
        setUnpaidReceiptsDisabled(receipts == undefined || receipts?.data.length == 0);
    }, [receipts])


    const paidTemplate = (rowData: ReceiptModel) => {
        let className = "border-red-700 dark:border-red-500";
        let textClass = "text-red-700 dark:text-red-500";
        let text = "UNPAID";

        if (rowData.Paid) {
            textClass = "text-green-700 dark:text-green-500";
            className = "border-green-700 dark:border-green-500";
            text = "PAID"
        }

        return <div className={`rounded-xl border-2 flex justify-center items-center ${className} ${textClass} p-1 mx-auto`}>
            <span className="font-extrabold">{text}</span>
        </div>
    }

    const actionBodyTemplate = (rowData: ReceiptModel) => (
        <div className="btn-group">
            <button className="btn btn-info btn-padding-sm" disabled={rowData.Paid} onClick={() => payReceipt(rowData.Id, rowData.PatientId)}>
                <BanknoteArrowUp className="w-5 mx-auto" />
            </button>
            <button className="btn btn-success btn-padding-sm" onClick={() => showReceipt(rowData.Id, rowData.PatientName)}>
                <PrinterIcon className="w-5 mx-auto" />
            </button>
        </div>
    );

    const grandTotalTemplate = (rowData: ReceiptModel) => {
        return `PKR ${rowData.GrandTotal.toFixed(2)}`;
    };

    const columnConfig: ColumnConfig<ReceiptModel>[] = [
        { key: "1", header: "ID", field: "Id", style: { width: "5%" }, sortable: true },
        { key: "2", header: "Date", body: dateTemplate, style: { width: "12%" }, sortable: true },
        { key: "4", header: "Patient", field: "PatientName", style: { width: "19%" }, sortable: true },
        { key: "8", header: "Total", body: grandTotalTemplate, style: { width: "19%" }, sortable: true },
        { key: "9", header: "Paid", body: paidTemplate, style: { width: "19%" }, sortable: true, columnCondition: !pending },
        { key: "10", header: "Action", body: actionBodyTemplate, style: { width: "10%" }, columnCondition: pending && user?.role == Roles.admin.id }
    ];

    const dataTable = (
        <Table<ReceiptModel>
            data={receipts!}
            loading={loading}
            showHeader={false}
            title="receipts"
            columns={columnConfig}
            setFilter={(f) => setFilter(f)}
            filter={filter}
            refresh={() => refetch()}
            showPaging={false}
        />
    );

    const panel = (
        withPanel ?
            <Panel
                disabled={unpaidReceiptsDisabled}
                title={`${pending ? "Unpaid" : ""} Receipts`}
                icon={<CoinsIcon className="w-5" />}
                fullToggle={!refresh}
                refresh={() => { refetch() }}
                alertMessage={`Total ${receipts?.totalRecords} records`}>
                {dataTable}
            </Panel>
            : dataTable
    );

    return (
        <>
            {panel}
            {(receiptId > 0 && showPayment) && <PayWithStripe visible={showPayment} hide={() => hidePayment()} id={receiptId}
                name={patient?.name} phone={patient?.phoneNo}
            />}

            {showSlip && <Viewer
                visible={showSlip}
                hide={() => setShowSlip(false)}
                id={receiptId!}
                title={"Reciept for " + patientName!}
                serviceFn={(receiptId) => receiptsService.GenerateReceipt(receiptId!)}
            />}
        </>
    );
};


export default ViewReceiptsPartial;
