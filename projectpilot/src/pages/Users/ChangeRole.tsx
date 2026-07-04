
import { useState } from 'react';
import { usersService } from "../../BussinessLogic/Index.Service";

import { Dialog } from 'primereact/dialog';
import { Dropdown, type DropdownChangeEvent } from 'primereact/dropdown';
import { useMutationApi } from '../../BussinessLogic/Hooks/UseMutationsApi';
import { showError, showSuccess } from '../../Helpers/Toast.Helper';

interface RoleIdPair {
    id: number;
    role: number;
}

interface ChangeRoleProps {
    id: number;
    visible: boolean;
    hide: () => void;
    disabledRole: number;
};

export const ChangeRole = ({ id, visible, hide, disabledRole }: ChangeRoleProps) => {

    const [role, setRole] = useState<number>(-1);

    const { mutate: changeRolCall } = useMutationApi<boolean, RoleIdPair>((roleIdPair) => usersService.ChangeRole(roleIdPair!.id ?? -1, roleIdPair!.role), {
        optimisticUpdate() {
            hide();
        },
        onSuccess: () => {
            showSuccess("User Status has been changed");
        },
        onError: () => {
            showError("User Status could not be changed");
        },
    });

    const changeUserRole = async (id: number) => {

        await changeRolCall({ id, role });
    };

    const roles = [
        { id: 1, name: "Admin" },
        { id: 2, name: "Doctor" },
        { id: 3, name: "Patient" },
    ];

    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <span className="font-bold white-space-nowrap">Change Role</span>
        </div>
    );

    const footerContent = (
        <div className='flex justify-end-safe'>
            <button className="btn btn-success btn-rounded btn-padding-md" onClick={() => changeUserRole(id)} autoFocus> Change Role</button>
            <button className="btn btn-danger btn-rounded btn-padding-md" onClick={() => hide()}  > Cancel</button>
        </div>
    );

    return (
        <>

            <div className="card flex justify-content-center">
                <Dialog visible={visible} modal header={headerElement} footer={footerContent} className="w-[30%]" onHide={() => { hide(); }}>
                    <div className='flex' >

                        <label className="w-[30%] form-label flex-1" htmlFor="roleId">Role:</label>
                        <Dropdown
                            value={role}
                            onChange={(e: DropdownChangeEvent) => setRole(e.value)}
                            options={roles.filter((role) => role.id !== disabledRole)}
                            optionDisabled="disabled"
                            showClear
                            optionValue="id"
                            optionLabel="name"
                            placeholder="Select a Role"
                            className="form-control w-[70%] flex-5"
                        />
                    </div>
                </Dialog>
            </div>
        </>
    )
}
