
import { useState, useEffect, type JSX } from "react";
import type { LoginModel } from "../../../BussinessLogic/Models/Login.Model";
import { type LabReportModel } from "../../../BussinessLogic/Models/LabReport.Model";
import { useAuth } from "../../../BussinessLogic/Security/Auth.Context";

import Breadcrumbs from "../../CommonWidgets/Breadcrumbs";
import { LabReportTable } from "./View";
import { Layout } from "../../../Layout/main_layout/Layout";
import { useGetApi } from "../../../BussinessLogic/Hooks/UseGetApi";
import type { Filter } from "../../../BussinessLogic/Models/Generics/Filter";
import { labReportsService } from "../../../BussinessLogic/Index.Service";

import createDefaultFilter from "../../../BussinessLogic/Models/Generics/Filter";
import { Roles } from "../../../Helpers/Constants";
import { LabReportsForm } from "./Form";
import type { PagedResults } from "../../../BussinessLogic/Models/Generics/PagedResults";
import { parse } from "date-fns/parse";
import { set } from "date-fns";

const ManageReports = () => {

    const [user, setUser] = useState<LoginModel | null>(null);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedLabReport, setSelectedLabReport] = useState<LabReportModel | undefined>(undefined);

    const [filter, setFilter] = useState<Filter>(
        createDefaultFilter()
    );

    const { getUser } = useAuth();
    const handleEdit = (labReport: LabReportModel) => {
        setIsEdit(true);
        setSelectedLabReport(labReport);
    };

    const combineDateAndTime = (dateStr?: string, timeStr?: string): Date | null => {
        if (!dateStr || !timeStr) return null;
        const date = parse(dateStr, "dd/MM/yyyy", new Date());
        const [hours, minutes] = timeStr.split(":").map(Number);
        return set(date, { hours, minutes });
    };




    const createDto = (data: LabReportModel): any => {
        return {
            id: isEdit ? data?.id : -1,
            deliveryDate: combineDateAndTime(data?.ReportDeliveryDate, data?.ReportDeliveryTime),
            testId: data?.TestId,
            patientId: data?.PatientId,
            doctorId: data?.DoctorId,
            note: data?.Note,
        };
    }

    const { data: allReports, loading, refetch } = useGetApi<PagedResults<LabReportModel>, Filter>(
        (filter) =>
            labReportsService.GetLabReports(false, filter!),
        { immediate: true, payload: filter! },
        [filter!]
    );

    const navItems = [
        { name: "Home", link: "/" },
        { name: "LabReports", link: undefined },
        { name: "Manage", link: undefined }
    ];
    const title = "Manage Lab Reports";

    useEffect(() => {
        setUser(getUser());
        setIsEdit(false);
    }, []);

    return (
        <>
            <Breadcrumbs nav={navItems} title={title} />
            <div className=" w-full flex">
                {user?.role == Roles.admin.id &&
                    <div className="w-[30%] flex-auto p-5 mr-1 dark:bg-[#2a323d]">
                        <LabReportsForm
                            isEdit={isEdit}
                            initialValues={createDto(selectedLabReport!)}
                            loadData={() => refetch()}
                        />
                    </div>
                }
                <div className="w-[69%] flex-auto">
                    <LabReportTable
                        role={user?.role!}
                        onEdit={(selectedLabReport) => handleEdit(selectedLabReport!)}
                        reports={allReports!}
                        loadData={(filter: Filter) => {
                            setFilter(filter);
                            refetch();
                        }}
                        loading={loading}
                    />
                </div>
            </div >
        </>
    )
};

ManageReports.getLayout = (page: JSX.Element) => {
    return (
        <Layout>{page}</Layout>
    )
}
export default ManageReports