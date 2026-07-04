import { createBrowserRouter } from "react-router-dom";
import { RouterParams, RouterPaths } from "./RouterPaths";

import Dashboard from '../../pages/Dashboard';
import Login from '../../pages/Login'
import ViewUsers from "../../pages/Users/View";
import CreateUsers from "../../pages/Users/Create";
import ManageCities from "../../pages/Cities/Manage";
import ManageProvinces from "../../pages/Provinces/Manage";
import { ProtectedRoute } from "../Security/Protected.Route";
import { Roles } from "../../Helpers/Constants";
import UnAuthorized from "../../Layout/UnAuthorized";
import CreatePatients from "../../pages/Patients/Create";
import ViewPatients from "../../pages/Patients/View";
import ManageMedications from "../../pages/Medication/Manage";
import ManageMedicationTypes from "../../pages/MedicationType/Manage";
import ManageTests from "../../pages/Lab/Tests/Manage";
import ManageTestParameters from "../../pages/Lab/TestParameters/Manage";
import ManageProcedureTypes from "../../pages/ProcedureType/Manage";
import ManageProcedures from "../../pages/Procedure/Manage";
import ViewAppointments from "../../pages/Appointments/View";
import ManageReports from "../../pages/Lab/Reports/Manage";
import ManageReceipts from "../../pages/Receipt/Manage";
import ViewReceipts from "../../pages/Receipt/Table";
import PatientProfile from "../../pages/Patients/PetientProfile";
import CreatePrescriptions from "../../pages/Prescriptions/Create";
import ViewPrescriptions from "../../pages/Prescriptions/View";


const generateRoutesWithLayout = (routeArray: any) => {
    return routeArray?.map((route: any) => {
        let element = route.element;

        // Handle nested routes
        if (route.children?.length > 0) {
            return {
                path: route.path,
                children: generateRoutesWithLayout(route.children),
            };
        }

        // If element is ProtectedRoute with children
        if (element?.type?.name === "ProtectedRoute" && element.props?.children) {
            const child = element.props.children;

            if (child.type?.getLayout) {
                return {
                    path: route.path,
                    element: (
                        <element.type {...element.props}>
                            {child.type.getLayout(child)}
                        </element.type>
                    ),
                };
            }

            return { path: route.path, element };
        }

        // Normal case: page defines getLayout
        if (element?.type?.getLayout) {
            return {
                path: route.path,
                element: element.type.getLayout(element),
            };
        }

        // Fallback
        return { path: route.path, element };
    });
};
const router = [
    { path: RouterPaths.login, element: <Login /> },
    { path: RouterPaths.unAuthorized, element: <UnAuthorized /> },
    { path: RouterPaths.dashboard, element: <ProtectedRoute allowedRoles={[Roles.admin, Roles.doctor, Roles.staff]} ><Dashboard /></ProtectedRoute> },

    { path: `${RouterPaths.createUsers}/:${RouterParams.id}`, element: <ProtectedRoute allowedRoles={[Roles.admin]} ><CreateUsers /></ProtectedRoute> },
    { path: RouterPaths.createUsers, element: <ProtectedRoute allowedRoles={[Roles.admin]} ><CreateUsers /></ProtectedRoute> },
    { path: RouterPaths.viewUsers, element: <ProtectedRoute allowedRoles={[Roles.admin, Roles.doctor]} ><ViewUsers /></ProtectedRoute> },

    { path: RouterPaths.manageCities, element: <ProtectedRoute allowedRoles={[Roles.admin, Roles.staff]} ><ManageCities /></ProtectedRoute> },

    { path: RouterPaths.manageProvinces, element: <ProtectedRoute allowedRoles={[Roles.admin, Roles.staff]} ><ManageProvinces /></ProtectedRoute> },

    { path: RouterPaths.createPatients, element: <ProtectedRoute allowedRoles={[Roles.admin]} ><CreatePatients /></ProtectedRoute> },
    { path: `${RouterPaths.createPatients}/:${RouterParams.id}`, element: <ProtectedRoute allowedRoles={[Roles.admin]} ><CreatePatients /></ProtectedRoute> },
    { path: RouterPaths.viewPatients, element: <ProtectedRoute allowedRoles={[Roles.admin, Roles.doctor]} ><ViewPatients /></ProtectedRoute> },
    { path: `${RouterPaths.viewPatientDetail}/:${RouterParams.id}`, element: <ProtectedRoute allowedRoles={[Roles.admin, Roles.staff, Roles.doctor]} ><PatientProfile /></ProtectedRoute> },

    { path: RouterPaths.manageMedicationTypes, element: <ProtectedRoute allowedRoles={[Roles.admin, Roles.staff]} ><ManageMedicationTypes /></ProtectedRoute> },
    { path: RouterPaths.manageMedications, element: <ProtectedRoute allowedRoles={[Roles.admin, Roles.staff]} ><ManageMedications /></ProtectedRoute> },

    { path: RouterPaths.manageLabReports, element: <ProtectedRoute allowedRoles={[Roles.admin, Roles.staff, Roles.doctor]} ><ManageReports /></ProtectedRoute> },
    { path: RouterPaths.manageTests, element: <ProtectedRoute allowedRoles={[Roles.admin, Roles.staff]} ><ManageTests /></ProtectedRoute> },
    { path: RouterPaths.manageTestParameters, element: <ProtectedRoute allowedRoles={[Roles.admin, Roles.staff]} ><ManageTestParameters /></ProtectedRoute> },

    { path: RouterPaths.manageProcedureTypes, element: <ProtectedRoute allowedRoles={[Roles.admin, Roles.staff, Roles.doctor]} ><ManageProcedureTypes /></ProtectedRoute> },
    { path: RouterPaths.manageProcedures, element: <ProtectedRoute allowedRoles={[Roles.admin, Roles.staff, Roles.doctor]} ><ManageProcedures /></ProtectedRoute> },

    { path: RouterPaths.viewAppointments, element: <ProtectedRoute allowedRoles={[Roles.admin, Roles.staff, Roles.doctor]} ><ViewAppointments /></ProtectedRoute> },

    { path: RouterPaths.manageReceipts, element: <ProtectedRoute allowedRoles={[Roles.admin, Roles.staff, Roles.doctor]} ><ManageReceipts /></ProtectedRoute> },
    { path: RouterPaths.viewReceipts, element: <ProtectedRoute allowedRoles={[Roles.admin, Roles.staff, Roles.doctor]} ><ViewReceipts /></ProtectedRoute> },

    { path: `${RouterPaths.createPrescription}/:${RouterParams.id}`, element: <ProtectedRoute allowedRoles={[Roles.admin, Roles.staff, Roles.doctor]} ><CreatePrescriptions /></ProtectedRoute> },
    { path: RouterPaths.viewPrescriptions, element: <ProtectedRoute allowedRoles={[Roles.admin, Roles.staff, Roles.doctor]} ><ViewPrescriptions /></ProtectedRoute> },


];


export const routers = createBrowserRouter(router);

