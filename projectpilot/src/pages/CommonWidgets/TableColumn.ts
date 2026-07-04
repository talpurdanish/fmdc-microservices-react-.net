import type { DataTableValue } from "primereact/datatable";
import type { ReactNode } from "react";

export interface ColumnConfig<T extends DataTableValue> {
    key: string;
    header: any;
    field?: keyof T & string;
    body?: (row: T) => ReactNode;
    style?: React.CSSProperties;
    sortable?: boolean;
    columnCondition?: boolean;
    expander?: boolean;
}