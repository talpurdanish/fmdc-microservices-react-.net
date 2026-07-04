export interface IncomeStats {
    Todays: number;
    Total: number;
    Labels: string[];
    Data: number[];
}

export function createIncomeStats(raw: any): IncomeStats {
    return {
        Todays: raw.todays ?? 0,
        Total: raw.total ?? 0,
        Labels: Array.isArray(raw.labels) ? raw.labels : [],
        Data: Array.isArray(raw.data) ? raw.data : []
    };
}



// export interface ChartData {
//     labels: string[];
//     datasets: ChartDataSet[]
// }

// export interface ChartDataSet {
//     label: string;
//     data: number[];
// }