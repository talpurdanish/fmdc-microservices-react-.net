import { SquarePenIcon, TrashIcon } from "lucide-react";
import { type CityModel } from "../../BussinessLogic/Models/City.Model";
import { useState } from "react";
import createDefaultFilter, { type Filter } from "../../BussinessLogic/Models/Generics/Filter";
import { citiesService } from "../../BussinessLogic/Index.Service";

import { forwardRef, useImperativeHandle } from "react";


import { Roles } from "../../Helpers/Constants";
import { useGetApi } from "../../BussinessLogic/Hooks/UseGetApi";
import { useMutationApi } from "../../BussinessLogic/Hooks/UseMutationsApi";
import { showError, showSuccess } from "../../Helpers/Toast.Helper";
import type { PagedResults } from "../../BussinessLogic/Models/Generics/PagedResults";
import type { NameIdPair } from "../../BussinessLogic/Models/Generics/NameIdPair";
import type { ColumnConfig } from "../CommonWidgets/TableColumn";
import { Table } from "../CommonWidgets/Table";

type Props = {
    onEdit: (city: CityModel) => void;
    role: number;
    provinces: NameIdPair[];
};

export const CityTable = forwardRef(({ onEdit, role, provinces }: Props, ref) => {
    useImperativeHandle(ref, () => ({
        loadData() {
            refetch();
        },
    }));



    const [filter, setFilter] = useState<Filter>(
        createDefaultFilter()
    );
    const { mutate: deleteCall } = useMutationApi
        <boolean, number>((id) => citiesService.Delete(id ?? -1), {
            optimisticUpdate: () => refetch(),
            onSuccess: () => showSuccess("City has been deleted"),
            onError: () => showError("City could not be deleted"),
        });
    const { data: cities, loading, refetch } = useGetApi<PagedResults<CityModel>, Filter>(
        (filter) => citiesService.GetCities(false, filter!),
        { immediate: true, payload: filter },
        [filter]
    );

    const deleteCity = async (id: number) => {
        await deleteCall(id);

    };

    const editCity = (city: CityModel) => {
        onEdit(city);
    }

    const actionBodyTemplate = (rowData: CityModel) => (
        <div className="btn-group">
            <button className="btn btn-warning btn-padding-md" onClick={() => editCity(rowData)}>
                <SquarePenIcon className="w-5 mx-auto" />
            </button>
            <button className="btn btn-danger btn-padding-md" onClick={() => deleteCity(rowData.id)}>
                <TrashIcon className="w-5 mx-auto" />
            </button>
        </div>
    );

    const columnConfig: ColumnConfig<CityModel>[] = [
        { key: "1", field: "id", header: "ID", style: { minWidth: "5%" }, sortable: true },
        { key: "2", header: "Name", field: "name", style: { minWidth: "42%" }, sortable: true },
        { key: "3", header: "Province", field: "provinceName", style: { minWidth: "43%" }, sortable: true },
        { key: "8", header: "Action", body: actionBodyTemplate, style: { minWidth: "10%" }, columnCondition: role == Roles.admin.id }
    ];

    return (
        <Table<CityModel>
            data={cities!}
            loading={loading}
            hasIdFilter={true}
            idFilterItems={provinces}
            idFilterTitle="Province"
            title="cities"
            columns={columnConfig}
            setFilter={(f) => setFilter(f)}
            filter={filter}
            refresh={() => refetch()}
        />
    )
});