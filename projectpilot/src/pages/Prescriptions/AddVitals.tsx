import { PlusIcon, RotateCcwIcon } from "lucide-react";
import { useState, type ChangeEvent } from "react";
import { FormErrors } from "../CommonWidgets/FormErrors";
import { InputNumber } from "primereact/inputnumber";
import { showSuccess } from "../../Helpers/Toast.Helper";
import { InputText } from "primereact/inputtext";
import { InputWithSuffix } from "../CommonWidgets/InputWithSuffix";

interface Props {
    addVitals: (
        Bp: string,
        Pulse: number,
        Bsr: number,
        Temp: number,
        Wt: number,
        Ht: number) => void;
}

export const VitalsForm = ({ addVitals }: Props) => {
    const [errors, setErrors] = useState<any>({});
    const [submitError, setSubmitError] = useState<string | null>(null);

    const [bp, setBp] = useState<string>("120/80");
    const [pulse, setPulse] = useState<number>(76);
    const [bsr, setBsr] = useState<number>(29);
    const [temp, setTemp] = useState<number>(102);
    const [wt, setWt] = useState<number>(56.8);
    const [ht, setHt] = useState<number>(5.6);

    const bpUnit = " mm/hg";

    const onBpChange = (value: string) => {
        value = value.replace(bpUnit, '');
        setBp(value.trim());
        clearError(1);
    };

    const onPulseChange = (value: number) => {
        setPulse(value);
        clearError(2);
    };

    const onBsrChange = (bsr: number) => {
        setBsr(bsr);
        clearError(3);
    }

    const onTempChange = (value: number) => {
        setTemp(value);
        clearError(4);
    }

    const onWtChange = (value: number) => {
        setWt(value);
        clearError(5);
    }

    const onHtChange = (value: number) => {
        setHt(value);
        clearError(6);
    }

    const addVitalsCall = () => {

        if (validate()) {
            addVitals(bp, pulse, bsr, temp, wt, ht);
            handleReset();
            showSuccess("Vitals have been added");
        }
    };

    const validate = (): boolean => {
        if (bp == "" || bp == undefined) {
            addError(1);
            return false;
        }

        if (pulse <= 0 || pulse == undefined) {
            addError(2);
            return false;
        }

        if (bsr <= 0 || bsr == undefined) {
            addError(3);
            return false;
        }

        if (temp <= 0 || temp == undefined) {
            addError(4);
            return false;
        }

        if (wt <= 0 || wt == undefined) {
            addError(5);
            return false;
        }

        if (ht <= 0 || ht == undefined) {
            addError(6);
            return false;
        }

        return true;
    }

    const handleReset = () => {

        setBp("");
        setPulse(0);
        setBsr(0);
        setTemp(0);
        setWt(0);
        setHt(0);
        clearError();
        setSubmitError(null);
    };

    const clearError = (type: number = 0) => {
        setErrors((prevErrors: any) => {
            if (type === 0) {
                return {};
            }
            const newErrors = { ...prevErrors };
            if (type === 1) {
                delete newErrors.bp;
            }

            else if (type === 2) {
                delete newErrors.pulse;
            }

            else if (type === 3) {
                delete newErrors.bsr;
            }

            else if (type === 4) {
                delete newErrors.temp;
            }

            else if (type === 5) {
                delete newErrors.wt;
            }

            else if (type === 6) {
                delete newErrors.ht;
            }

            return newErrors;
        });
    };
    const addError = (type: number) => {
        setErrors((prevErrors: any) => {
            const newErrors: any = { ...prevErrors }; // copy existing errors

            if (type === 1) {
                newErrors.bp = { message: "Please enter patient's BP" };
            }

            else if (type === 2) {
                newErrors.pulse = { message: "Please enter patient's pulse" };
            }

            else if (type === 3) {
                newErrors.bsr = { message: "Please enter patient's BSR" };
            }

            else if (type === 4) {
                newErrors.temp = { message: "Please enter patient's Temperature" };
            }

            else if (type === 5) {
                newErrors.wt = { message: "Please enter patient's Weight" };
            }

            else if (type === 6) {
                newErrors.ht = { message: "Please enter patient's Height" };
            }

            return newErrors;
        });
    };


    return (


        <div className="section">
            <h2 className="section-header">Add Vitals<p className="text-xs">(Metric Units)</p></h2>
            <div className="">
                <div className="flex gap-1">
                    <label className="form-label-mini">BP</label>
                    <div className="flex-1 content-stretch flex ">
                        <InputWithSuffix unit="mm/hg">
                            <InputText value={bp}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => onBpChange(e.target.value!)} />
                        </InputWithSuffix>
                    </div>
                </div>
                <div className="flex gap-1">
                    <label className="form-label-mini">Pulse</label>
                    <div className="flex-1 content-stretch">
                        <InputWithSuffix>
                            <InputNumber value={pulse} onValueChange={(e) => onPulseChange(e.value!)} />
                        </InputWithSuffix>
                    </div>
                </div>
                <div className="flex gap-1">
                    <label className="form-label-mini">BSR</label>
                    <div className="flex-1 content-stretch">
                        <InputWithSuffix unit="mg/dl">
                            <InputNumber value={bsr} onValueChange={(e) => onBsrChange(e.value!)}
                                mode="decimal" minFractionDigits={1} maxFractionDigits={2} />
                        </InputWithSuffix>
                    </div>
                </div>
                <div className="flex gap-1">
                    <label className="form-label-mini">Temp</label>
                    <div className="flex-1 content-stretch">
                        <InputWithSuffix unit="°C">
                            <InputNumber value={temp} onValueChange={(e) => onTempChange(e.value!)}
                                mode="decimal" minFractionDigits={1} maxFractionDigits={2}
                                max={107} min={76} />
                        </InputWithSuffix>
                    </div>
                </div>
                <div className="flex gap-1">
                    <label className="form-label-mini">Wt</label>
                    <div className="flex-1 content-stretch">
                        <InputWithSuffix unit="Kg">
                            <InputNumber value={wt} onValueChange={(e) => onWtChange(e.value!)}
                                mode="decimal" minFractionDigits={1} maxFractionDigits={2} />
                        </InputWithSuffix>

                    </div>
                </div>
                <div className="flex gap-1 content-stretch">
                    <label className="form-label-mini">Ht</label>
                    <div className="flex-1">
                        <InputWithSuffix unit="m">
                            <InputNumber value={ht} onValueChange={(e) => onHtChange(e.value!)}
                                mode="decimal" minFractionDigits={1} maxFractionDigits={2} />
                        </InputWithSuffix>

                    </div>
                </div>
            </div>
            <FormErrors errors={errors} submitError={submitError} width="100%" />
            <div className="flex mr-auto ml-auto justify-center items-center gap-1 mt-2">
                <button
                    type="button"
                    className="btn btn-success btn-rounded btn-padding-sm" onClick={() => addVitalsCall()}>
                    <PlusIcon className="w-[30%]" />
                    <span className="w-[70%]">Add</span>
                </button>
                <button
                    type="button" onClick={() => handleReset()}
                    className="btn btn-danger btn-rounded btn-padding-sm">
                    <RotateCcwIcon />

                </button>
            </div>
        </div>

    );
};


