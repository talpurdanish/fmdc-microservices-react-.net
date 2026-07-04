import { useEffect, useRef, useState } from "react";
import { usersService } from "../../BussinessLogic/Index.Service";
import { Dropdown, type DropdownChangeEvent } from "primereact/dropdown";
import { DollarSignIcon, RotateCcwIcon } from "lucide-react";

import { useGetApi } from "../../BussinessLogic/Hooks/UseGetApi";
import { type NameIdPair } from "../../BussinessLogic/Models/Generics/NameIdPair";
import { InputNumber } from "primereact/inputnumber";
import { FormErrors } from "../CommonWidgets/FormErrors";
import { showSuccess } from "../../Helpers/Toast.Helper";

interface createReceiptProps {
    addDiscount: (id: number, discount: number) => void;
}

export const AddDiscount = ({ addDiscount }: createReceiptProps) => {
    const [errors, setErrors] = useState<any>({});
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
    const [doctorId, setDoctorId] = useState<number>(0);
    const [discount, setDiscount] = useState<number>(0);

    const dropdownRefDoctor = useRef<Dropdown>(null);

    const { data: doctors } = useGetApi<NameIdPair[]>(
        () =>
            usersService.GetDoctors(),
        { immediate: true },
    );


    const callAddDiscount = () => {

        if (doctorId <= 0 || doctorId == undefined) {
            addError(2);
            return;
        }

        else if (discount <= 0) {
            addError(3);
            return;
        }
        else {
            addDiscount(doctorId, discount);
            clearError(2);
            clearError(3);
            setSubmitError(null);
            showSuccess("Discount and Authorized By has been added");
        }
    };


    const onDoctorChanged = (id: number) => {
        setDoctorId(id);
        clearError(2);
    }

    const onDiscountChanged = (value: number) => {
        setDiscount(value);
        clearError(3);
    }

    const addError = (type: number) => {
        setErrors((prevErrors: any) => {
            const newErrors: any = { ...prevErrors }; // copy existing errors


            if (type === 3) {
                newErrors.discount = { message: "Please enter a value for discount" };
            }

            else if (type === 4) {
                newErrors.testId = { message: "Please select a Test" };
            }
            return newErrors;
        });
    };

    const clearError = (type: number) => {
        setErrors((prevErrors: any) => {
            if (type === 0) {
                return {};
            }

            const newErrors = { ...prevErrors };

            if (type === 3) {
                delete newErrors.discount;
            }

            else if (type === 4) {
                delete newErrors.testId;
            }

            return newErrors;
        });
    };

    const handleReset = () => {
        clearError(0);
        setSubmitSuccess(null);
        setSubmitError(null);
        dropdownRefDoctor.current?.clear();
    };

    useEffect(() => {
        handleReset();
    }, []);


    return (
        <>

            <div className="section flex gap-1">
                <div className="section-header">Add Discount</div>
                <div className="flex-1">
                    <div className="flex gap-1">
                        <label className="form-label max-w-30" htmlFor="discount">Discount:</label>
                        <InputNumber
                            value={discount}
                            onValueChange={(e) => onDiscountChanged(e.value!)}
                            mode="decimal"
                            minFractionDigits={2}
                            maxFractionDigits={2}
                            min={0}
                            max={100}
                            step={5}
                            className="form-control"
                        />
                    </div>
                    <div className="flex gap-1">
                        <label className="form-label max-w-30" htmlFor="doctorId">Authorized By:</label>
                        <Dropdown
                            ref={dropdownRefDoctor}
                            value={doctorId}
                            onChange={(e: DropdownChangeEvent) => onDoctorChanged(e.value)}
                            options={doctors!}
                            showClear
                            optionValue="id"
                            optionLabel="name"
                            placeholder="Select a Doctor"
                            className="form-control"
                        /></div>
                </div>
                <div className="flex flex-col justify-end-safe gap-2">
                    <button
                        type="button"
                        className="btn btn-info btn-rounded m-1 btn-padding-md mx-auto" onClick={() => callAddDiscount()}>
                        <DollarSignIcon className="w-[20px]" />
                        <span className="w-[85%]">Add Discount</span>
                    </button>
                    <button
                        type="button" onClick={() => handleReset()}
                        className="btn btn-danger m-1 btn-rounded  btn-padding-md" >
                        <RotateCcwIcon className="w-[20px]" />
                        <span className="w-[85%]">Reset</span>
                    </button>
                </div>
            </div>
            <FormErrors errors={errors} submitError={submitError} submitSuccess={submitSuccess} width="100%" />

        </>
    )
}

