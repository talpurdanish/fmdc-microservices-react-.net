import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { MarsIcon, VenusIcon, XCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";

import type { Filter } from "../../../BussinessLogic/Models/Generics/Filter";
import { useMutationApi } from "../../../BussinessLogic/Hooks/UseMutationsApi";

import { useGetApi } from "../../../BussinessLogic/Hooks/UseGetApi";
import { labReportsService } from "../../../BussinessLogic/Index.Service";

import { type TestParameterModel } from "../../../BussinessLogic/Models/TestParameter.Model";
import { InputNumber } from "primereact/inputnumber";


type Props = {
    id: number,
    loadData: (filter?: Filter) => void;
    filter?: Filter;
    hide: () => void;
};

export const UpdateReport = ({ id, loadData, filter, hide }: Props) => {

    const [values, setValues] = useState<Record<number, number>>({});

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const { mutate: updateValuesCall } = useMutationApi
        <boolean, string>((params) => labReportsService.UpdateValues(params!, id ?? -1), {
            optimisticUpdate: () => {
                loadData(filter);
                hide();
            },
            onSuccess: () => {
                setSuccess("Report Values has been updated");
                setError(null);
            },
            onError: () => {
                setError("Report Values could not be updated");
                setSuccess(null);

            },
        });
    const { data: parameters, loading } = useGetApi<TestParameterModel[], number>(
        (id) =>
            labReportsService.GetPendingParameters(id!),
        { immediate: true, payload: id },
        [id]
    );

    const onValueChanged = (id: number, value: number | null) => {
        if (value != null) {
            setValues(prev => ({ ...prev, [id]: value }));
        } else {
            setValues(prev => {
                const { [id]: _, ...rest } = prev;
                return rest;
            });
        }
    };

    const updateValues = async () => {
        const combined = Object.entries(values).map(([id, param]) => ({
            id: Number(id),
            param
        }));
        await updateValuesCall(JSON.stringify(combined));
    };


    const actionBodyTemplate = (rowData: TestParameterModel) => (
        <div className="btn-group">
            <button className="btn btn-danger btn-padding-sm" onClick={() => resetValue(rowData.id)}>
                <XCircleIcon className="w-5 mx-auto" />
            </button>
        </div>
    );

    useEffect(() => {
        if (parameters) {
            const initial = parameters.reduce((acc, p) => {
                acc[p.id] = p.value ?? 0;
                return acc;
            }, {} as Record<number, number>);
            setValues(initial);
        }
    }, [parameters]);


    const rangeTemplate = (rowData: TestParameterModel) => {
        return (<>
            <div className="w-full grid grid-cols-5">
                <MarsIcon className="w-5 dark:text-blue-400 text-blue-500" />
                <div className="col-span-4">
                    <span className="font-bold">{rowData.maleMinValue}</span> - <span className="font-bold">{rowData.maleMaxValue}</span> {rowData.unit}
                </div>
            </div>
            {rowData.gender && <div className="w-full grid grid-cols-5">
                <VenusIcon className="w-5 dark:text-pink-400 text-pink-500" />
                <div className="col-span-4">
                    <span className="font-bold">{rowData.femaleMinValue}</span> - <span className="font-bold">{rowData.femaleMaxValue}</span> {rowData.unit}
                </div>
            </div>}
        </>);
    }

    const getMinimum = (gender: boolean, male: number, female: number) => {
        return gender ? Math.min(male, female) : male;
    }


    const getMaximum = (gender: boolean, male: number, female: number) => {
        return gender ? Math.max(male, female) : male;
    }
    const resetValue = (id: number) => {
        setValues(prev => ({ ...prev, [id]: 0 }));
    };



    const valueFieldTemplate = (rowData: TestParameterModel) => (

        <div className="btn-group">
            <InputNumber
                value={values[rowData.id] ?? rowData.value ?? 0}
                onChange={(e) => onValueChanged(rowData.id, e.value)}
                showButtons
                mode="decimal"
                minFractionDigits={2}
                maxFractionDigits={5}
                min={getMinimum(rowData.gender, rowData.femaleMinValue, rowData.maleMinValue)}
                max={getMaximum(rowData.gender, rowData.femaleMaxValue, rowData.maleMaxValue)}
            />
        </div>
    );


    return (
        <>

            <DataTable
                className="mt-5"
                header="Update Report Values"
                footer={<div className="flex flex-wrap align-items-center justify-content-between gap-3">
                    {error && <p className="flex-1 text-red-500">{error}</p>}
                    {success && <p className="flex-1 text-green-500">{success}</p>}
                    <button className="btn btn-success btn-rounded btn-padding-md" onClick={() => updateValues()} autoFocus>Add</button>
                </div>
                }
                value={parameters!}
                tableStyle={{ minWidth: '50rem' }}
                showGridlines
                stripedRows
                sortMode="multiple"
                removableSort
                dataKey="id"
                loading={loading}
                size="small"
                emptyMessage="No parameters found.">
                <Column key="1" field="name" header="Name" className="w-[10%]" sortable />
                <Column key="2" header="Range" body={valueFieldTemplate} className="w-[32%]" />
                <Column key="3" header="Range" body={rangeTemplate} className="w-[32%]" />
                <Column key="4" field="referenceRange" header="Ref" className="w-[33%]" />
                <Column key="5" header="Action" body={actionBodyTemplate} className="w-[10%]" />
            </DataTable>

        </>
    );
};