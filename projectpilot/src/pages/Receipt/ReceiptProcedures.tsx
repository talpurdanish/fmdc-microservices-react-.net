import { useEffect, useState, type JSX } from "react";
import { receiptsService } from "../../BussinessLogic/Index.Service";


import { useGetApi } from "../../BussinessLogic/Hooks/UseGetApi";
import { Layout } from "../../Layout/main_layout/Layout";
import { createRecieptDetailModel, type RecieptDetailModel } from "../../BussinessLogic/Models/RecieptDetail.Model";
import type { ColumnConfig } from "../CommonWidgets/TableColumn";
import { Table } from "../CommonWidgets/Table";
import { createPagedResults, type PagedResults } from "../../BussinessLogic/Models/Generics/PagedResults";

interface ViewReceiptDetailProps {
    id: number;
    key: number;
}

const ViewReceiptDetail = ({ id, key }: ViewReceiptDetailProps) => {


    const [details, setDetails] = useState<PagedResults<RecieptDetailModel> | null>(null);
    const { execute: getDetails, loading } = useGetApi<RecieptDetailModel[], number>(
        (id) =>
            receiptsService.GetReceiptProcedures(id!),
        { immediate: true, payload: id },
        [id]
    );

    useEffect(() => {
        const populateDetails = async () => {
            const d = await getDetails(id);
            if (d) {
                const raw = JSON.stringify(d);
                const pd = createPagedResults<RecieptDetailModel>(raw, createRecieptDetailModel);
                setDetails(pd);
            }
        };
        populateDetails();
    }, [id, key]);


    const columnConfig: ColumnConfig<RecieptDetailModel>[] = [
        { key: "1", header: "ID", field: "id", style: { width: "5%" }, sortable: true },
        { key: "2", header: "Detail", field: "detail", style: { width: "35%" }, sortable: true },
        { key: "3", header: "Cost", field: "cost", style: { width: "25%" }, sortable: true },
        { key: "4", header: "Type", field: "type", style: { width: "35%" }, sortable: true },
    ];


    return (
        <>
            <Table<RecieptDetailModel>
                data={details!}
                loading={loading}
                showPaging={false}
                showHeader={false}
                title="receipts details"
                columns={columnConfig}
            />

        </>
    );
};

ViewReceiptDetail.getLayout = (page: JSX.Element) => {
    return (
        <Layout>{page}</Layout>
    )
}
export default ViewReceiptDetail