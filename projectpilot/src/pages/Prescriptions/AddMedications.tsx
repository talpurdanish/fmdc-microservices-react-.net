import { PlusIcon, RotateCcwIcon } from "lucide-react";

import { useRef, useState } from "react";
import { medicationsService } from "../../BussinessLogic/Index.Service";

import { type MedicationModel } from "../../BussinessLogic/Models/Medication.Model";
import { FormErrors } from "../CommonWidgets/FormErrors";

import { Dropdown, type DropdownChangeEvent } from "primereact/dropdown";
import { useGetApi } from "../../BussinessLogic/Hooks/UseGetApi";
import { InputNumber } from "primereact/inputnumber";
import { showSuccess } from "../../Helpers/Toast.Helper";
import type { PagedResults } from "../../BussinessLogic/Models/Generics/PagedResults";

interface Props {
    addMedication: (
        code: number,
        times: number,
        days: number,
        quantity: number,
        unit: string, med: string) => void;


}

export const AddMedications = ({ addMedication }: Props) => {
    const [errors, setErrors] = useState<any>({});
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [medicationId, setMedicationId] = useState<number>(0);

    const [quantity, setQuantity] = useState<number>(0);
    const [times, setTimes] = useState<number>(0);
    const [days, setDays] = useState<number>(0);
    const [unit, setUnit] = useState<string>("");
    const [med, setMed] = useState<string>("");

    const dropdownMedicine = useRef<Dropdown | null>(null);
    const dropdownUnit = useRef<Dropdown | null>(null);

    const { data: medications } = useGetApi<PagedResults<MedicationModel>>(
        () =>
            medicationsService.GetMedications(true),
        { immediate: true },
    );


    const onMedicineIdChange = (id: number) => {
        setMedicationId(id);
        const m = medications?.data.find(m => m.code == id)?.name;
        setMed(m!);
        clearError(1);
    };


    const onQuantityChange = (id: number) => {
        setQuantity(id);
        clearError(2);
    };

    const onTimesChange = (time: number) => {
        setTimes(time);
        clearError(3);
    }

    const onDaysChange = (time: number) => {
        setDays(time);
        clearError(5);
    }

    const onUnitChange = (u: string) => {
        setUnit(u);
        clearError(4);
    }

    const addMedicationCall = () => {

        if (validateMedicine()) {
            addMedication(medicationId, times, days, quantity, unit, med);
            handleReset();
            showSuccess("Medicine has been added");
        }
    };

    const validateMedicine = (): boolean => {
        if (medicationId <= 0 || medicationId == undefined || med == "" || med == undefined) {
            addError(1);
            return false;
        }

        if (times <= 0 || times == undefined) {
            addError(2);
            return false;
        }

        if (quantity <= 0 || quantity == undefined) {
            addError(3);
            return false;
        }

        if (unit == "" || unit == undefined) {
            addError(4);
            return false;
        }

        if (days <= 0 || days == undefined) {
            addError(5);
            return false;
        }
        return true;
    }


    const handleReset = () => {

        dropdownMedicine?.current?.clear();
        dropdownUnit?.current?.clear();
        setUnit("");
        setMedicationId(-1);
        setQuantity(0);
        setTimes(0);
        clearError();
        setSubmitError(null);
    };

    const units: { Name: string, id: string }[] = [
        { Name: 'Teaspoons', id: 'tsp' },
        { Name: 'TableSpoons', id: 'Tsp' },
        { Name: 'Capsules', id: 'cap' },
        { Name: 'Tablets', id: "tab" },
        { Name: 'Drops', id: "drops" }
    ];

    const clearError = (type: number = 0) => {
        setErrors((prevErrors: any) => {
            if (type === 0) {
                return {};
            }
            const newErrors = { ...prevErrors };
            if (type === 1) {
                delete newErrors.medicineId;
            }

            else if (type === 2) {
                delete newErrors.quantity;
            }

            else if (type === 3) {
                delete newErrors.times;
            }

            else if (type === 4) {
                delete newErrors.unit;
            }

            else if (type === 5) {
                delete newErrors.days;
            }

            return newErrors;
        });
    };
    const addError = (type: number) => {
        setErrors((prevErrors: any) => {
            const newErrors: any = { ...prevErrors }; // copy existing errors

            if (type === 1) {
                newErrors.medicineId = { message: "Please select a medicine" };
            }

            else if (type === 2) {
                newErrors.quantity = { message: "Please enter medicine quantity" };
            }

            else if (type === 3) {
                newErrors.times = { message: "Please enter a value for times/day" };
            }

            else if (type === 4) {
                newErrors.unit = { message: "Please select a unit" };
            }
            else if (type === 4) {
                newErrors.days = { message: "Please enter no of days" };
            }

            return newErrors;
        });
    };

    return (
        <div className="section">
            <h2 className="section-header">Add Medications</h2>
            <div className="flex">
                <label className="form-label flex-2/8">Medicine:</label>
                <Dropdown
                    ref={dropdownMedicine}
                    value={medicationId}
                    onChange={(e: DropdownChangeEvent) => onMedicineIdChange(e.value)}
                    options={medications?.data}
                    showClear
                    optionValue="code"
                    optionLabel="name"
                    placeholder="Select a Medication"
                    className="form-control flex-5/8"
                />
            </div>
            <div className="flex">
                <label className="form-label flex-2/8" htmlFor="quantity">Quantity:</label>
                <InputNumber value={quantity} onValueChange={(e) => onQuantityChange(e.value!)} className="form-control flex-5/8" />
            </div>
            <div className="flex">
                <label className="form-label flex-2/8" htmlFor="unit">Unit:</label>
                <Dropdown
                    ref={dropdownUnit}
                    value={unit}
                    onChange={(e: DropdownChangeEvent) => onUnitChange(e.value)}
                    options={units!}
                    showClear
                    optionValue="id"
                    optionLabel="Name"
                    placeholder="Select a Unit"
                    className="form-control flex-5/8"
                /></div>
            <div className="flex">
                <label className="form-label flex-2/8" htmlFor="times">Times/Day:</label>
                <InputNumber value={times} onValueChange={(e) => onTimesChange(e.value!)} className="form-control flex-5/8" />
            </div>
            <div className="flex">
                <label className="form-label flex-2/8" htmlFor="times">Days:</label>
                <InputNumber value={times} onValueChange={(e) => onDaysChange(e.value!)} className="form-control flex-5/8" />
            </div>
            <FormErrors errors={errors} submitError={submitError} width="100%" />
            <div className="flex mr-auto ml-auto justify-center items-center gap-1 mt-2">
                <button
                    type="button"
                    className="btn btn-success btn-rounded btn-padding-md" onClick={() => addMedicationCall()}>
                    <PlusIcon className="w-[25px]" />
                    <span className="w-[85%]">Add Medicine</span>
                </button>
                <button
                    type="button" onClick={() => handleReset()}
                    className="btn btn-danger btn-rounded btn-padding-md">
                    <RotateCcwIcon />
                </button>
            </div>

        </div >
    );
};


