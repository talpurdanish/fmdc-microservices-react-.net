import { SquarePenIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import createDefaultFilter, { type Filter } from "../../BussinessLogic/Models/Generics/Filter";
import { type MedicationModel } from "../../BussinessLogic/Models/Medication.Model";
import { medicationsService } from "../../BussinessLogic/Index.Service";
import { forwardRef, useImperativeHandle } from "react";
import { Roles } from "../../Helpers/Constants";
import { useGetApi } from "../../BussinessLogic/Hooks/UseGetApi";


import { useMutationApi } from "../../BussinessLogic/Hooks/UseMutationsApi";
import { showSuccess, showError } from "../../Helpers/Toast.Helper";
import type { PagedResults } from "../..//BussinessLogic/Models/Generics/PagedResults";
import type { NameIdPair } from "../../BussinessLogic/Models/Generics/NameIdPair";
import type { ColumnConfig } from "../CommonWidgets/TableColumn";
import { Table } from "../CommonWidgets/Table";

type Props = {
    onEdit: (medication: MedicationModel) => void;
    role: number;
    types: NameIdPair[];
};

export const MedicationTable = forwardRef(({ onEdit, role, types }: Props, ref) => {
    useImperativeHandle(ref, () => ({
        loadData() {
            refetch();
        },
    }));

    const [filter, setFilter] = useState<Filter>(
        createDefaultFilter()
    );

    const { mutate: deleteCall } = useMutationApi
        <boolean, number>((id) => medicationsService.Delete(id ?? -1), {
            optimisticUpdate: () => {
                refetch();
            },
            onSuccess: () => {
                showSuccess("Medication has been deleted");
            },
            onError: () => {
                showError("Medication could not be deleted");
            },
        });

    const { data: medications, loading, refetch } = useGetApi<PagedResults<MedicationModel>, Filter>(
        (filter) =>
            medicationsService.GetMedications(false, filter!),
        { immediate: true, payload: filter },
        [filter]
    );

    const deleteMedication = async (id: number) => {
        await deleteCall(id);
    };

    const editMedication = (medication: MedicationModel) => {
        onEdit(medication);
    }

    const actionBodyTemplate = (rowData: MedicationModel) => (
        <div className="btn-group">
            <button className="btn btn-warning btn-padding-sm" onClick={() => editMedication(rowData)}>
                <SquarePenIcon className="w-5 mx-auto" />
            </button>
            <button className="btn btn-danger btn-padding-sm" onClick={() => deleteMedication(rowData.code)}>
                <TrashIcon className="w-5 mx-auto" />
            </button>
        </div>
    );

    const columnConfig: ColumnConfig<MedicationModel>[] = [
        { key: "1", header: "Code", field: "code", style: { width: "10%" }, sortable: true },
        { key: "2", header: "Name", field: "name", style: { width: "15%" }, sortable: true },
        { key: "3", header: "Brand", field: "brand", style: { width: "15%" }, sortable: true },
        { key: "4", header: "Description", field: "description", style: { width: "30%" }, sortable: true },
        { key: "4", header: "Type", field: "type", style: { width: "10%" }, sortable: true },
        { key: "5", header: "Action", body: actionBodyTemplate, style: { width: "10%" }, columnCondition: role == Roles.admin.id }
    ];

    return (
        <>
            <Table<MedicationModel>
                data={medications!}
                loading={loading}
                hasIdFilter={true}
                idFilterTitle="Type"
                idFilterItems={types}
                title="medications"
                columns={columnConfig}
                setFilter={(f) => setFilter(f)}
                filter={filter}
                refresh={() => refetch()}
            />
        </>
    );
});