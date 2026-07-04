
import { type AppointmentButtonsModel } from "../../BussinessLogic/Models/Appointment.Buttons.Model";
import { appointmentsService, prescriptionsService } from "../../BussinessLogic/Index.Service";
import { CalculatorIcon, ChevronLeft, ChevronRightIcon, PrinterIcon, SmartphoneIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { LoginModel } from "../../BussinessLogic/Models/Login.Model";
import { useAuth } from "../../BussinessLogic/Security/Auth.Context";
import { Roles } from "../../Helpers/Constants";
import { AddStart } from "../Appointments/AddStart";
import { useGetApi } from "../../BussinessLogic/Hooks/UseGetApi";
import { Tooltip } from "primereact/tooltip";
import { useMutationApi } from "../../BussinessLogic/Hooks/UseMutationsApi";


import { Viewer } from "../CommonWidgets/Viewer";
import { showError, showSuccess } from "../../Helpers/Toast.Helper";
import { useNavigate } from "react-router-dom";
import { RouterPaths } from "../../BussinessLogic/Routes/RouterPaths";


interface AddAppointmentButtonProps {
    loadData: () => void;
    id: number;
    randomKey: number;
}

export const AddAppointmentsButton = ({ loadData, id, randomKey }: AddAppointmentButtonProps) => {

    const { getUser } = useAuth();
    const navigate = useNavigate();
    const [user, setUser] = useState<LoginModel | null>(null);
    const [addStartVisible, setAddStartVisible] = useState<boolean>(false);
    const [showSlip, setShowSlip] = useState<boolean>(false);
    const [width, setWidth] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const { data: button, refetch } = useGetApi<AppointmentButtonsModel, number>(
        () =>
            appointmentsService.GetAppointmentButtons(id!),
        { immediate: true, payload: id, throttleMs: 100 },
        [id]
    );

    useEffect(() => {
        refetch();
    }, [id, randomKey]);


    const { mutate: addEndDateCall } = useMutationApi<boolean, number>((id) => appointmentsService.AddEndDate(id!, "p"), {
        optimisticUpdate: () => {
            refetch();
            loadData();
        },
        onSuccess: () => {
            showSuccess("Appointment has been ended");
        },
        onError: () => {
            showError("Appointment could not be ended");
        },
    });

    useEffect(() => {
        const u = getUser();
        setUser(u!);

    }, []);


    const Manage = (type: number): void => {
        if (user != null && user?.role != Roles.doctor.id) {
            switch (type) {
                case 1:
                    setWidth("30%");
                    setTitle(button?.title!);
                    setAddStartVisible(true);
                    break;
                case 2:
                    if (button) {
                        navigate(`${RouterPaths.createPrescription}/${button.aId}`)
                    }
                    break;
                case 3:
                    setTitle(button?.title!);
                    setWidth("100%");
                    setShowSlip(true);
                    break;
                case 4:
                    addEndDateCall(id);
                    break;
                case 5:
                    if (button) {
                        navigate(`${RouterPaths.manageReceipts}?patientId=${id}&appointmentId=${button.aId}`)
                    }
                    break;
            }
            loadData();
        }
    }


    const CreateButton = (className: string, disabled: boolean, fn: () => void, icon: any, tooltip: string) => {

        return (<button type="button"
            className={`btn btn-padding-xs ${className} tooltip-icon`}
            data-pr-tooltip={tooltip}
            data-pr-position="top"
            data-pr-hidedelay={0}
            disabled={disabled}
            onClick={() => fn()} >
            {icon}
        </button >);

    }


    return (
        <>
            <Tooltip target=".tooltip-icon" />
            {user != null && user?.role != Roles.doctor.id && <div className="btn-group" >
                {CreateButton("btn-success", !button?.startVisible!, () => Manage(1), <ChevronRightIcon />, "Start Appointment")}
                {CreateButton("btn-info", !button?.prescriptionVisible!, () => Manage(2), <SmartphoneIcon />, "Create Prescription")}
                {CreateButton("btn-gray", !button?.endVisible!, () => Manage(4), <ChevronLeft />, "End Appointment")}
                {CreateButton("btn-warning", !button?.slipVisible!, () => Manage(3), <PrinterIcon />, "Print Slip")}
                {CreateButton("btn-danger", !button?.receiptVisible!, () => Manage(5), <CalculatorIcon />, "Print Receipt")}
            </div >
            }
            <AddStart visible={addStartVisible} hide={() => setAddStartVisible(false)} id={id} />
            {showSlip && <Viewer
                width={width}
                fullscreen={width == "100%"}
                visible={showSlip}
                hide={() => setShowSlip(false)}
                id={id!}
                title={`Slip for ${title}`}
                serviceFn={(id) => prescriptionsService.GeneratePrescription(id!)}
            />}

        </>
    );
};