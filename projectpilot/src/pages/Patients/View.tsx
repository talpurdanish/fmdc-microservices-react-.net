import { Layout } from "../../Layout/main_layout/Layout"
import Breadcrumbs from "../CommonWidgets/Breadcrumbs";

import { useState, useEffect } from 'react';
import { patientsService } from "../../BussinessLogic/Index.Service";
import { type PatientModel } from "../../BussinessLogic/Models/Patient.Model";
import {
    ChevronRightCircleIcon, ChevronsDownUpIcon, ChevronsUpDownIcon, CircleXIcon,
    ImageIcon, MarsIcon, PencilIcon, ShellIcon, ShieldPlusIcon, TransgenderIcon, TrashIcon, VenusIcon
} from "lucide-react";
import createDefaultFilter, { type Filter } from "../../BussinessLogic/Models/Generics/Filter";

import { formatDate, Roles } from "../../Helpers/Constants";
import { RouterPaths } from "../../BussinessLogic/Routes/RouterPaths";
import { useNavigate } from "react-router-dom";

import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { AddAppointmentsButton } from "./Add.Appointments.Button";
import type { LoginModel } from "../../BussinessLogic/Models/Login.Model";
import type { MenuItem } from "primereact/menuitem";
import { useAuth } from "../../BussinessLogic/Security/Auth.Context";
import { useMutationApi } from "../../BussinessLogic/Hooks/UseMutationsApi";
import { useGetApi } from "../../BussinessLogic/Hooks/UseGetApi";
import { showError, showSuccess } from "../../Helpers/Toast.Helper";
import type { PagedResults } from "../../BussinessLogic/Models/Generics/PagedResults";
import type { ColumnConfig } from "../CommonWidgets/TableColumn";
import { Image } from "primereact/image";
import { Table } from "../CommonWidgets/Table";


const ViewPatients = () => {
    const navigate = useNavigate();
    const { getUser } = useAuth();

    const [user, setUser] = useState<LoginModel | null>(null);
    const [items, setItems] = useState<MenuItem[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<PatientModel | null>(null);
    const [filter, setFilter] = useState<Filter>(
        createDefaultFilter()
    );
    const [expandedRows, setExpandedRows] = useState<any[]>([]);
    const [expanded, setExpanded] = useState<boolean>(false);

    const { mutate: deletePatient } = useMutationApi
        <boolean, number>((id) => patientsService.DeletePatient(id ?? -1), {
            optimisticUpdate: () => {
                refetch();
            },
            onSuccess: () => {
                showSuccess("Patient has been deleted");
            },
            onError: () => {
                showError("Patient could not be deleted");
            },
        });

    const { data: patients, loading, refetch } = useGetApi<PagedResults<PatientModel>, Filter>(
        (filter) =>
            patientsService.GetPatients(false, filter!),
        { immediate: true, payload: filter },
        [filter]
    );

    useEffect(() => {
        const u = getUser();
        setUser(u!);
    }, []);

    useEffect(() => {

        const detailsItem = {
            label: 'Details',
            icon: <ChevronRightCircleIcon className="w-[15px] mr-1" />,
            command: () => {
                navigate(`${RouterPaths.viewPatientDetail}/${selectedPatient!.id}`);
            },
        }
        const mItems =
            user != null && user?.role != Roles.doctor.id ?
                [
                    {
                        label: 'Edit',
                        icon: <PencilIcon className="w-[15px] mr-1" />,
                        command: () => editPatient(selectedPatient!),
                    },
                    detailsItem,
                    {
                        label: 'Delete',
                        icon: <TrashIcon className="w-[15px] mr-1" />,
                        command: () => confirmDelete(selectedPatient!.id),
                    },
                ]
                : [
                    detailsItem
                ];

        setItems(mItems);
    }, [user, selectedPatient]);



    const toggleAll = () => {
        if (expanded) {
            setExpandedRows([]);
        } else {
            setExpandedRows(patients!.data);
        }
        setExpanded(!expanded);
    }

    const editPatient = (rowData: PatientModel) => {
        navigate(`${RouterPaths.createPatients}/${rowData.id}`);
    };

    const confirmDelete = (id: number) => {
        confirmDialog({
            message: 'Do you want to change the delet this patient?',
            header: 'Change Status Confirmation',
            icon: <CircleXIcon />,
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept: () => deletePat(id),
            reject: () => { }
        });
    };

    const deletePat = async (id: number) => {
        await deletePatient(id);
    };

    const rowExpansionTemplate = (data: any) => {
        return (

            <div className="flex dark:bg-gray-700 dark:text-white bg-gray-300 text-black -m-2 transform transition-all duration-300 origin-top">
                <div className="p-2 flex-none font-bold border border-gray-600 dark:border-gray-300">Father's/Husband's Name:</div >
                <div className="p-2 flex-1 border-t border-b border-gray-600 dark:border-gray-300">{data.fatherName}</div >
                <div className="p-2 flex-none font-bold border border-gray-600 dark:border-gray-300">Address:</div >
                <div className="p-2 flex-3 border border-l-0 border-gray-600 dark:border-gray-300"> {data.address}</div >
            </div>
        );
    };

    const cnicTemplate = (rowData: PatientModel): string => {
        const cnic = rowData.cnic;
        if (!cnic) return "";
        const digits = cnic.replace(/\D/g, "");
        const padded = digits.padStart(13, "0");
        return `${padded.substring(0, 5)}-${padded.substring(5, 12)}-${padded.substring(12, 13)}`;
    };
    const dateTemplate = (rowData: PatientModel) => {
        const date = rowData.dateOfBirth;
        return formatDate(date, "dd-MM-yy");
    };
    const genderTemplate = (rowData: PatientModel) => {
        const gender = rowData.gender;
        return <div className=" items-center justify-center" >
            {
                gender === 1 ? (
                    <MarsIcon className="text-blue-500 dark:text-blue-300" />
                ) : gender === 2 ? (
                    <VenusIcon className="text-pink-500 dark:text-pink-300" />
                ) : (
                    <TransgenderIcon className="text-purple-500 dark:text-purple-300" />
                )}

        </div>;
    };

    const bloodGroupHeaderIcon = () => {
        return <ShellIcon />
    }


    const genderHeaderIcon = () => {
        return (<ShieldPlusIcon />);
    }

    const imageHeaderIcon = () => {
        return (<ImageIcon />);
    }
    const appointmentButtonsTemplate = (rowData: PatientModel) => {
        var key = Math.random();
        return (<AddAppointmentsButton loadData={() => refetch()} id={rowData.id} randomKey={key} />);
    }
    const imageTemplate = (rowData: PatientModel) => {
        return (
            <Image src={rowData.picture} alt="Image" width="15" preview />
        );
    }

    const expandHeader = () => {

        return (<button className="btn btn-transparent btn-rounded" onClick={() => toggleAll()}>
            {!expanded ? <ChevronsUpDownIcon /> : <ChevronsDownUpIcon />}
        </button>);
    }

    const navItems = [
        { name: "Home", link: "/" },
        { name: "Patients", link: undefined },
        { name: "View", link: undefined } // last breadcrumb, no link
    ];
    const title = "View Patients";

    const columnConfig: ColumnConfig<PatientModel>[] = [
        { key: "1", field: "id", header: "ID", style: { width: "5%" }, sortable: true },
        { key: "2", header: imageHeaderIcon, body: imageTemplate, style: { width: "5%" } },
        { key: "3", header: "Name", field: "name", style: { width: "15%" }, sortable: true },
        { key: "4", header: "PN", field: "patientNumber", style: { width: "12%" }, sortable: true },
        { key: "5", header: "DOB", body: dateTemplate, style: { width: "8%" }, sortable: true },
        { key: "6", header: genderHeaderIcon, body: genderTemplate, style: { width: "5%" }, sortable: true },
        { key: "7", header: "CNIC", body: cnicTemplate, style: { width: "8%" } },
        { key: "8", header: bloodGroupHeaderIcon, field: "bloodGroup", style: { width: "8%" } },
        { key: "4", header: "City", field: "city", style: { width: "12%" }, sortable: true },
        { key: "4", header: "Province", field: "province", style: { width: "12%" }, sortable: true },
        { key: "10", header: "Action", body: appointmentButtonsTemplate, style: { width: "29%" } },
        { key: "11", header: expandHeader, style: { width: "5%" }, expander: true },
    ];


    return (
        <>

            <ConfirmDialog />

            <Breadcrumbs nav={navItems} title={title} />

            <div className="bg-gray-300 dark:bg-gray-700 w-full p-2 mb-3 mt-5">

                <Table<PatientModel>
                    data={patients!}
                    loading={loading}
                    title="patients"
                    columns={columnConfig}
                    setFilter={(f) => setFilter(f)}
                    filter={filter}
                    refresh={() => refetch()}
                    expandedRows={expandedRows}
                    onRowToggle={(e: any) => { setExpandedRows(e); }}
                    rowExpansionTemplate={rowExpansionTemplate}
                    contextMenuSelection={selectedPatient!}
                    onContextMenuSelectionChange={(e) => setSelectedPatient(e)}
                    contextMenuItems={items}
                />

            </div>

        </>
    )
}

ViewPatients.getLayout = (page: any) => {
    return (
        <Layout>{page}</Layout>
    )
}
export default ViewPatients