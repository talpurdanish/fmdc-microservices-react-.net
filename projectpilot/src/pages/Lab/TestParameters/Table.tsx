import { MarsIcon, SquarePenIcon, TrashIcon, VenusIcon } from "lucide-react";
import { useState } from "react";
import createDefaultFilter, { type Filter } from "../../../BussinessLogic/Models/Generics/Filter";
import { type TestParameterModel } from "../../../BussinessLogic/Models/TestParameter.Model";
import { testParametersService } from "../../../BussinessLogic/Index.Service";

import { forwardRef, useImperativeHandle } from "react";
import { Roles } from "../../../Helpers/Constants";

import { useGetApi } from "../../../BussinessLogic/Hooks/UseGetApi";

import { useMutationApi } from "../../../BussinessLogic/Hooks/UseMutationsApi";
import { showError, showSuccess } from "../../../Helpers/Toast.Helper";
import type { PagedResults } from "../../../BussinessLogic/Models/Generics/PagedResults";
import type { NameIdPair } from "../../../BussinessLogic/Models/Generics/NameIdPair";
import type { ColumnConfig } from "../../CommonWidgets/TableColumn";
import { Table } from "../../CommonWidgets/Table";

type Props = {
    onEdit: (testParameter: TestParameterModel) => void;
    role: number;
    tests: NameIdPair[];
};

export const TestParameterTable = forwardRef(({ onEdit, role, tests }: Props, ref) => {
    useImperativeHandle(ref, () => ({
        loadData() {
            refetch();
        },
    }));

    const [filter, setFilter] = useState<Filter>(
        createDefaultFilter()
    );

    const { data: testParameters, loading, refetch } = useGetApi<PagedResults<TestParameterModel>, Filter>(
        (filter) =>
            testParametersService.GetTestParameters(false, filter!),
        { immediate: true, payload: filter },
        [filter]
    );

    const { mutate: deleteCall } = useMutationApi<boolean, number>((id) => testParametersService.Delete(id!), {
        optimisticUpdate: () => {
            refetch();
        },
        onSuccess: () => {
            showSuccess("Test Parameter has been deleted");
        },
        onError: () => {
            showError("Test Parameter  could not be deleted");
        },
    });


    const deleteTestParameter = async (id: number) => {
        await deleteCall(id);
    };

    const editTestParameter = (testParameter: TestParameterModel) => {
        onEdit(testParameter);
    }

    const actionBodyTemplate = (rowData: TestParameterModel) => (
        <div className="btn-group">
            <button className="btn btn-warning btn-padding-sm" onClick={() => editTestParameter(rowData)}>
                <SquarePenIcon className="w-5 mx-auto" />
            </button>
            <button className="btn btn-danger btn-padding-sm" onClick={() => deleteTestParameter(rowData.id)}>
                <TrashIcon className="w-5 mx-auto" />
            </button>
        </div>
    );


    const rangeTemplate = (rowData: TestParameterModel) => {
        return (<>
            {rowData.maleMinValue > 0 && rowData.maleMaxValue > 0 &&
                <div className="w-full flex">
                    <MarsIcon className="flex-none w-5 dark:text-blue-400 text-blue-500" />
                    <div className="flex-1">
                        <span className="font-bold">{rowData.maleMinValue}</span> - <span className="font-bold">{rowData.maleMaxValue}</span> {rowData.unit}
                    </div>
                </div>}
            {rowData.gender && rowData.femaleMinValue > 0 && rowData.femaleMaxValue > 0 &&
                <div className="w-full flex">
                    <VenusIcon className="flex-none w-5 dark:text-pink-400 text-pink-500" />
                    <div className="flex-1">
                        <span className="font-bold">{rowData.femaleMinValue}</span> - <span className="font-bold">{rowData.femaleMaxValue}</span> {rowData.unit}
                    </div>
                </div>}
        </>);
    }

    const refRangeTemplate = (rowData: TestParameterModel) => {
        return (<div className="text-wrap">
            {rowData.referenceRange}
        </div>);
    }

    const columnConfig: ColumnConfig<TestParameterModel>[] = [
        { key: "1", header: "id", field: "id", style: { width: "5%" }, sortable: true },
        { key: "2", header: "Name", field: "name", style: { width: "15%" }, sortable: true },
        { key: "3", header: "Test", field: "testName", style: { width: "15%" }, sortable: true },
        { key: "4", header: "Range", body: rangeTemplate, style: { width: "30%" } },
        { key: "5", header: "Ref", body: refRangeTemplate, style: { width: "25%" } },
        { key: "6", header: "Action", body: actionBodyTemplate, style: { width: "10%" }, columnCondition: role == Roles.admin.id }

    ];

    return (
        <>
            <Table<TestParameterModel>
                data={testParameters!}
                loading={loading}
                hasIdFilter={true}
                idFilterItems={tests}
                idFilterTitle="Test"
                title="test parameters"
                columns={columnConfig}
                setFilter={(f) => setFilter(f)}
                filter={filter}
                refresh={() => refetch()}
            />

        </>
    );
});