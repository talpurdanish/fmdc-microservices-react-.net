import { SquarePenIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import createDefaultFilter, { type Filter } from "../../BussinessLogic/Models/Generics/Filter";
import { type ProcedureModel } from "../../BussinessLogic/Models/Procedure.Model";
import { proceduresService } from "../../BussinessLogic/Index.Service";
import { forwardRef, useImperativeHandle } from "react";
import { Roles } from "../../Helpers/Constants";
import { type ProcedureTypeModel } from "../../BussinessLogic/Models/ProcedureType.Model";
import { useGetApi } from "../../BussinessLogic/Hooks/UseGetApi";
import { useMutationApi } from "../../BussinessLogic/Hooks/UseMutationsApi";
import { showError, showSuccess } from "../../Helpers/Toast.Helper";
import type { PagedResults } from "../../BussinessLogic/Models/Generics/PagedResults";
import type { ColumnConfig } from "../CommonWidgets/TableColumn";
import { Table } from "../CommonWidgets/Table";

type Props = {
    onEdit: (procedure: ProcedureModel) => void;
    role: number;
    types: ProcedureTypeModel[];
};

export const ProcedureTable = forwardRef(({ onEdit, role, types }: Props, ref) => {
    useImperativeHandle(ref, () => ({
        loadData() {
            refetch();
        },
    }));

    const [filter, setFilter] = useState<Filter>(
        createDefaultFilter()
    );


    const { data: procedures, loading, refetch } = useGetApi<PagedResults<ProcedureModel>, Filter>(
        (filter) =>
            proceduresService.GetProcedures(false, filter!),
        { immediate: true, payload: filter },
        [filter]
    );
    const { mutate: deleteCall } = useMutationApi
        <boolean, number>((id) => proceduresService.Delete(id!), {
            optimisticUpdate: () => {
                refetch();
            },
            onSuccess: () => {
                showSuccess("Procedure has been deleted");
            },
            onError: () => {
                showError("Procedure could not be deleted");
            },
        });

    const deleteProcedure = async (id: number) => {
        await deleteCall(id);
    };

    const editProcedure = (procedure: ProcedureModel) => {
        onEdit(procedure);
    }

    const actionBodyTemplate = (rowData: ProcedureModel) => (
        <div className="btn-group">
            <button className="btn btn-warning btn-padding-sm" onClick={() => editProcedure(rowData)}>
                <SquarePenIcon className="w-5 mx-auto" />
            </button>
            <button className="btn btn-danger btn-padding-sm" onClick={() => deleteProcedure(rowData.id)}>
                <TrashIcon className="w-5 mx-auto" />
            </button>
        </div>
    );

    const columnConfig: ColumnConfig<ProcedureModel>[] = [
        { key: "1", header: "ID", field: "id", style: { width: "5%" }, sortable: true },
        { key: "2", header: "Name", field: "name", style: { width: "45%" }, sortable: true },
        { key: "3", header: "Cost", field: "cost", style: { width: "10%" }, sortable: true },
        { key: "4", header: "Type", field: "type", style: { width: "30%" }, sortable: true },
        { key: "5", header: "Action", body: actionBodyTemplate, style: { width: "10%" }, columnCondition: role == Roles.admin.id }
    ];

    return (
        <>
            <Table<ProcedureModel>
                data={procedures!}
                loading={loading}
                hasIdFilter={true}
                idFilterItems={types}
                idFilterTitle="Type"
                title="procedures"
                columns={columnConfig}
                setFilter={(f) => setFilter(f)}
                filter={filter}
                refresh={() => refetch()}
            />
        </>
    );
});