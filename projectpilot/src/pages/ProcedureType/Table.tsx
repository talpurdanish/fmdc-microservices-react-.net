import { SquarePenIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import createDefaultFilter, { type Filter } from "../../BussinessLogic/Models/Generics/Filter";
import { type ProcedureTypeModel } from "../../BussinessLogic/Models/ProcedureType.Model";
import { procedureTypesService } from "../../BussinessLogic/Index.Service";
import { forwardRef, useImperativeHandle } from "react";
import { Roles } from "../../Helpers/Constants";
import { useGetApi } from "../../BussinessLogic/Hooks/UseGetApi";

import { useMutationApi } from "../../BussinessLogic/Hooks/UseMutationsApi";
import { showError, showSuccess } from "../../Helpers/Toast.Helper";
import type { PagedResults } from "../../BussinessLogic/Models/Generics/PagedResults";
import type { ColumnConfig } from "../CommonWidgets/TableColumn";
import { Table } from "../CommonWidgets/Table";

type Props = {
    onEdit: (procedureType: ProcedureTypeModel) => void;
    role: number
};

export const ProcedureTypeTable = forwardRef(({ onEdit, role }: Props, ref) => {
    useImperativeHandle(ref, () => ({
        loadData() {
            refetch();
        },
    }));


    const [filter, setFilter] = useState<Filter>(
        createDefaultFilter()
    );

    const { data: types, loading, refetch } = useGetApi<PagedResults<ProcedureTypeModel>, Filter>(
        (filter) =>
            procedureTypesService.GetProcedureTypes(false, filter!),
        { immediate: true, payload: filter },
        [filter]
    );
    const { mutate: deleteCall } = useMutationApi<boolean, number>((id) => procedureTypesService.Delete(id!), {
        optimisticUpdate: () => {
            refetch();
        },
        onSuccess: () => {
            showSuccess("Procedure Type has been deleted");
        },
        onError: () => {
            showError("Procedure Type could not be deleted");
        },
    });

    const deleteProcedureType = async (id: number) => {
        await deleteCall(id);
    };

    const editProcedureType = (procedureType: ProcedureTypeModel) => {
        onEdit(procedureType);
    }
    const actionBodyTemplate = (rowData: ProcedureTypeModel) => (
        <div className="btn-group">
            <button className="btn btn-warning btn-padding-sm" onClick={() => editProcedureType(rowData)}>
                <SquarePenIcon className="w-5 mx-auto" />
            </button>
            <button className="btn btn-danger btn-padding-sm" onClick={() => deleteProcedureType(rowData.id)}>
                <TrashIcon className="w-5 mx-auto" />
            </button>
        </div>
    );

    const columnConfig: ColumnConfig<ProcedureTypeModel>[] = [
        { key: "1", header: "ID", field: "id", style: { width: "20%" }, sortable: true },
        { key: "2", header: "Name", field: "name", style: { width: "80%" }, sortable: true },
        { key: "5", header: "Action", body: actionBodyTemplate, style: { width: "10%" }, columnCondition: role == Roles.admin.id }
    ];


    return (
        <>
            <Table<ProcedureTypeModel>
                data={types!}
                loading={loading}
                title="procedure types"
                columns={columnConfig}
                setFilter={(f) => setFilter(f)}
                filter={filter}
                refresh={() => refetch()}
            />
        </>
    );
});