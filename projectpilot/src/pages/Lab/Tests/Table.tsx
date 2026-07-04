
import { SquarePenIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import createDefaultFilter, { type Filter } from "../../../BussinessLogic/Models/Generics/Filter";
import { type TestModel } from "../../../BussinessLogic/Models/Test.Model";
import { testsService } from "../../../BussinessLogic/Index.Service";
import { forwardRef, useImperativeHandle } from "react";
import { Roles } from "../../../Helpers/Constants";


import { useGetApi } from "../../../BussinessLogic/Hooks/UseGetApi";
import { useMutationApi } from "../../../BussinessLogic/Hooks/UseMutationsApi";
import { showError, showSuccess } from "../../../Helpers/Toast.Helper";
import type { PagedResults } from "../../../BussinessLogic/Models/Generics/PagedResults";
import type { ColumnConfig } from "../../CommonWidgets/TableColumn";
import { Table } from "../../CommonWidgets/Table";


type Props = {
    onEdit: (test: TestModel) => void;
    role: number
};

export const TestTable = forwardRef(({ onEdit, role }: Props, ref) => {
    useImperativeHandle(ref, () => ({
        loadData() {
            refetch();
        },
    }));

    const [filter, setFilter] = useState<Filter>(
        createDefaultFilter()
    );

    const { data: tests, loading, refetch } = useGetApi<PagedResults<TestModel>, Filter>(
        (filter) =>
            testsService.GetTests(false, filter!),
        { immediate: true, payload: filter },
        [filter]
    );
    const { mutate: deleteCall } = useMutationApi<boolean, number>((id) => testsService.Delete(id!), {
        optimisticUpdate: () => {
            refetch();
        },
        onSuccess: () => {
            showSuccess("Test has been deleted");
        },
        onError: () => {
            showError("Test could not be deleted");
        },
    });

    const deleteTest = async (id: number) => {
        await deleteCall(id);
    };
    const editTest = (test: TestModel) => {
        onEdit(test);
    }


    const actionBodyTemplate = (rowData: TestModel) => (
        <div className="btn-group">
            <button className="btn btn-warning btn-padding-sm" onClick={() => editTest(rowData)}>
                <SquarePenIcon className="w-5 mx-auto" />
            </button>
            <button className="btn btn-danger btn-padding-sm" onClick={() => deleteTest(rowData.id)}>
                <TrashIcon className="w-5 mx-auto" />
            </button>
        </div>
    );

    const descriptionTemplate = (rowData: TestModel) => {
        return <div className="text-wrap text-justify overflow-y-scroll max-h-30 p-2">
            {rowData.description}
        </div>
    };

    const costTemplate = (rowData: TestModel) => {
        return <span>PKR {rowData.cost.toFixed(2)}</span>;
    };


    const columnConfig: ColumnConfig<TestModel>[] = [
        { key: "1", header: "ID", field: "id", style: { width: "5%" }, sortable: true },
        { key: "2", header: "Name", field: "name", style: { width: "35%" }, sortable: true },
        { key: "3", header: "Cost", body: costTemplate, style: { width: "10%" }, sortable: true },
        { key: "4", header: "Description", body: descriptionTemplate, style: { width: "40%" }, sortable: true },
        { key: "5", header: "Action", body: actionBodyTemplate, style: { width: "10%" }, columnCondition: role == Roles.admin.id }
    ];

    return (
        <>
            <Table<TestModel>
                data={tests!}
                loading={loading}
                title="tests"
                columns={columnConfig}
                setFilter={(f) => setFilter(f)}
                filter={filter}
                refresh={() => refetch()}
            />
        </>
    );
});