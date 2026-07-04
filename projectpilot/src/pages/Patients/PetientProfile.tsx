import { useEffect, useState, type JSX } from "react";
import type { PatientModel } from "../../BussinessLogic/Models/Patient.Model";
import { Layout } from "../../Layout/main_layout/Layout";
import { useGetApi } from "../../BussinessLogic/Hooks/UseGetApi";
import { patientsService } from "../../BussinessLogic/Index.Service";
import { useNavigate, useParams } from "react-router-dom";
import { showError } from '../../Helpers/Toast.Helper'
import { RouterPaths } from "../../BussinessLogic/Routes/RouterPaths";
import { calculateAgeString, formatGender } from "../../Helpers/Constants";
import { MinusCircleIcon, PlusCircleIcon, Target } from "lucide-react";
import ViewReceiptsPartial from "../Receipt/ViewPartial";
import ViewAppointmentsPartial from "../Appointments/ViewPartial";
import { ViewLabReportsPartial } from "../Lab/Reports/ViewPartial";

const PatientProfile = () => {
    const { paramId } = useParams();
    const [allToggled, setAllToggled] = useState<boolean>(false);
    const [openIndices, setOpenIndices] = useState<Set<number>>(new Set());

    const navigate = useNavigate();

    const { data: patient, loading, refetch } = useGetApi<PatientModel | null, number>(
        (id) => patientsService.GetPatient(id!),
        { immediate: (!paramId && paramId != undefined && Number(paramId) > 0), payload: Number(paramId!) },
        [Number(paramId!)]
    );

    const toggleAccordion = (index: number) => {
        setOpenIndices((prev) => {
            const newSet = new Set(prev);
            newSet.has(index) ? newSet.delete(index) : newSet.add(index);
            return newSet;
        });
        setAllToggled(openIndices.size != 0);
    }

    const toggleAll = () => {
        if (!allToggled) {
            setAllToggled(true);
            const newSet = new Set<number>();
            newSet.add(1);
            newSet.add(2);
            newSet.add(3);
            newSet.add(4);
            setOpenIndices(newSet);
        } else {
            setOpenIndices(new Set());
            setAllToggled(false);
        }
    };

    const accordionItem = (index: number, title: string, child?: JSX.Element) => {
        return (
            <div className="border dark:border-gray-600 border-gray-950 rounded-md mb-2">
                <a onClick={() => toggleAccordion(index)} className={`rounded-tr-md rounded-tl-md cursor-pointer p-2 grid grid-cols-[5%_90%_5%] 
                    dark:bg-blue-500 bg-blue-700 dark:hover:bg-blue-800 hover:bg-blue-800
                    ${openIndices.has(index) ? "border-b dark:border-blue-600 border-blue-950 " : "rounded-bl-md rounded-br-md"}`}>
                    <Target className="w-5" />
                    <h2 className="font-bold flex select-none">{title}</h2>
                    {!openIndices.has(index) ? <PlusCircleIcon className="w-5 justify-end" /> : <MinusCircleIcon className="w-5 justify-end" />}
                </a>
                {openIndices.has(index) && <div className={`transition-all duration-600 ease-in-out 
                        ${openIndices.has(index) ? "max-h-full" : 'max-h-0'}
                        `}>
                    {child ? child : <div><p>Details about {title} ....</p></div>}
                </div>}
            </div>);
    }

    useEffect(() => {
        if (paramId == null && Number(paramId) <= 0) {
            showError("Sorry Patient could not be found");
            navigate(RouterPaths.viewPatients);
        }
        else {
            refetch();
        }
    }, [paramId]);

    const receiptsPartial = (<ViewReceiptsPartial id={patient?.id!} />)
    const appointmentsPartial = (<ViewAppointmentsPartial id={patient?.id!} />)
    const labReportsPartial = (<ViewLabReportsPartial id={patient?.id!} />)


    return (
        <>
            {loading && <div> Loading Patient...</div>}
            {patient != null &&
                <div className="grid grid-cols-[30%_70%] gap-1 m-2">
                    <div>
                        <img src={patient.picture} className="border dark:border-gray-500 border-gray-950 w-full rounded-tr-md rounded-tl-md h-[150px] mr-auto ml-auto object-cover" />
                        <div className="border rounded-bl-md rounded-br-md grid grid-rows gap-1 p-3 dark:border-gray-500 border-gray-950 border-t-0" >
                            <div className=" grid grid-cols-[30%_70%]">
                                <label className="font-bold">
                                    Name:
                                </label>
                                <p>{patient.name}</p>
                            </div>
                            <div className=" grid grid-cols-[30%_70%]">
                                <label className="font-bold">
                                    Mr No:
                                </label>
                                <p>{patient.patientNumber}</p>
                            </div>
                            <div className=" grid grid-cols-[30%_70%]">
                                <label className="font-bold">
                                    Gender:
                                </label>
                                <p>{formatGender(patient.gender)}</p>
                            </div>

                            <div className=" grid grid-cols-[30%_70%]">
                                <label className="font-bold">
                                    Address:
                                </label>
                                <p>{patient.address}</p>
                            </div>
                            <div className=" grid grid-cols-[30%_70%]">
                                <label className="font-bold">
                                    CNIC:
                                </label>
                                <p>{patient.cnic}</p>
                            </div>
                            <div className=" grid grid-cols-[30%_70%]">
                                <label className="font-bold">
                                    DOB:
                                </label>
                                {/* <p>{formatOptionalDate(patient.dateOfBirth, "dd MMM yyyy")}</p> */}
                            </div>
                            <div className=" grid grid-cols-[30%_70%]">
                                <label className="font-bold">
                                    Age:
                                </label>
                                <p>{calculateAgeString(patient.dateOfBirth)}</p>
                            </div>
                            <div className=" grid grid-cols-[30%_70%]">
                                <label className="font-bold">
                                    Created:
                                </label>
                                {/* <p>{formatDate(patient.created, "dd MMM yyyy")}</p> */}
                            </div>
                        </div>
                    </div>
                    <div>
                        <a onClick={() => toggleAll()} className="cursor-pointer uppercase grid grid-cols-[95%_5%] p-2 border hover:text-black 
                        dark:border-gray-600 border-gray-950 rounded-md dark:bg-gray-700 bg-gray-300 dark:hover:bg-gray-400 hover:bg-gray-500 mb-2">
                            <h2>
                                Patient's Details
                            </h2>
                            <span className="justify-end">
                                {!allToggled ? <PlusCircleIcon className="w-5" /> : <MinusCircleIcon className="w-5 justify-end" />}
                            </span>
                        </a>
                        {accordionItem(1, "Prescriptions")}
                        {accordionItem(2, "Lab Reports", labReportsPartial)}
                        {accordionItem(3, "Appointments", appointmentsPartial)}
                        {accordionItem(4, "Receipts", receiptsPartial)}
                    </div>
                </div >}
        </>
    );
}

PatientProfile.getLayout = (page: any) => {
    return (
        <Layout>{page}</Layout>
    )
}
export default PatientProfile
