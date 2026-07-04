import { Layout } from "../../../Layout/main_layout/Layout"
import Breadcrumbs from "../../CommonWidgets/Breadcrumbs";

import { useState, useEffect, useRef, type JSX } from 'react';

import { type TestModel } from "../../../BussinessLogic/Models/Test.Model";

import { TestForm } from "./Form";
import { TestTable } from "./Table";
import type { LoginModel } from "../../../BussinessLogic/Models/Login.Model";
import { useAuth } from "../../../BussinessLogic/Security/Auth.Context";
import { Roles } from "../../../Helpers/Constants";

const ManageTests = () => {

    const [user, setUser] = useState<LoginModel | null>(null);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedTest, setSelectedTest] = useState<TestModel | undefined>(undefined);

    const testTableRef = useRef<{ loadData: () => void }>(null);

    const { getUser } = useAuth();
    const handleEdit = (test: TestModel) => {

        setIsEdit(true);
        setSelectedTest(test);
    };

    const navItems = [
        { name: "Home", link: "/" },
        { name: "Tests", link: undefined },
        { name: "Manage", link: undefined }
    ];
    const title = "Manage Tests";

    useEffect(() => {
        setUser(getUser());
        setIsEdit(false);

    }, []);



    return (
        <>
            <Breadcrumbs nav={navItems} title={title} />
            <div className=" w-full flex">
                {user?.role == Roles.admin.id && <div className="w-[30%] flex-auto p-5 mr-1 dark:bg-[#2a323d]">
                    <TestForm
                        isEdit={isEdit}
                        initialValues={selectedTest!}
                        loadData={() => testTableRef.current?.loadData()}
                    />

                </div>}
                <div className="w-[69%] flex-auto">
                    <TestTable role={user?.role ?? -1} onEdit={(selectedTest) => handleEdit(selectedTest!)} ref={testTableRef} />
                </div>
            </div>
        </>
    )
};

ManageTests.getLayout = (page: JSX.Element) => {
    return (
        <Layout>{page}</Layout>
    )
}
export default ManageTests