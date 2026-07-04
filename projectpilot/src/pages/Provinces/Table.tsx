import { SquarePenIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import createDefaultFilter, { type Filter } from "../../BussinessLogic/Models/Generics/Filter";
import { type ProvinceModel } from "../../BussinessLogic/Models/Province.Model";
import { provincesService } from "../../BussinessLogic/Index.Service";

import { Roles } from "../../Helpers/Constants";

import { useMutationApi } from "../../BussinessLogic/Hooks/UseMutationsApi";
import { showSuccess, showError } from "../../Helpers/Toast.Helper";
import { useGetApi } from "../../BussinessLogic/Hooks/UseGetApi";
import type { PagedResults } from "../../BussinessLogic/Models/Generics/PagedResults";
import type { ColumnConfig } from "../CommonWidgets/TableColumn";
import { Table } from "../CommonWidgets/Table";


type Props = {
    onEdit: (province: ProvinceModel) => void;
    role: number;
};

export const ProvinceTable = ({ onEdit, role }: Props) => {


    const [filter, setFilter] = useState<Filter>(
        createDefaultFilter()
    );

    const { data: provinces, loading, refetch } = useGetApi<PagedResults<ProvinceModel>, Filter>(
        (filter) =>
            provincesService.GetProvinces(false, filter!),
        { immediate: true, payload: filter },
        [filter]
    );

    const { mutate: deleteCall } = useMutationApi<boolean, number>((id) => provincesService.Delete(id!), {
        optimisticUpdate: () => {
            refetch();
        },
        onSuccess: () => {
            showSuccess("Province has been deleted");
        },
        onError: () => {
            showError("Province could not be deleted");
        },
    });

    const deleteProvince = async (id: number) => {
        await deleteCall(id);
    };

    const editProvince = (rowData: ProvinceModel) => {
        onEdit(rowData);
    }

    const actionBodyTemplate = (rowData: ProvinceModel) => (
        <div className="btn-group">
            <button className="btn btn-warning btn-padding-sm" onClick={() => editProvince(rowData)}>
                <SquarePenIcon className="w-5 mx-auto" />
            </button>
            <button className="btn btn-danger btn-padding-sm" onClick={() => deleteProvince(rowData.id)}>
                <TrashIcon className="w-5 mx-auto" />
            </button>
        </div>
    );

    const columnConfig: ColumnConfig<ProvinceModel>[] = [
        { key: "1", header: "ID", field: "id", style: { width: "20%" }, sortable: true },
        { key: "2", header: "Name", field: "name", style: { width: "80%" }, sortable: true },
        { key: "5", header: "Action", body: actionBodyTemplate, style: { width: "10%" }, columnCondition: role == Roles.admin.id }
    ];

    return (
        <>
            <Table<ProvinceModel>
                data={provinces!}
                loading={loading}
                title="provinces"
                columns={columnConfig}
                setFilter={(f) => setFilter(f)}
                filter={filter}
                refresh={() => refetch()}
            />
        </>
    );
};