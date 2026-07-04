import type { JSX } from "react/jsx-runtime";
import { Layout } from "../Layout/main_layout/Layout";
import ViewAppointmentsPartial from "./Appointments/ViewPartial";

import { useEffect, useState } from "react";
import { ViewLabReportsPartial } from "./Lab/Reports/ViewPartial";
import ViewReceiptsPartial from "./Receipt/ViewPartial";
import { useGetApi } from "../BussinessLogic/Hooks/UseGetApi";
import type { AppointmentStats } from "../BussinessLogic/Models/Appointment.Stats.Modle";
import { appointmentsService, receiptsService } from "../BussinessLogic/Index.Service";
import type { IncomeStats } from "../BussinessLogic/Models/Income.Stats.Model";
import { Chart } from "primereact/chart";
import { useRefreshContext } from "../BussinessLogic/Hooks/UseRefreshContext";
import { Constants } from "../Helpers/Constants";
import KafkaTester from "./KafkaTester";
import { Button } from "primereact/button";

const Dashboard = () => {

    const [showKafkaTester, setShowKafkaTester] = useState<boolean>(false);

    const [chartData, setChartData] = useState({});
    const [aChartData, setAChartData] = useState({});
    const [tChartData, setTChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    const [aStats, setAStats] = useState<AppointmentStats | null>(null);
    const [iStats, setIStats] = useState<IncomeStats | null>(null);

    const { register, unregister } = useRefreshContext();

    const { execute: getAppointmentsStatsCall } = useGetApi<AppointmentStats>(() => appointmentsService.GetAppointmentStats());

    const { execute: getIncomeStatsCall } = useGetApi<IncomeStats>(() => receiptsService.GetIncomeStats());



    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--color-text');
        // const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');


        const options = {
            maintainAspectRatio: false,
            aspectRatio: 1,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    },
                    display: false
                }
            },
            scales: {
                x: {
                    padding: 1,
                    // ticks: {
                    //     color: textColor
                    // },
                    grid: {
                        color: surfaceBorder,
                        display: false
                    }
                },
                y: {
                    // ticks: {
                    //     color: textColor
                    // },
                    grid: {
                        color: surfaceBorder,
                        display: true
                    }
                }
            }
        };

        setChartOptions(options);
    }, [iStats]);



    useEffect(() => {
        const data = {
            labels: iStats?.Labels,
            datasets: [
                {
                    label: 'Income Stats',
                    data: iStats?.Data,
                },
            ],
        };
        setChartData(data);
    }, [iStats]);


    useEffect(() => {
        const data = {
            labels: ["Total", "Pending", "Today's", "Pending"],
            datasets: [
                {
                    label: 'Stats',
                    data: [aStats?.Total, aStats?.Pending, aStats?.TodaysTotal, aStats?.TodaysPending,],
                },
            ],
        };
        setAChartData(data);
    }, [aStats]);


    useEffect(() => {
        const data = {
            labels: ["Total", "Today's"],
            datasets: [
                {
                    label: 'Stats',
                    data: [iStats?.Total, iStats?.Todays],
                },
            ],
        };
        setTChartData(data);
    }, [iStats]);



    const fetchAppointmentData = async () => {
        const aSt = await getAppointmentsStatsCall();
        setAStats(aSt);
    }

    const fetchIncomeData = async () => {
        const iSt = await getIncomeStatsCall();
        setIStats(iSt);
    }

    useEffect(() => {
        register(Constants.APPOINTMENT_TRIGGER, fetchAppointmentData);
        return () => unregister(Constants.APPOINTMENT_TRIGGER);
    }, [register, unregister, fetchAppointmentData]);

    useEffect(() => {
        register(Constants.INCOME_TRIGGER, fetchIncomeData);
        return () => unregister(Constants.INCOME_TRIGGER);
    }, [register, unregister, fetchIncomeData]);

    useEffect(() => {
        fetchAppointmentData();
        fetchIncomeData();
    }, []);

    return (
        <>
            <div className="flex gap-1">
                <div className="basis-1/3 flex flex-col gap-2 items-stretch">
                    <div className="count-only-bg">
                        <div className="count-header">Appointments</div>
                        <Chart
                            type="bar"
                            data={aChartData}
                            options={chartOptions}
                            className="w-full h-30"
                        />
                    </div>
                    <div className="count-only-bg">
                        <h2 className="count-header">INCOME</h2>
                        <Chart
                            type="line"
                            data={chartData}
                            options={chartOptions}
                            className="w-full h-30"
                        />
                    </div>
                    <div className="count-only-bg">
                        <h2 className="count-header">EARNINGS</h2>
                        <Chart
                            type="bar"
                            data={tChartData}
                            options={chartOptions}
                            className="w-full h-30"
                        />
                    </div>
                </div>
                <div className="basis-2/3 flex flex-col gap-2">
                    <div className="flex p-1 w-full mx-auto">
                        <Button label={showKafkaTester ? 'Hide Kafka' : 'Show Kafka'} onClick={() => setShowKafkaTester(!showKafkaTester)} />
                    </div>
                    {!showKafkaTester &&
                        <>
                            <ViewAppointmentsPartial pending={true} withPanel={true} refresh={true} />
                            <ViewReceiptsPartial pending={true} withPanel={true} refresh={true} />
                            <ViewLabReportsPartial pending={true} withPanel={true} refresh={true} />
                        </>
                    }
                    {showKafkaTester &&
                        <div className="flex flex-col">
                            <KafkaTester />
                        </div>
                    }
                </div>
            </div>
        </>
    )
};

Dashboard.getLayout = (page: JSX.Element) => {
    return (
        <Layout>{page}</Layout>
    )
}
export default Dashboard