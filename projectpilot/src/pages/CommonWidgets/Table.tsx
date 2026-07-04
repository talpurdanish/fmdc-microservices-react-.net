import type { Filter } from "../../BussinessLogic/Models/Generics/Filter";
import type { PagedResults } from "../../BussinessLogic/Models/Generics/PagedResults";
import { SortOrder } from "primereact/api";
import { DataTable, type DataTablePageEvent, type DataTableSortEvent, type DataTableValue } from "primereact/datatable";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import type { ColumnConfig } from "./TableColumn";
import { Column } from "primereact/column";
import { CloudDownloadIcon, FilterIcon, RotateCcwIcon } from "lucide-react";
import { ContextMenu } from "primereact/contextmenu";
import type { MenuItem } from "primereact/menuitem";
import { InputText } from "primereact/inputtext";
import type { NameIdPair } from "../../BussinessLogic/Models/Generics/NameIdPair";
import { Dropdown, type DropdownChangeEvent } from "primereact/dropdown";
import createDefaultFilter from "../../BussinessLogic/Models/Generics/Filter";

interface TableProps<T extends DataTableValue> {
    // Data Props
    data: PagedResults<T>;
    columns: ColumnConfig<T>[];
    loading: boolean;
    refresh?: () => void;

    //General Props
    showPaging?: boolean;
    showHeader?: boolean;
    width?: string;
    title: string;

    //Filter Props
    setFilter?: (f: Filter) => void;
    filter?: Filter;
    hasIdFilter?: boolean;
    idFilterItems?: NameIdPair[];
    idFilterTitle?: string;

    //Row Class and Expanded Rows Props
    rowClass?: any;
    expandedRows?: any;
    onRowToggle?: (e: any) => void;
    rowExpansionTemplate?: any;

    //Context Menu Props
    contextMenuItems?: MenuItem[];
    contextMenuSelection?: any;
    onContextMenuSelectionChange?: (e: any) => void;
}

export const Table = <T extends DataTableValue,>({
    data,
    columns,
    loading,
    refresh,

    showPaging = true,
    showHeader = true,
    width = "100%",
    title,

    setFilter,
    filter = createDefaultFilter(),
    hasIdFilter = false,
    idFilterItems = [],
    idFilterTitle = "",

    rowClass = null,
    expandedRows = null,
    onRowToggle,
    rowExpansionTemplate = null,

    contextMenuItems = [],
    contextMenuSelection = null,
    onContextMenuSelectionChange

}: TableProps<T>) => {

    const [localFilter, setLocalFilter] = useState<Filter>(
        filter
    );

    const dropdownRef = useRef<Dropdown | null>(null);

    const [term, setTerm] = useState<string>('');
    const [filterByTerm, setFilterByTerm] = useState<boolean>(false);

    const [id, setId] = useState<number>(-1);
    const [filterById, setFilterById] = useState<boolean>(false);

    const dt = useRef<DataTable<any>>(null);
    const cm = useRef<ContextMenu | null>(null);

    useEffect(() => {
        setLocalFilter(filter);
    }, []);


    useEffect(() => {
        if (setFilter && refresh) {
            setFilter(localFilter);
            refresh();
        }
    }, [localFilter]);


    const onSort = (event: DataTableSortEvent) => {
        const sortField = event.sortField;
        const order = filter.order == 1 ? 0 : 1;
        setLocalFilter(prev => ({
            ...prev,
            sortfield: sortField,
            order: order,
        }));
    };
    const onPage = (event: DataTablePageEvent) => {
        const pageSize = event.rows;
        const page = (event.page ?? 1);
        setLocalFilter(prev => ({
            ...prev,
            pageSize: pageSize,
            page: page + 1
        }));
    };

    const OnIdChanged = (e: DropdownChangeEvent) => {
        setFilterById(e.value > 0);
        setId(e.value);
    }

    const onFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilterByTerm(e.target.value != "")
        setTerm(e.target.value);
    };

    const onGlobalFilterChange = () => {
        if (filterByTerm) {
            setLocalFilter(prev => ({
                ...prev,
                term: term
            }));
        }
        if (hasIdFilter && filterById) {
            setLocalFilter(prev => ({
                ...prev,
                id: id
            }));
        }
    };

    const reset = () => {
        setLocalFilter(prev => ({
            ...prev,
            term: "",
            id: -1,
        }));
        setTerm('');
        if (hasIdFilter) {
            setId(-1);
            dropdownRef?.current?.clear();
        }
    };


    const renderFilter = () => {
        return (
            <div className="flex items-stretch justify-around gap-2">
                {hasIdFilter && idFilterItems && idFilterItems.length > 0 && <Dropdown
                    ref={dropdownRef}
                    value={id}
                    onChange={(e: DropdownChangeEvent) => OnIdChanged(e)}
                    options={idFilterItems!}
                    showClear
                    optionValue="id"
                    optionLabel="name"
                    placeholder={`Select a ${idFilterTitle}`}
                    className="flex-1"
                />}

                <InputText
                    value={term}
                    placeholder="Keyword Search"
                    onChange={(e) => onFilterChange(e)}
                    className="flex-1"
                />
                <button
                    onClick={() => onGlobalFilterChange()}
                    className="btn btn-info btn-rounded btn-padding-md">
                    <FilterIcon className="w-[25px]" />
                    <span className="w-[85%]">Apply Filter</span>
                </button>
                <button
                    onClick={() => reset()}
                    className="btn btn-danger btn-rounded  btn-padding-md">
                    <RotateCcwIcon className="w-[25px]" />
                    <span className="w-[85%]">Reset</span>
                </button>
            </div>
        );
    };

    const header = renderFilter();

    const computeRowsPerPageOptions = (): number[] => {
        const arr = [5, 10, 25, 50];
        const lastIndex = arr.findIndex(n => n >= data?.totalRecords) + 1;
        return lastIndex === 0 ? arr : arr.slice(0, lastIndex);
    }

    const footer = () => {
        if (!showPaging || (showPaging && (data?.totalRecords == undefined || data?.totalRecords > 5 || data?.totalRecords <= 0))) return null;
        return (
            <div className="flex gap-2">
                <div className="flex-1">
                    <div className="btn-padding-md text-black dark:text-white">{`Total ${data?.totalRecords} records`}</div>
                </div>
                <button className="btn border btn-transparent py-1 px-1.5 btn-rounded" onClick={() => exportCSV()}><CloudDownloadIcon /></button>
            </div>
        )
    }

    const paginatorLeft = () => {
        if (!showPaging) return null;
        return (
            <div className="flex-1">
                <div className="btn-padding-md text-black dark:text-white">{`Total ${data?.totalRecords} records`}</div>
            </div>
        );
    }

    const paginatorRight = () => {
        if (!showPaging) return null;
        return (
            <div className="min-w-30 flex justify-end">
                <button className="btn  border btn-transparent py-1 px-1.5 btn-rounded" onClick={() => exportCSV()}><CloudDownloadIcon /></button>
            </div>
        );
    }


    const exportCSV = () => {
        dt?.current?.exportCSV();
    };
    return (
        <>

            {contextMenuItems && contextMenuItems.length > 0 && onContextMenuSelectionChange &&
                <ContextMenu model={contextMenuItems} ref={cm} onHide={() => onContextMenuSelectionChange(null)} />
            }
            <DataTable
                ref={dt}
                value={data?.data}
                lazy
                footer={footer()}
                paginatorLeft={paginatorLeft()}
                paginatorRight={paginatorRight()}
                paginator={showPaging && data?.totalRecords > 5}
                alwaysShowPaginator={true}
                paginatorPosition="bottom"
                rows={data?.pageSize}
                rowsPerPageOptions={computeRowsPerPageOptions()}
                first={(((data?.currentPage ?? 0) - 1) * (data?.pageSize ?? 5))}
                totalRecords={data?.totalRecords}
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} to {last} of {totalRecords}"
                onPage={(e: DataTablePageEvent) => onPage(e)}
                tableStyle={{ minWidth: width }}
                rowClassName={rowClass}
                showGridlines
                stripedRows
                sortMode="single"
                sortField={filter.sortfield}
                sortOrder={filter.order == 1 ? SortOrder.ASC : SortOrder.DESC}
                onSort={(e: DataTableSortEvent) => onSort(e)}
                dataKey="id"
                loading={loading}
                header={showHeader && header}
                size="small"
                resizableColumns
                expandedRows={expandedRows}
                onRowToggle={(e: any) => { onRowToggle && onRowToggle(e.data); }}
                rowExpansionTemplate={rowExpansionTemplate}
                onContextMenu={(e) => cm!.current?.show(e.originalEvent)}
                contextMenuSelection={contextMenuSelection}
                onContextMenuSelectionChange={(e) => {
                    onContextMenuSelectionChange && onContextMenuSelectionChange(e.value);
                }}
                emptyMessage={`No ${title} found.`}>
                {columns.map(col => {
                    if (col.columnCondition != undefined && !col.columnCondition) return null;
                    return (
                        <Column
                            key={col.key}
                            field={col.field}
                            header={col.header}
                            body={col.body}
                            style={col.style}
                            sortable={col.sortable}
                            expander={col.expander}
                        />
                    );
                })}
            </DataTable>
        </>
    );
};