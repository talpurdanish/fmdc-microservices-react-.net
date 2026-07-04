
import { useEffect, useState } from 'react';
import { usersService } from "../../BussinessLogic/Index.Service";

import { Dialog } from 'primereact/dialog';

import { useMutationApi } from '../../BussinessLogic/Hooks/UseMutationsApi';
import { showError, showSuccess } from '../../Helpers/Toast.Helper';
import { InputNumber } from 'primereact/inputnumber';

interface FeesIdPair {
    id: number;
    fees: number;
}

interface Props {
    id: number;
    visible: boolean;
    hide: () => void;
    initialFees?: number;
};

export const AddFees = ({ id, visible, hide, initialFees = 0 }: Props) => {

    const [fees, setFees] = useState<number>(initialFees);

    useEffect(() => {

        setFees(initialFees);
    }, [
        initialFees
    ])

    const { mutate: AddFeesCall } = useMutationApi<boolean, FeesIdPair>((feesIdPair) => usersService.AddFees(feesIdPair!.id ?? -1, feesIdPair!.fees), {
        optimisticUpdate() {
            hide();
        },
        onSuccess: () => {
            showSuccess("Doctor's Fees has been changed");
        },
        onError: () => {
            showError("Doctor's Fees could not be changed");
        },
    });

    const AddFees = async () => {
        await AddFeesCall({ id, fees });
    };

    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <span className="font-bold white-space-nowrap">Add Fees</span>
        </div>
    );

    const footerContent = (
        <div className='flex justify-end-safe'>
            <button className="btn btn-success btn-rounded btn-padding-md" onClick={() => AddFees()} autoFocus> Add</button>
            <button className="btn btn-danger btn-rounded btn-padding-md" onClick={() => hide()}  > Cancel</button>
        </div>
    );

    return (
        <>

            <div className="card flex justify-content-center">
                <Dialog visible={visible} modal header={headerElement} footer={footerContent} className="w-[30%]" onHide={() => { hide(); }}>
                    <div className='flex' >
                        <label className="form-label flex-2/8" htmlFor="times">Doctor's Fees:</label>
                        <InputNumber value={fees} onValueChange={(e) => setFees(e.value!)} className="form-control flex-5/8" />
                    </div>
                </Dialog>
            </div>
        </>
    )
}
