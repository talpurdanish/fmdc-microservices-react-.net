import { ArrowRightSquareIcon, BanknoteArrowUp, PrinterIcon, TrashIcon } from "lucide-react";
import { useEffect, useState, type JSX } from "react";
import createDefaultFilter, { type Filter } from "../../BussinessLogic/Models/Generics/Filter";
import { type ReceiptModel } from "../../BussinessLogic/Models/Receipt.Model";
import { patientsService, receiptsService } from "../../BussinessLogic/Index.Service";

import { Constants, Roles } from "../../Helpers/Constants";

import { useMutationApi } from "../../BussinessLogic/Hooks/UseMutationsApi";
import { useGetApi } from "../../BussinessLogic/Hooks/UseGetApi";
import { useAuth } from "../../BussinessLogic/Security/Auth.Context";
import type { LoginModel } from "../../BussinessLogic/Models/Login.Model";
import { Layout } from "../../Layout/main_layout/Layout";
import { showError, showSuccess } from "../../Helpers/Toast.Helper";
import { PayWithStripe } from "./PayWithStripe";
import { type PatientModel } from "../../BussinessLogic/Models/Patient.Model";
import { Viewer } from "../CommonWidgets/Viewer";
import { useRefreshContext } from "../../BussinessLogic/Hooks/UseRefreshContext";
import ViewReceiptDetail from "./ReceiptProcedures";
import type { PagedResults } from "../../BussinessLogic/Models/Generics/PagedResults";
import type { ColumnConfig } from "../CommonWidgets/TableColumn";
import { Table } from "../CommonWidgets/Table";

const ViewReceipts = () => {

    const { state, getUser } = useAuth();
    const [user, setUser] = useState<LoginModel | null>(null);
    const [showPayment, setShowPayment] = useState<boolean>(false);
    const [receiptId, setReceiptId] = useState<number>(-1);
    const [receiptKey, setreceiptKey] = useState<number>(0);
    const [patientName, setPatientName] = useState<string>("");
    const [patient, setPatient] = useState<PatientModel | null>(null);
    const [showSlip, setShowSlip] = useState<boolean>(false);
    const [showProcedures, setShowProcedures] = useState<boolean>(false);

    const [filter, setFilter] = useState<Filter>(
        createDefaultFilter()
    );

    const { register, unregister } = useRefreshContext();

    const { data: receipts, loading, refetch } = useGetApi<PagedResults<ReceiptModel>, Filter>(
        (filter) =>
            receiptsService.GetReceipts(filter),
        { immediate: true, payload: filter },
        [filter]
    );

    const { execute: getPatientCall } = useGetApi<PatientModel | null, number>((id) => patientsService.GetPatient(id!));

    const { mutate: deleteCall } = useMutationApi<boolean, number>((id) => receiptsService.DeleteReceipt(id!), {
        optimisticUpdate: () => {
            refetch()
        },
        onSuccess: () => {
            showSuccess("Receipt has been deleted");
        },
        onError: () => {
            showError("Receipt could not be deleted");
        },
    });

    useEffect(() => {
        const u = state.user ?? getUser();
        setUser(u);
    }, [state, getUser]);

    useEffect(() => {
        register(Constants.RECEIPT_TRIGGER, refetch);
        return () => unregister(Constants.RECEIPT_TRIGGER);
    }, [register, unregister, refetch]);


    const getPatient = async (id: number) => {
        const res = await getPatientCall(id);

        if (res) {
            setPatient(res);
        }
    };

    const deleteReceipt = async (id: number) => {
        await deleteCall(id);
    };

    const payReceipt = async (id: number, pId: number) => {
        await getPatient(pId);
        setShowPayment(true);
        setReceiptId(id);
    }

    const hidePayment = () => {
        setShowPayment(false);
    };

    const showreceipt = (id: number, patientName: string) => {
        setShowSlip(true);
        setReceiptId(id);
        setPatientName(patientName);
    };

    const showReceiptProcedures = (id: number) => {
        setreceiptKey(Math.random());
        setShowProcedures(false);
        setReceiptId(id);
        setShowProcedures(true);
    };

    const actionBodyTemplate = (rowData: ReceiptModel) => (
        <div className="btn-group">
            <button className="btn btn-danger btn-padding-sm" onClick={() => deleteReceipt(rowData.Id)}>
                <TrashIcon className="w-5 mx-auto" />
            </button>
            <button className="btn btn-gray btn-padding-sm" onClick={() => showReceiptProcedures(rowData.Id)}>
                <ArrowRightSquareIcon className="w-5 mx-auto" />
            </button>
            <button className="btn btn-info btn-padding-sm" disabled={rowData.Paid} onClick={() => payReceipt(rowData.Id, rowData.PatientId)}>
                <BanknoteArrowUp className="w-5 mx-auto" />
            </button>

            <button className="btn btn-success btn-padding-sm" onClick={() => showreceipt(rowData.Id, rowData.PatientName)}>
                <PrinterIcon className="w-5 mx-auto" />
            </button>
        </div>
    );

    const dateTemplate = (rowData: ReceiptModel) => {
        return rowData.Date + " " + rowData.Time;
    };

    const percentageTemplate = (rowData: ReceiptModel) => {
        var discountedAmount = rowData.Total * rowData.Discount / 100;
        return `${rowData.Discount}% / PKR ${discountedAmount.toFixed(2)}`;
    };

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

    const grandTotalTemplate = (rowData: ReceiptModel) => {
        return `PKR ${rowData.GrandTotal.toFixed(2)}`;
    };

    const totalTemplate = (rowData: ReceiptModel) => {
        return `PKR ${rowData.Total.toFixed(2)}`;
    };

    const columnConfig: ColumnConfig<ReceiptModel>[] = [
        { key: "1", header: "ID", field: "Id", style: { width: "5%" }, sortable: true },
        { key: "2", header: "Date", body: dateTemplate, style: { width: "10%" }, sortable: true },
        { key: "3", header: "Doctor", field: "Doctor", style: { width: "12%" }, sortable: true },
        { key: "4", header: "Patient", field: "PatientName", style: { width: "12%" }, sortable: true },
        { key: "5", header: "Total", body: totalTemplate, style: { width: "10%" }, sortable: true },
        { key: "6", header: "Discount", body: percentageTemplate, style: { width: "7%" }, sortable: true },
        { key: "7", header: "By", field: "AuthorizedBy", style: { width: "12%" }, sortable: true },
        { key: "8", header: "Grand Total", body: grandTotalTemplate, style: { width: "10%" }, sortable: true },
        { key: "9", header: "Paid", body: paidTemplate, style: { width: "10%" }, sortable: true },
        { key: "10", header: "Action", body: actionBodyTemplate, style: { width: "12%" }, columnCondition: user?.role == Roles.admin.id }
    ];


    return (
        <>
            <Table<ReceiptModel>
                data={receipts!}
                loading={loading}
                title="receipts"
                columns={columnConfig}
                setFilter={(f) => setFilter(f)}
                filter={filter}
                refresh={() => refetch()}
            />

            {showProcedures && receiptId > 0 && <div className="w-full mt-5">
                <ViewReceiptDetail id={receiptId} key={receiptKey} />
            </div>}

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

ViewReceipts.getLayout = (page: JSX.Element) => {
    return (
        <Layout>{page}</Layout>
    )
}
export default ViewReceipts