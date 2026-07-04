import { AuthService } from "./Services/Auth.Service";
import { CityService } from "./Services/Cities.Service";
import { ProvinceService } from "./Services/Provinces.Service";
import { UserService } from "./Services/Users.Service";
import { PatientService } from "./Services/Patients.Service";
import { MedicationTypeService } from "./Services/MedicationType.Service";
import { MedicationService } from "./Services/Medication.Service";
import { TestService } from "./Services/Tests.Service";
import { TestParameterService } from "./Services/TestParameters.Service";
import { ProcedureTypeService } from "./Services/ProcedureType.Service";
import { ProcedureService } from "./Services/Procedures.Service";
import { TodoService } from "./Services/Todo.Service";
import { AppointmentsService } from "./Services/Appointments.Service";
import { PrescriptionsService } from "./Services/Prescriptions.Service";
import { LabReportsService } from "./Services/LabReports.Service";
import { ReceiptService } from "./Services/Receipt.Service";
import { PaymentsService } from "./Services/Payments.Service";
import { NotificationService } from "./Services/Notifications.Service";
import { AxiosApiClient } from "./Services/Generics/AxiosApiClient";
import type { IApiClient } from "./Services/Generics/IApiClient";
import { ChatService } from "./Services/Chat.Service";
import { Constants } from "../Helpers/Constants";
// import { FetchApiClient } from "./FetchApiClient";

const clientUsers: IApiClient = new AxiosApiClient(Constants.API_URL_U);
const clientOps: IApiClient = new AxiosApiClient(Constants.API_URL_OP);



export const authService = new AuthService(clientUsers);
export const usersService = new UserService(clientUsers);
export const citiesService = new CityService(clientUsers);
export const provincesService = new ProvinceService(clientUsers);
export const patientsService = new PatientService(clientUsers);
export const chatsService = new ChatService(clientUsers);
export const notificationsService = new NotificationService(clientUsers);
export const todosService = new TodoService(clientUsers);

export const medicationTypesService = new MedicationTypeService(clientOps);
export const medicationsService = new MedicationService(clientOps);
export const testsService = new TestService(clientOps);
export const testParametersService = new TestParameterService(clientOps);
export const procedureTypesService = new ProcedureTypeService(clientOps);
export const proceduresService = new ProcedureService(clientOps);
export const appointmentsService = new AppointmentsService(clientOps);
export const prescriptionsService = new PrescriptionsService(clientOps);
export const labReportsService = new LabReportsService(clientOps);
export const receiptsService = new ReceiptService(clientOps);
export const paymentsService = new PaymentsService(clientOps);


