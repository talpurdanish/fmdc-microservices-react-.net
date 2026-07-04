import { Layout } from "../../Layout/main_layout/Layout"
import Breadcrumbs from "../CommonWidgets/Breadcrumbs";

import { useState, useEffect } from 'react';

import { ConfirmDialog } from "primereact/confirmdialog";

import { useGetApi } from "../../BussinessLogic/Hooks/UseGetApi";
import { appointmentsService, patientsService, prescriptionsService } from "../../BussinessLogic/Index.Service";
import type { AppointmentModel } from "../../BussinessLogic/Models/Appointment.Model";
import { useNavigate, useParams } from "react-router-dom";
import type { PatientModel } from "../../BussinessLogic/Models/Patient.Model";
import { Constants } from "../../Helpers/Constants";
import { Tabs } from "../Tabs/Tabs";
import { Tab } from "../Tabs/Tab";
import { ViewLabReportsPartial } from "../Lab/Reports/ViewPartial";
import ViewPrescriptionPartial from "./ViewPartial";
import { AddMedications } from "./AddMedications";
import { VitalsForm } from "./AddVitals";
import { TestsForm } from "./AddTests";
import { PrescriptionDisplay } from "./Preview";
import { createPrescriptionModel, toJson, type PrescriptionModel } from "../../BussinessLogic/Models/Prescription.Model";
import { useStorage } from "../../BussinessLogic/Storage/Storage.Provider";
import { PlusIcon, RotateCcwIcon, XOctagonIcon } from "lucide-react";
import { createPrescriptionMedicationModel, ToOutput, ToString } from "../../BussinessLogic/Models/Prescription.Medication.Model";
import { AddRemarks } from "./AddRemarks";
import { Loading } from "../CommonWidgets/Loading";
import { useMutationApi } from "../../BussinessLogic/Hooks/UseMutationsApi";
import { createPrescriptionDTO, type CreatePrescriptionModel } from "../../BussinessLogic/Models/Create.Prescription.Model";
import { showError, showSuccess } from "../../Helpers/Toast.Helper";
import { RouterPaths } from "../../BussinessLogic/Routes/RouterPaths";

const CreatePrescriptions = () => {
    const { paramId } = useParams();
    // const { getUser } = useAuth();
    const storage = useStorage();
    const navigate = useNavigate();

    // const [user, setUser] = useState<LoginModel | null>(null);
    const [appointment, setAppointment] = useState<AppointmentModel | null>(null);
    const [patient, setPatient] = useState<PatientModel | null>(null);
    const [prescription, setPrescription] = useState<PrescriptionModel | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [generateEnabled, setGenerateEnabled] = useState<boolean>(false);
    const [medicationsAdded, setMedicationsAdded] = useState<boolean>(false);
    const [testsAdded, setTestsAdded] = useState<boolean>(false);
    const [vitalsAdded, setVitalsAdded] = useState<boolean>(false);
    const [remarksAdded, setRemarksAdded] = useState<boolean>(false);

    const { execute: getAppointmentCall } = useGetApi<AppointmentModel | null>((id) => appointmentsService.GetAppointment(id));
    const { execute: getPatientCall } = useGetApi<PatientModel | null>((id) => patientsService.GetPatient(id));

    const { mutate: createPrescriptionCall } = useMutationApi<boolean, CreatePrescriptionModel>(
        (pres) => prescriptionsService.CreatePrescription(pres!), {
        optimisticUpdate: () => {
            handleReset();
            storage.remove(Constants.PRESCRIPTION_STORAGE_KEY);
            navigate(RouterPaths.viewPatients);
        },
        onSuccess: () => {
            showSuccess(`Prescription has been created successfully!`);
        },
        onError: () => {
            showError(`Prescription could not be created!`);
        },
    });

    useEffect(() => {
        setLoading(true);

        const storedPrescription = storage.get<string>(Constants.PRESCRIPTION_STORAGE_KEY);
        if (storedPrescription) {
            const parsedPrescription = createPrescriptionModel(storedPrescription);
            if (paramId != undefined && Number(paramId) > 0 && parsedPrescription.id == Number(paramId)) {
                setPrescription(parsedPrescription);
                setLoading(false);
                setLoaded(true);
                updateGenerateEnabled(parsedPrescription);
                return;
            }
        }
    }, [paramId]);
    useEffect(() => {
        if (!loaded && paramId != undefined && Number(paramId) > 0) {

            const getAppointment = async () => {
                const id = Number(paramId);
                const a = await getAppointmentCall(id);
                setAppointment(a);
            };
            getAppointment();
        }
        loadPrescription();

    }, [paramId]);

    useEffect(() => {
        if (!loaded && appointment != undefined && appointment != null) {
            const getPatient = async () => {
                const p = await getPatientCall(appointment!.PatientId);
                setPatient(p);
            };
            getPatient();
        }
    }, [appointment]);

    useEffect(() => {
        if (!loaded) {
            const loadPrescriptionAsync = async () => {
                await loadPrescription();
            };
            loadPrescriptionAsync();
        }
    }, [appointment, patient])

    const loadPrescription = async () => {

        if (appointment != undefined && appointment != null && patient != null) {
            const raw = {
                id: -1,
                appointmentid: appointment.id,
                startTime: appointment.StartTime,

                patientId: patient.id,
                patientName: patient.name,
                patientNumber: patient.patientNumber,
                fatherName: patient.fatherName,
                dateOfBirth: patient.dateOfBirth,
                gender: patient.genderString,

                doctor: appointment.DoctorName,
                doctorId: appointment.UserId,

                date: new Date().toString(),
                bp: '',
                pulse: 0,
                bsr: 0,
                temp: 0,
                wt: 0,
                ht: 0,
                diagnosis: '',
                remarks: '',
                medicines: [],
                medicineStrings: [],
                tests: [],
                testNames: [],
            };
            const prescriptionCreated = createPrescriptionModel(raw);
            setPrescription(prescriptionCreated);
            updateGenerateEnabled(prescriptionCreated);
            savePrescription(prescriptionCreated);
            setLoading(false);
        }
    };

    useEffect(() => {
        setGenerateEnabled((medicationsAdded || testsAdded) && vitalsAdded && remarksAdded);
    }, [prescription, vitalsAdded, medicationsAdded, testsAdded, remarksAdded]);

    const updateGenerateEnabled = (prescription: any) => {

        if (prescription == null) {
            setGenerateEnabled(false);
            return;
        }

        const v = prescription.Bp != "";
        const t = prescription.Tests.length > 0;
        const m = prescription.MedicineStrings.length > 0;
        const r = prescription.Diagnosis != "" && prescription.Remarks != "";
        setRemarksAdded(r);
        setVitalsAdded(v);
        setMedicationsAdded(m);
        setTestsAdded(t);

    };

    const addMedication = (
        code: number,
        times: number,
        days: number,
        quantity: number,
        unit: string,
        med: string,) => {

        setPrescription((prev) => {
            if (!prev) return prev;

            const raw = {
                id: -1,
                quantity: quantity,
                units: unit,
                code: code,
                times: times,
                medicine: med,
                days: days,
            };

            var medicine = createPrescriptionMedicationModel(raw);

            const updatedMedicines = [...prev.Medicines, medicine];
            const updatedMedicineStrings = [...prev.MedicineStrings, ToString(medicine)]

            const updatedPrescription = {
                ...prev,
                Medicines: updatedMedicines,
                MedicineStrings: updatedMedicineStrings
            };
            setMedicationsAdded(updatedPrescription != null && updatedPrescription.MedicineStrings.length > 0);
            savePrescription(updatedPrescription);
            return updatedPrescription;
        });

    };
    const deleteMedicine = (index: number) => {
        setPrescription((prev) => {
            if (!prev) return prev;
            const filteredMedicines = prev.Medicines.filter((_, idx) => idx != index);
            const filteredMedicineStrings = prev.MedicineStrings.filter((_, idx) => idx != index);

            const updatedPrescription = {
                ...prev,
                Medicines: filteredMedicines,
                MedicineStrings: filteredMedicineStrings
            };
            setMedicationsAdded(updatedPrescription != null && updatedPrescription.MedicineStrings.length > 0);
            savePrescription(updatedPrescription);
            return updatedPrescription;
        });

    }

    const addDiagnosisAndRemarks = (diagnosis: string, remarks: string) => {
        setPrescription((prev) => {
            if (!prev) return prev;
            const updatedPrescription = {
                ...prev,
                Diagnosis: diagnosis,
                Remarks: remarks,
            };
            setRemarksAdded(updatedPrescription != null && updatedPrescription.Diagnosis != "" && updatedPrescription.Remarks != "");
            savePrescription(updatedPrescription);
            return updatedPrescription;
        });

    };

    const addVitals = (
        Bp: string,
        Pulse: number,
        Bsr: number,
        Temp: number,
        Wt: number,
        Ht: number) => {

        setPrescription((prev) => {
            if (!prev) return prev;

            const updatedPrescription = {
                ...prev,
                Bp: Bp,
                Pulse: Pulse,
                Bsr: Bsr,
                Temp: Temp,
                Wt: Wt,
                Ht: Ht,
            };
            setVitalsAdded(true);
            savePrescription(updatedPrescription);
            return updatedPrescription;
        });

    };

    const addTests = (tests: number[], testNames: string[]) => {

        setPrescription((prev) => {
            if (!prev) return prev;

            tests.forEach(test => {
                prev.Tests.filter(t => t != test);
            });

            testNames.forEach(testName => {
                prev.TestNames.filter(t => t != testName);
            });

            const updatedTests = [...prev.Tests, ...tests];
            const updatedTestNames = [...prev.TestNames, ...testNames];

            const updatedPrescription = {
                ...prev,
                Tests: updatedTests,
                TestNames: updatedTestNames
            };
            setTestsAdded(updatedPrescription != null && updatedPrescription.Tests.length > 0);
            savePrescription(updatedPrescription);
            return updatedPrescription;
        });

    }

    const deleteTest = (index: number) => {
        setPrescription((prev) => {
            if (!prev) return prev;
            const filteredTests = prev.Tests.filter((_, idx) => idx != index);
            const filteredTestNames = prev.TestNames.filter((_, idx) => idx != index);
            const updatedPrescription = {
                ...prev,
                Tests: filteredTests,
                TestNames: filteredTestNames
            };

            setTestsAdded(updatedPrescription != null && updatedPrescription.Tests.length > 0);
            savePrescription(updatedPrescription);
            return updatedPrescription;
        });

    }

    const savePrescription = (prescription: any) => {
        storage.set<string>(Constants.PRESCRIPTION_STORAGE_KEY, toJson(prescription));
    }
    const handleCancel = () => {
        handleReset();
        storage.remove(Constants.PRESCRIPTION_STORAGE_KEY);
        navigate(RouterPaths.viewPatients);
    };

    const handleReset = () => {
        setPrescription(prev => {
            if (!prev) return prev;

            const resetPrescription = {
                ...prev,
                Bp: '',
                Pulse: 0,
                Bsr: 0,
                Temp: 0,
                Wt: 0,
                Ht: 0,
                Diagnosis: '',
                Remarks: '',
                Medicines: [],
                MedicineStrings: [],
                Tests: [],
                TestNames: [],
            };

            // Clear sessionStorage or overwrite with reset version
            savePrescription(resetPrescription);
            setMedicationsAdded(false);
            setTestsAdded(false);
            setVitalsAdded(false);
            return resetPrescription;
        });
    };


    const create = async () => {
        if (prescription) {
            const raw =
            {
                appointmentid: prescription.Appointmentid,
                patientId: prescription.PatientId,
                doctorId: prescription.DoctorId,
                bp: prescription.Bp,
                pulse: prescription.Pulse,
                bsr: prescription.Bsr,
                temp: prescription.Temp,
                wt: prescription.Wt,
                ht: prescription.Ht,
                diagnosis: prescription.Diagnosis,
                remarks: prescription.Remarks,
                medications: prescription.Medicines.map((med) => {
                    return ToOutput(med);
                }),
                tests: prescription.Tests,
            };
            var pres = createPrescriptionDTO(raw);
            await createPrescriptionCall(pres);
        }
    };



    const navItems = [
        { name: "Home", link: "/" },
        { name: "Prescriptions", link: undefined },
        { name: "Create", link: undefined } // last breadcrumb, no link
    ];
    const title = "Create Prescriptions";

    return (
        <>
            <ConfirmDialog />
            <Breadcrumbs nav={navItems} title={title} />
            <div className="bg-gray-300 dark:bg-gray-700 w-full p-2 mb-3 mt-5 relative">
                <div className="w-full">
                    <Tabs>
                        <Tab header="History">
                            <ViewPrescriptionPartial id={prescription?.PatientId} />
                        </Tab>
                        <Tab header="Reports">
                            <ViewLabReportsPartial id={prescription?.PatientId} pending={false} onPrescription={true} />
                        </Tab>
                    </Tabs>
                </div>
                <div className="grid grid-cols-[26%_54%_20%] gap-1 w-full">
                    <div>
                        <AddMedications addMedication={(medicationId, times, days, quantity, unit, med) => addMedication(medicationId, times, days, quantity, unit, med)} />
                        <AddRemarks addDiagnosisAndRemarks={(diagnosis, remarks) => addDiagnosisAndRemarks(diagnosis, remarks)}
                            diagnosis={prescription?.Diagnosis ?? ""}
                            remarks={prescription?.Remarks ?? ""}
                        />
                        <div className="section">
                            <h2 className="section-header">Generate Prescription</h2>
                            <div className="flex mr-auto ml-auto justify-center items-center gap-1 mt-2">
                                <button onClick={() => { create() }}
                                    type="button"
                                    disabled={!generateEnabled}
                                    className="btn btn-success btn-rounded btn-padding-md">
                                    <PlusIcon className="w-[25px]" />
                                    <span className="w-[85%]">Generate</span>
                                </button>
                                <button
                                    type="button" onClick={() => handleReset()}
                                    className="btn btn-warning btn-rounded btn-padding-md">
                                    <RotateCcwIcon />
                                </button>
                                <button
                                    type="button" onClick={() => handleCancel()}
                                    className="btn btn-danger btn-rounded btn-padding-md">
                                    <XOctagonIcon /> <span className="flex-1">Cancel</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-300 dark:bg-gray-700">
                        <div className="border dark:border-gray-400 border-dashed rounded m-1 p-1">
                            <PrescriptionDisplay
                                deleteMedicine={(index) => deleteMedicine(index)}
                                deleteTest={(index) => deleteTest(index)}
                                prescription={prescription!} />
                        </div>
                    </div>
                    <div className="bg-gray-300 dark:bg-gray-700">
                        <TestsForm addTests={(tests, testNames) => addTests(tests, testNames)} />
                        <VitalsForm addVitals={(Bp, Pulse, Bsr, Temp, Wt, Ht) => addVitals(Bp, Pulse, Bsr, Temp, Wt, Ht)} />
                    </div>
                </div>
                <Loading isVisible={loading} loadingText="Loading Prescription..." />
            </div >
        </>
    )
}

CreatePrescriptions.getLayout = (page: any) => {
    return (
        <Layout>{page}</Layout>
    )
}
export default CreatePrescriptions