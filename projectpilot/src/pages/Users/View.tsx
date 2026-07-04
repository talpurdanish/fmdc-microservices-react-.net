import { Layout } from "../../Layout/main_layout/Layout"
import Breadcrumbs from "../CommonWidgets/Breadcrumbs";

import { useState, useEffect } from 'react';
import { usersService } from "../../BussinessLogic/Index.Service";
import { type UserModel } from "../../BussinessLogic/Models/User.Model";
import {
    CheckIcon, ChevronRightCircleIcon, CircleXIcon, DollarSignIcon, ImageIcon, KeyRoundIcon,
    MarsIcon, PencilIcon, ShieldPlusIcon, TransgenderIcon, UserRoundKeyIcon, VenusIcon, XIcon
} from "lucide-react";

import createDefaultFilter, { type Filter } from "../../BussinessLogic/Models/Generics/Filter";

import { formatDate, Roles } from "../../Helpers/Constants";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useAuth } from "../../BussinessLogic/Security/Auth.Context";
import type { LoginModel } from "../../BussinessLogic/Models/Login.Model";
import { useNavigate } from "react-router-dom";
import { RouterPaths } from "../../BussinessLogic/Routes/RouterPaths";
import { ChangeRole } from "./ChangeRole";
import { Image } from "primereact/image";
import type { MenuItem } from "primereact/menuitem";
import { useGetApi } from "../../BussinessLogic/Hooks/UseGetApi";
import { useMutationApi } from "../../BussinessLogic/Hooks/UseMutationsApi";
import { showError, showSuccess } from "../../Helpers/Toast.Helper";
import type { PagedResults } from "../../BussinessLogic/Models/Generics/PagedResults";
import type { ColumnConfig } from "../CommonWidgets/TableColumn";
import { Table } from "../CommonWidgets/Table";
import { AddFees } from "./AddFees";



const ViewUsers = () => {
    const { getUser } = useAuth();
    const navigate = useNavigate();

    const [roleVisible, setRoleVisible] = useState<boolean>(false);
    const [feesVisible, setFeesVisible] = useState<boolean>(false);
    const [userId, setUserId] = useState<number>(-1);

    const [roleId, SetRoleId] = useState<number>(-1);
    const [filter, setFilter] = useState<Filter>(
        createDefaultFilter()
    );

    const [authUser, setAuthUser] = useState<LoginModel | null>(null);
    const [items, setItems] = useState<MenuItem[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserModel | null>(null);

    const { data: users, loading, refetch } = useGetApi<PagedResults<UserModel>, Filter>(
        (filter) =>
            usersService.GetUsers(false, filter!),
        { immediate: true, payload: filter },
        [filter]
    );

    const { mutate: changeStatusCall } = useMutationApi<boolean, number>((id) => usersService.ChangeStatus(id ?? -1), {
        optimisticUpdate: () => {
            refetch();
        },
        onSuccess: () => {
            showSuccess("User status has been changed");
        },
        onError: () => {
            showError("User status could not be changed");
        },
    });
    const { mutate: resetPasswordCall } = useMutationApi
        <boolean, number>((id) => usersService.ResetPassword(id ?? -1), {
            optimisticUpdate: () => {
                refetch();
            },
            onSuccess: () => {
                showSuccess("Password has been reset");
            },
            onError: () => {
                showError("Password could not be reset");
            },
        });

    useEffect(() => {
        const mItems =
            authUser != null && authUser?.role != Roles.doctor.id ?
                [
                    {
                        label: 'Edit',
                        icon: <PencilIcon className="w-[15px] mr-1" />,
                        command: () => editUser(selectedUser!),
                    },
                    {
                        label: 'Change Role',
                        icon: <UserRoundKeyIcon className="w-[15px] mr-1" />,
                        command: () => { showRoleDialog(selectedUser!.id, Number(selectedUser!.role)) },
                    },
                    {
                        label: `${selectedUser && selectedUser!.isActive ? 'Dis' : 'En'}able User`,
                        icon: selectedUser && selectedUser!.isActive ?
                            <XIcon className="w-[15px] mr-1" /> :
                            <CheckIcon className="w-[15px] mr-1" />,
                        command: () => confirmStatusChange(selectedUser!.id),
                    },
                    ...(selectedUser && selectedUser.role == Roles.doctor.id ?
                        [{
                            label: 'Add Fees',
                            icon: <DollarSignIcon />,
                            command: () => showAddFeesDialog(selectedUser!.id),
                        }] : []
                    ),
                    {
                        label: 'Reset Password',
                        icon: <KeyRoundIcon className="w-[15px] mr-1" />,
                        command: () => resetUserPassword(selectedUser!.id),
                    },

                ]
                : [
                    {
                        label: 'Details',
                        icon: <ChevronRightCircleIcon className="w-[15px] mr-1" />,
                        command: () => { showRoleDialog(selectedUser!.id, Number(selectedUser!.role)) },
                    },
                ];

        setItems(mItems);
    }, [authUser, selectedUser]);


    const editUser = (rowData: UserModel) => {
        navigate(`${RouterPaths.createUsers}/${rowData.id}`);
    };

    const confirmStatusChange = (id: number) => {
        confirmDialog({
            message: 'Do you want to change the status of this user?',
            header: 'Change Status Confirmation',
            icon: <CircleXIcon />,
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept: () => changeUserStatus(id),
            reject: () => { }
        });
    };

    const changeUserStatus = async (id: number) => {
        await changeStatusCall(id);
    };

    const resetUserPassword = async (id: number) => {
        await resetPasswordCall(id);
    };

    const showRoleDialog = (id: number, roleId: number) => {
        setUserId(id);
        setRoleVisible(true);
        SetRoleId(roleId);
    }

    const showAddFeesDialog = (id: number) => {
        setUserId(id);
        setFeesVisible(true);
    }

    useEffect(() => {
        const u = getUser();
        if (u != null)
            setAuthUser(u);
    }, []);

    const navItems = [
        { name: "Home", link: "/" },
        { name: "Users", link: undefined },
        { name: "View", link: undefined } // last breadcrumb, no link
    ];
    const title = "View Users";

    const dateBodyTemplate = (rowData: UserModel) => {
        return formatDate(rowData.dateofBirth, "dd-MM-yy"); // Use your formatting function
    };

    const genderTemplate = (rowData: UserModel) => {
        return <div className={`items-center justify-center  ${rowData.status ? "gender-icons" : "pending-gender-icons"}`}>
            {rowData.gender === 1 ? (
                <MarsIcon className="male-icon" />
            ) : rowData.gender === 2 ? (
                <VenusIcon className="female-icon" />
            ) : (
                <TransgenderIcon className="trans-icon" />
            )}

        </div>;
    };

    const imageTemplate = (rowData: UserModel) => {
        return (
            <Image src={rowData.picture} alt="Image" width="15" preview />
        );
    }
    const statusHeaderTemplate = (rowData: UserModel) => {
        return (rowData.status ? '-' : "P");
    }


    const rowClass = (data: UserModel) => {
        return {
            'bg-danger': !data.isActive,
            'bg-pending': !data.status,
        };
    };

    const genderHeaderIcon = () => {
        return (<ShieldPlusIcon />);
    }

    const imageHeaderIcon = () => {
        return (<ImageIcon />);
    }

    const columnConfig: ColumnConfig<UserModel>[] = [
        { key: "1", field: "id", header: "ID", style: { width: "5%" }, sortable: true },
        { key: "2", header: imageHeaderIcon, body: imageTemplate, style: { width: "5%" } },
        { key: "3", header: "Name", field: "name", style: { width: "10%" }, sortable: true },
        { key: "4", header: "Username", field: "username", style: { width: "8%" }, sortable: true },
        { key: "5", header: "DOB", body: dateBodyTemplate, style: { width: "6%" }, sortable: true },
        { key: "6", header: genderHeaderIcon, body: genderTemplate, style: { width: "5%" }, sortable: true },
        { key: "7", header: "CNIC", field: "cnic", style: { width: "8%" } },
        { key: "8", header: "PMDC", field: "pmdcNo", style: { width: "8%" } },
        { key: "9", header: "Role", field: "roleName", style: { width: "8%" }, sortable: true },
        { key: "10", header: "Phone", field: "phoneNo", style: { width: "8%" } },
        { key: "11", header: "City", field: "city", style: { width: "10%" }, sortable: true },
        { key: "12", header: "Status", body: statusHeaderTemplate, style: { width: "8%" }, sortable: true },
    ];

    return (
        <>

            <ConfirmDialog />
            <Breadcrumbs nav={navItems} title={title} />

            <div className="bg-gray-300 dark:bg-gray-700 w-full p-2 mb-3 mt-5">

                <Table<UserModel>
                    data={users!}
                    loading={loading}
                    title="users"
                    columns={columnConfig}
                    setFilter={(f) => setFilter(f)}
                    filter={filter}
                    refresh={() => refetch()}
                    rowClass={rowClass}
                    contextMenuSelection={selectedUser!}
                    onContextMenuSelectionChange={(e) => {
                        setSelectedUser(e);
                    }}
                    contextMenuItems={items}
                />

                <ChangeRole visible={roleVisible} id={userId} hide={() => {
                    setRoleVisible(false);
                    refetch();
                }} disabledRole={roleId} />

                <AddFees visible={feesVisible} id={userId} hide={() => {
                    setFeesVisible(false);
                    refetch();
                }} />

            </div>
        </>
    )
}

ViewUsers.getLayout = (page: any) => {
    return (
        <Layout>{page}</Layout>
    )
}
export default ViewUsers