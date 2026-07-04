export interface AppointmentStats {
    Total: number;
    Pending: number;
    TodaysTotal: number;
    TodaysPending: number;
}

export function createAppointmentStats(raw: any): AppointmentStats {
    return {
        Total: raw.total ?? 0,
        Pending: raw.pending ?? 0,
        TodaysTotal: raw.todaysTotal ?? 0,
        TodaysPending: raw.todaysPending ?? 0
    }
}