import { SquarePenIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import createDefaultFilter, { type Filter } from "../../BussinessLogic/Models/Generics/Filter";
import { type MedicationTypeModel } from "../../BussinessLogic/Models/MedicationType.Model";
import { medicationTypesService } from "../../BussinessLogic/Index.Service";
import { forwardRef, useImperativeHandle } from "react";
import { Roles } from "../../Helpers/Constants";
import { useGetApi } from "../../BussinessLogic/Hooks/UseGetApi";
import { useMutationApi } from "../../BussinessLogic/Hooks/UseMutationsApi";
import { showError, showSuccess } from "../../Helpers/Toast.Helper";
import type { PagedResults } from "../../BussinessLogic/Models/Generics/PagedResults";
import type { ColumnConfig } from "../CommonWidgets/TableColumn";
import { Table } from "../CommonWidgets/Table";


type Props = {
    onEdit: (medicationType: MedicationTypeModel) => void;
    role: number
};

export const MedicationTypeTable = forwardRef(({ onEdit, role }: Props, ref) => {
    useImperativeHandle(ref, () => ({
        loadData() {
            refetch();
        },
    }));

    const [filter, setFilter] = useState<Filter>(
        createDefaultFilter()
    );

    const { data: medicationTypes, loading, refetch } = useGetApi<PagedResults<MedicationTypeModel>, Filter>(
        (filter) =>
            medicationTypesService.GetMedicationTypes(false, filter!),
        { immediate: true, payload: filter },
        [filter]
    );



    const { mutate: deleteCall } = useMutationApi
        <boolean, number>((id) => medicationTypesService.Delete(id!), {
            optimisticUpdate: () => {
                refetch();
            },
            onSuccess: () => {
                showSuccess("Medication Type has been deleted");
            },
            onError: () => {
                showError("Medication Type could not be deleted");
            },
        });

    const deleteMedicationType = async (id: number) => {
        await deleteCall(id);
    };

    const editMedicationType = (medicationType: MedicationTypeModel) => {
        onEdit(medicationType);
    }

    const actionBodyTemplate = (rowData: MedicationTypeModel) => (
        <div className="btn-group">
            <button className="btn btn-warning btn-padding-sm" onClick={() => editMedicationType(rowData)}>
                <SquarePenIcon className="w-5 mx-auto" />
            </button>
            <button className="btn btn-danger btn-padding-sm" onClick={() => deleteMedicationType(rowData.id)}>
                <TrashIcon className="w-5 mx-auto" />
            </button>
        </div>
    );

    const columnConfig: ColumnConfig<MedicationTypeModel>[] = [
        { key: "1", header: "ID", field: "id", style: { width: "20%" }, sortable: true },
        { key: "2", header: "Name", field: "name", style: { width: "80%" }, sortable: true },
        { key: "5", header: "Action", body: actionBodyTemplate, style: { width: "10%" }, columnCondition: role == Roles.admin.id }
    ];

    return (
        <>
            <Table<MedicationTypeModel>
                data={medicationTypes!}
                loading={loading}
                title="medications types"
                columns={columnConfig}
                setFilter={(f) => setFilter(f)}
                filter={filter}
                refresh={() => refetch()}
            />
        </>
    );
});