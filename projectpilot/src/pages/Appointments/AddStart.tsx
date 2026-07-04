import { useState } from "react";

import { appointmentsService, usersService } from "../../BussinessLogic/Index.Service";

import { Dialog } from "primereact/dialog";
import { Dropdown, type DropdownChangeEvent } from "primereact/dropdown";
import { type NameIdPair } from "../../BussinessLogic/Models/Generics/NameIdPair";
import { useMutationApi } from "../../BussinessLogic/Hooks/UseMutationsApi";
import { useGetApi } from "../../BussinessLogic/Hooks/UseGetApi";
import { showError, showSuccess } from "../../Helpers/Toast.Helper";


interface PatientUserIdPair {
    patientId: number;
    userId: number;
}

interface AddStartProps {
    id: number;
    visible: boolean;
    hide: () => void;
}

export const AddStart = ({ id, visible, hide }: AddStartProps) => {

    const [userId, setUserId] = useState<number>(-1);
    const [error, setError] = useState<string | null>(null);


    const { data: doctors } = useGetApi<NameIdPair[]>(
        () =>
            usersService.GetDoctors(),
        { immediate: visible },
        []
    );
    const { mutate: addAppointment } = useMutationApi<boolean, PatientUserIdPair>(
        (idPair) => appointmentsService.AddAppointment(idPair!.userId ?? -1, idPair!.patientId),
        {
            optimisticUpdate: () => hide(),
            onSuccess: () => showSuccess("Appointment has been added"),
            onError: () => showError("Appointment could not be added")
        }
    );

    const addAppt = async () => {
        if (!userId || userId <= 0) {
            setError("Select a doctor");
            return;
        }
        await addAppointment({ userId, patientId: id });

    };

    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <span className="font-bold white-space-nowrap">Add Appointment</span>
        </div>
    );

    const footerContent = (
        <div className='flex justify-end-safe'>
            <div className="flex-1 justify-start">
                {error && <p className="text-red-500">{error}</p>}
            </div>
            <button className="btn btn-success btn-rounded btn-padding-md" onClick={() => addAppt()} autoFocus>Add</button>
            <button className="btn btn-danger btn-rounded btn-padding-md" onClick={() => hide()}  > Cancel</button>
        </div>
    );

    return (
        <>
            <Dialog visible={visible} modal header={headerElement} footer={footerContent} className="w-[30%]" onHide={() => { hide(); }}>
                <div className='flex' >
                    <label className="w-[30%] form-label flex-1" htmlFor="userId">Doctor:</label>
                    <Dropdown
                        value={userId}
                        options={doctors!}
                        onChange={(e: DropdownChangeEvent) => setUserId(e.value)}
                        showClear
                        optionValue="id"
                        optionLabel="name"
                        placeholder="Select a Doctor"
                        className="form-control w-[70%] flex-5"
                    />
                </div>
            </Dialog>
        </>
    )
}