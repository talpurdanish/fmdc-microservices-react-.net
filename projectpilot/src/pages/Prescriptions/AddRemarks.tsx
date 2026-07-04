import { PlusIcon, RotateCcwIcon } from "lucide-react";

import { useEffect, useState } from "react";

import { TextAreaWithCount } from "../CommonWidgets/TextAreaWithCount";



interface Props {

    addDiagnosisAndRemarks: (diagnosis: string, remarks: string) => void;
    diagnosis: string;
    remarks: string;
}

export const AddRemarks = ({ addDiagnosisAndRemarks, diagnosis, remarks }: Props) => {

    const [localDiagnosis, setDiagnosis] = useState<string>(diagnosis);
    const [localRemarks, setRemarks] = useState<string>(remarks);

    useEffect(() => {

        setDiagnosis(diagnosis);
        setRemarks(remarks);

    }, [diagnosis, remarks]);


    const onDiagnosisChange = (u: string) => {
        setDiagnosis(u);
    }

    const onRemarksChange = (u: string) => {
        setRemarks(u);
    }

    const addDiagnosisAndRemarksCall = () => {

        if (localDiagnosis != "" || localRemarks != "") {
            addDiagnosisAndRemarks(localDiagnosis, localRemarks);
        }
    }

    const handleReset = () => {
        setDiagnosis("");
        setRemarks("");
    };


    return (

        <div className="section">
            <h2 className="section-header">Add Diagnosis & Remarks</h2>
            <label className="form-label" htmlFor="diagnosis">Diagnosis:</label>

            <TextAreaWithCount
                value={localDiagnosis}
                onChange={(e: string) => onDiagnosisChange(e)}
                maxLength={350}
            />
            <label className="form-label" htmlFor="remarks">Clinical Remarks:</label>

            <TextAreaWithCount
                value={localRemarks}
                onChange={(e: string) => onRemarksChange(e)}
                maxLength={350}
            />
            <div className="flex mr-auto ml-auto justify-center items-center gap-1  mt-2">
                <button
                    type="button"
                    className="btn btn-success  btn-rounded  btn-padding-md" onClick={() => addDiagnosisAndRemarksCall()}>
                    <PlusIcon className="w-[25px]" />
                    <span className="w-[85%]">Add Details</span>
                </button>
                <button
                    type="button" onClick={() => handleReset()}
                    className="btn btn-danger btn-rounded btn-padding-md">
                    <RotateCcwIcon />
                </button>
            </div>
        </div>

    );
};


