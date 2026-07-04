
import { useEffect, useState, type JSX } from "react";

import Breadcrumbs from "../CommonWidgets/Breadcrumbs";

import { Layout } from "../../Layout/main_layout/Layout";
import { AddProcedures } from "./AddProcedures";

import { RecieptDisplay } from "./Reciept";
import { useNavigate, useSearchParams } from "react-router-dom";
import { type ReceiptModel, createReceiptModel } from "../../BussinessLogic/Models/Receipt.Model";
import { useGetApi } from "../../BussinessLogic/Hooks/UseGetApi";
import { type PatientModel } from "../../BussinessLogic/Models/Patient.Model";
import { appointmentsService, patientsService, proceduresService, receiptsService, testsService, usersService } from "../../BussinessLogic/Index.Service";
import { type AppointmentModel } from "../../BussinessLogic/Models/Appointment.Model";
import { type ProcedureModel } from "../../BussinessLogic/Models/Procedure.Model";
import { type UserModel } from "../../BussinessLogic/Models/User.Model";
import { useStorage } from "../../BussinessLogic/Storage/Storage.Provider";
import { useMutationApi } from "../../BussinessLogic/Hooks/UseMutationsApi";

import { RouterPaths } from "../../BussinessLogic/Routes/RouterPaths";
import { showError, showSuccess } from "../../Helpers/Toast.Helper";
import { Constants } from "../../Helpers/Constants";
import type { TestModel } from "../../BussinessLogic/Models/Test.Model";
import { AddDiscount } from "./AddDiscount";
import { AddTests } from "./AddTests";
import { CheckSquareIcon, RotateCcwIcon, XOctagonIcon } from "lucide-react";
import { Loading } from "../CommonWidgets/Loading";


const ManageReceipts = () => {
    const [searchParams] = useSearchParams();
    const storage = useStorage();
    const navigate = useNavigate();
    // Get values by key
    const pId = searchParams.get("patientId");
    const aId = searchParams.get("appointmentId");
    const [type, setType] = useState<number>(1);
    const [patientId, setPatientId] = useState<number>(-1);
    const [appointmentId, setAppointmentId] = useState<number>(-1);
    const [receipt, setReceipt] = useState<ReceiptModel | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const { mutate: createOrUpdate } = useMutationApi<boolean, ReceiptModel>((reciept) => receiptsService.CreateReceipt(reciept!), {
        optimisticUpdate: () => {
            resetReceipt();
            setReceipt(null);
            storage.remove(Constants.RECEIPT_STORAGE_KEY);
            navigate(RouterPaths.viewReceipts);
        },
        onSuccess: () => {
            showSuccess("Receipt has been added");
        },
        onError: () => {
            showError("Receipt could not be added");
        },

    });

    const { execute: getPatient } = useGetApi<PatientModel | null, number>(
        (patientId) => patientsService.GetPatient(patientId!),
    );


    const { execute: GetAppointment } = useGetApi<AppointmentModel | null, number>(
        (appointmentId) => appointmentsService.GetAppointment(appointmentId!),
    );

    const { execute: getProcedure } = useGetApi<ProcedureModel | null, number>(
        (procedureId) =>
            proceduresService.GetProcedure(procedureId!),
    );

    const { execute: getTest } = useGetApi<TestModel | null, number>(
        (testId) =>
            testsService.GetTest(testId!),
    );

    const { execute: getDoctor } = useGetApi<UserModel | null, number>(
        (doctorId) =>
            usersService.GetUser(doctorId!),

    );
    useEffect(() => {
        setLoading(true);

        const storedReceipt = storage.get<string>(Constants.RECEIPT_STORAGE_KEY);
        if (storedReceipt) {
            const parsed = JSON.parse(storedReceipt);
            if (parsed.PatientId == patientId && parsed.AppointmentId == appointmentId) {
                setReceipt(parsed);
                setLoading(false);
                return;
            }
        }

        if (!pId || !aId)
            navigate(RouterPaths.viewPatients);

        // Otherwise, build a new receipt if patient + appointment are available
        if (pId && Number(pId) > 0) {
            setPatientId(Number(pId));
        }
        if (aId && Number(aId) > 0) {
            setAppointmentId(Number(aId));
        }
        loadReciept();
    }, [pId, aId, patientId, appointmentId]);

    const loadReciept = async () => {
        if (patientId > 0 && appointmentId > 0) {
            const patient = await getPatient(patientId);
            const appointment = await GetAppointment(appointmentId);

            const raw = {
                id: -1,
                recieptNumber: "000000001",
                patientId,
                doctorId: appointment?.UserId,
                appointmentId,
                patientName: patient?.name ?? "",
                patientNumber: patient?.patientNumber ?? "",
                doctor: appointment?.DoctorName ?? "",
                date: appointment?.Date?.toString() ?? new Date().toISOString(),
                time: appointment?.StartTime ?? new Date().toLocaleTimeString(),
                authorizedBy: "",
                authorizedById: -1,
                discount: 0,
                total: 0,
                grandTotal: 0,
                appointment: "",
                paid: false,
                procedures: [],
                procedureIds: [],
                test: [],
                testIds: []
            };

            const receiptCreated = createReceiptModel(raw);

            setReceipt(receiptCreated);

            // Save to sessionStorage for next time
            storage.set<string>(Constants.RECEIPT_STORAGE_KEY, JSON.stringify(receiptCreated));

            setLoading(false);
        }
    };
    const addProcedure = async (id: number) => {
        setType(1);
        const procedure = await getProcedure(id);
        if (procedure && receipt) {
            setReceipt(prev => {
                if (!prev) return prev;

                const updatedProcedures = [...prev.Procedures, procedure];
                const updatedProcedureIds = [...prev.ProcedureIds, id];

                const newTotal = prev.Total + procedure.cost;//updatedProcedures.reduce((sum, p) => sum + p.cost, 0);
                const newGrandTotal =
                    prev.Discount > 0
                        ? newTotal - (newTotal * prev.Discount / 100)
                        : newTotal;

                const updatedReceipt = {
                    ...prev,
                    Procedures: updatedProcedures,
                    ProcedureIds: updatedProcedureIds,
                    Total: newTotal,
                    GrandTotal: newGrandTotal,
                };

                // persist to sessionStorage
                storage.set<string>(Constants.RECEIPT_STORAGE_KEY, JSON.stringify(updatedReceipt));

                return updatedReceipt;
            });
        }
    };

    const addTest = async (id: number) => {
        setType(2);
        const test = await getTest(id);
        if (test && receipt) {
            setReceipt(prev => {
                if (!prev) return prev;

                const updatedTests = [...prev.Tests, test];
                const updatedTestIds = [...prev.TestIds, id];

                const newTotal = prev.Total + test.cost;
                const newGrandTotal =
                    prev.Discount > 0
                        ? newTotal - (newTotal * prev.Discount / 100)
                        : newTotal;

                const updatedReceipt = {
                    ...prev,
                    Tests: updatedTests,
                    TestIds: updatedTestIds,
                    Total: newTotal,
                    GrandTotal: newGrandTotal,
                };

                // persist to sessionStorage
                storage.set<string>(Constants.RECEIPT_STORAGE_KEY, JSON.stringify(updatedReceipt));

                return updatedReceipt;
            });
        }
    };


    const addDetail = (id: number, type: number) => {
        if (type == 1)
            addProcedure(id);
        else if (type == 2)
            addTest(id);
    };

    const deleteDetail = (id: number, type: number) => {
        if (type == 1)
            deleteProcedure(id);
        else if (type == 2)
            deleteTest(id);
    };

    const addDiscount = async (doctorId: number, discountValue: number) => {
        if (discountValue > 0 && doctorId > 0 && receipt) {
            const doctor = await getDoctor(doctorId);

            setReceipt(prev => {
                if (!prev) return prev;

                const newGrandTotal = prev.Total - (prev.Total * discountValue / 100);

                const updatedReceipt = {
                    ...prev,
                    Discount: discountValue,
                    AuthorizedById: doctorId,
                    AuthorizedBy: doctor?.name ?? "",
                    GrandTotal: newGrandTotal,
                };

                // persist to sessionStorage
                storage.set<string>(Constants.RECEIPT_STORAGE_KEY, JSON.stringify(updatedReceipt));

                return updatedReceipt;
            });
        }
    };

    const deleteProcedure = (id: number) => {
        if (!receipt) return;

        setReceipt(prev => {
            if (!prev) return prev;

            const updatedProcedures = prev.Procedures.filter(p => p.id !== id);
            const updatedProcedureIds = prev.ProcedureIds.filter(pid => pid !== id);

            const newTotal = updatedProcedures.reduce((sum, p) => sum + p.cost, 0);
            const newGrandTotal =
                prev.Discount > 0
                    ? newTotal - (newTotal * prev.Discount / 100)
                    : newTotal;

            const updatedReceipt = {
                ...prev,
                Procedures: updatedProcedures,
                ProcedureIds: updatedProcedureIds,
                Total: newTotal,
                GrandTotal: newGrandTotal,
            };

            // persist to sessionStorage
            storage.set<string>(Constants.RECEIPT_STORAGE_KEY, JSON.stringify(updatedReceipt));

            return updatedReceipt;
        });
    };

    const deleteTest = (id: number) => {
        if (!receipt) return;

        setReceipt(prev => {
            if (!prev) return prev;

            const updatedTests = prev.Tests.filter(p => p.id !== id);
            const updatedTestIds = prev.TestIds.filter(pid => pid !== id);

            const newTotal = updatedTests.reduce((sum, p) => sum + p.cost, 0);
            const newGrandTotal =
                prev.Discount > 0
                    ? newTotal - (newTotal * prev.Discount / 100)
                    : newTotal;

            const updatedReceipt = {
                ...prev,
                Tests: updatedTests,
                TestIds: updatedTestIds,
                Total: newTotal,
                GrandTotal: newGrandTotal,
            };

            // persist to sessionStorage
            storage.set<string>(Constants.RECEIPT_STORAGE_KEY, JSON.stringify(updatedReceipt));

            return updatedReceipt;
        });
    };

    const resetReceipt = () => {
        setReceipt(prev => {
            if (!prev) return prev;

            const resetReceipt = {
                ...prev,
                Procedures: [],
                ProcedureIds: [],
                Tests: [],
                TestIds: [],
                Total: 0,
                GrandTotal: 0,
                Discount: 0,
                AuthorizedBy: "",
                AuthorizedById: -1,
                Paid: false,
            };

            // Clear sessionStorage or overwrite with reset version
            storage.set<string>(Constants.RECEIPT_STORAGE_KEY, JSON.stringify(resetReceipt));

            return resetReceipt;
        });
    };

    const handleCancel = () => {
        resetReceipt();
        storage.remove(Constants.RECEIPT_STORAGE_KEY);
        navigate(RouterPaths.viewPatients);
    };

    const addReceipt = async () => {
        const stored = storage.get<string>(Constants.RECEIPT_STORAGE_KEY);
        if (!stored) {
            console.error("No receipt found in sessionStorage");
            return;
        }

        try {
            const parsed = JSON.parse(stored);

            const raw = {
                id: parsed.Id ?? 0,
                receiptNumber: parsed.RecieptNumber ?? "",
                patientId: parsed.PatientId ?? 0,
                doctorId: parsed.DoctorId ?? 0,
                appointmentId: parsed.AppointmentId ?? "",
                patientName: parsed.PatientName ?? "",
                patientNumber: parsed.PatientNumber ?? "",
                doctor: parsed.Doctor ?? "",
                date: parsed.Date ?? new Date().toDateString(),
                time: parsed.Time ?? new Date().toLocaleTimeString(),
                authorizedBy: parsed.AuthorizedBy ?? "",
                authorizedById: parsed.AuthorizedById ?? -1,
                discount: parsed.Discount ?? 0,
                total: parsed.Total ?? 0,
                grandTotal: parsed.GrandTotal ?? 0,
                appointment: parsed.Appointment ?? "",
                paid: parsed.Paid ?? false,
                procedures: parsed.Procedures ?? [],
                procedureIds: parsed.ProcedureIds ?? [],
                tests: parsed.Tests ?? [],
                testIds: parsed.TestIds ?? [],
            };


            const receiptModel = createReceiptModel(raw);
            if (receiptModel.Procedures.length > 0)
                await createOrUpdate(receiptModel);
        } catch (err) {
            console.error("Failed to parse receipt from sessionStorage", err);
        }
    };


    const navItems = [
        { name: "Home", link: "/" },
        { name: "Receipts", link: undefined },
        { name: "Manage", link: undefined }
    ];
    const title = "Manage Receipts";

    return (
        <>

            <Breadcrumbs nav={navItems} title={title} />
            <div className=" w-full flex gap-2 relative">
                <div className="w-[20%] flex-none p-2  dark:bg-[#2a323d] bg-gray-200">
                    <AddProcedures
                        addProcedures={(id) => addDetail(id, 1)}
                    />
                </div>
                <div className="flex-1 flex flex-col gap-2 ">
                    <div className="dark:bg-[#2a323d] p-2 bg-gray-200">
                        <RecieptDisplay receipt={receipt!} deleteDetail={(id, type) => deleteDetail(id, type)} type={type} />
                    </div>
                    <div className="dark:bg-[#2a323d] p-2 bg-gray-200">
                        <AddDiscount addDiscount={(id, discount) => addDiscount(id, discount)}></AddDiscount>
                    </div>
                    <div className="dark:bg-[#2a323d] bg-gray-200 p-2 flex flex-row gap-2 items-center justify-center">
                        <button className="btn btn-success btn-padding-md flex btn-rounded" onClick={() => addReceipt()}>
                            <CheckSquareIcon />
                            <span className="flex-1">Generate Receipt</span>
                        </button>
                        <button className="btn btn-warning btn-padding-md flex btn-rounded" onClick={() => resetReceipt()}>
                            <RotateCcwIcon />
                            <span className="flex-1">Reset</span>
                        </button>
                        <button
                            type="button" onClick={() => handleCancel()}
                            className="btn btn-danger btn-rounded btn-padding-md">
                            <XOctagonIcon /> <span className="flex-1">Cancel</span>
                        </button>
                    </div>
                </div>
                <div className="w-[20%] flex-none p-2  dark:bg-[#2a323d] bg-gray-200">
                    <AddTests
                        addTests={(id) => addDetail(id, 2)}
                    />
                </div>
                <Loading isVisible={loading} />
            </div>
        </>
    )
};

ManageReceipts.getLayout = (page: JSX.Element) => {
    return (
        <Layout>{page}</Layout>
    )
}
export default ManageReceipts